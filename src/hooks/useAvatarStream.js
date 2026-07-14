import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

/* =========================================================
   RESPONSE PARSER
========================================================= */

const parseResponse = async (
  response
) => {
  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  const data =
    contentType.includes(
      "application/json"
    )
      ? await response
          .json()
          .catch(() => ({}))
      : {
          message: await response
            .text()
            .catch(() => ""),
        };

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.description ||
        `Avatar request failed (${response.status}).`
    );
  }

  return data;
};

/* =========================================================
   HOOK
========================================================= */

export default function useAvatarStream() {
  const [
    avatarConnected,
    setAvatarConnected,
  ] = useState(false);

  const [
    avatarPlaying,
    setAvatarPlaying,
  ] = useState(false);

  const [
    avatarLoading,
    setAvatarLoading,
  ] = useState(false);

  const [
    avatarError,
    setAvatarError,
  ] = useState(null);

  const [
    connectionState,
    setConnectionState,
  ] = useState("idle");

  const videoRef =
    useRef(null);

  const peerConnectionRef =
    useRef(null);

  const remoteStreamRef =
    useRef(null);

  const avatarSessionIdRef =
    useRef(null);

  const closedRef =
    useRef(false);

  const streamAttachedRef =
    useRef(false);

  const playPromiseRef =
    useRef(null);

  /* =======================================================
     ATTACH STREAM ONLY ONCE
  ======================================================= */

  const attachStreamToVideo =
    useCallback((stream) => {
      const video =
        videoRef.current;

      if (
        !video ||
        !stream
      ) {
        return false;
      }

      /*
       * Do not assign srcObject repeatedly.
       * Reassigning it interrupts video.play().
       */
      if (
        video.srcObject === stream
      ) {
        return true;
      }

      if (
        streamAttachedRef.current &&
        video.srcObject
      ) {
        return true;
      }

      video.srcObject =
        stream;

      video.autoplay =
        true;

      video.playsInline =
        true;

      /*
       * Keep D-ID muted because Gemini
       * is already playing audio.
       */
      video.muted =
        true;

      streamAttachedRef.current =
        true;

      console.log(
        "D-ID STREAM ATTACHED TO VIDEO",
        {
          audioTracks:
            stream.getAudioTracks()
              .length,

          videoTracks:
            stream.getVideoTracks()
              .length,
        }
      );

      return true;
    }, []);

  /* =======================================================
     PLAY VIDEO SAFELY
  ======================================================= */

  const playVideo =
    useCallback(async () => {
      const video =
        videoRef.current;

      if (
        !video ||
        !video.srcObject
      ) {
        return false;
      }

      /*
       * Avoid multiple simultaneous play()
       * calls, which can produce AbortError.
       */
      if (
        playPromiseRef.current
      ) {
        return playPromiseRef.current;
      }

      const attemptPlay =
        async () => {
          try {
            video.autoplay =
              true;

            video.playsInline =
              true;

            video.muted =
              true;

            /*
             * HAVE_CURRENT_DATA = 2.
             * Below that, wait for canplay.
             */
            if (
              video.readyState <
              HTMLMediaElement.HAVE_CURRENT_DATA
            ) {
              console.log(
                "D-ID VIDEO WAITING FOR MEDIA DATA:",
                video.readyState
              );

              return false;
            }

            await video.play();

            console.log(
              "D-ID VIDEO PLAY STARTED"
            );

            setAvatarPlaying(
              true
            );

            setAvatarError(
              null
            );

            return true;
          } catch (error) {
            /*
             * AbortError is usually temporary:
             * the stream or media track changed
             * while play() was starting.
             */
            if (
              error?.name ===
              "AbortError"
            ) {
              console.warn(
                "D-ID VIDEO PLAY INTERRUPTED. WILL RETRY."
              );

              return false;
            }

            console.error(
              "D-ID VIDEO PLAY ERROR:",
              error
            );

            setAvatarPlaying(
              false
            );

            setAvatarError(
              error?.message ||
                "The avatar video could not start."
            );

            return false;
          } finally {
            playPromiseRef.current =
              null;
          }
        };

      playPromiseRef.current =
        attemptPlay();

      return playPromiseRef.current;
    }, []);


    const waitForVideoFrames = useCallback(
  async ({
    attempts = 40,
    delay = 250,
  } = {}) => {
    for (
      let attempt = 1;
      attempt <= attempts;
      attempt += 1
    ) {
      if (closedRef.current) {
        return false;
      }

      const video = videoRef.current;

      if (!video || !video.srcObject) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, delay)
        );

        continue;
      }

      const videoTracks =
        video.srcObject.getVideoTracks();

      const videoTrack =
        videoTracks[0];

      console.log(
        "D-ID VIDEO FRAME CHECK:",
        {
          attempt,
          readyState: video.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          trackReadyState:
            videoTrack?.readyState,
          trackMuted:
            videoTrack?.muted,
        }
      );

      if (
        video.readyState >=
          HTMLMediaElement.HAVE_CURRENT_DATA &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        return playVideo();
      }

      await new Promise((resolve) =>
        window.setTimeout(resolve, delay)
      );
    }

    setAvatarPlaying(false);

    setAvatarError(
      "The D-ID connection is active, but no avatar video frames were received."
    );

    return false;
  },
  [playVideo]
);
  /* =======================================================
     WAIT FOR ICE GATHERING
  ======================================================= */

  const waitForIceGatheringComplete =
    useCallback(
      (peerConnection) => {
        if (
          peerConnection
            .iceGatheringState ===
          "complete"
        ) {
          return Promise.resolve();
        }

        return new Promise(
          (resolve) => {
            let finished =
              false;

            const finish =
              () => {
                if (finished) {
                  return;
                }

                finished =
                  true;

                window.clearTimeout(
                  timeoutId
                );

                peerConnection.removeEventListener(
                  "icegatheringstatechange",
                  handleStateChange
                );

                resolve();
              };

            const handleStateChange =
              () => {
                console.log(
                  "D-ID ICE GATHERING STATE:",
                  peerConnection
                    .iceGatheringState
                );

                if (
                  peerConnection
                    .iceGatheringState ===
                  "complete"
                ) {
                  finish();
                }
              };

            const timeoutId =
              window.setTimeout(
                finish,
                5000
              );

            peerConnection.addEventListener(
              "icegatheringstatechange",
              handleStateChange
            );
          }
        );
      },
      []
    );

  /* =======================================================
     CLOSE AVATAR
  ======================================================= */

  const closeAvatar =
    useCallback(async () => {
      closedRef.current =
        true;

      streamAttachedRef.current =
        false;

      playPromiseRef.current =
        null;

      const avatarSessionId =
        avatarSessionIdRef.current;

      avatarSessionIdRef.current =
        null;

      if (
        avatarSessionId
      ) {
        await fetch(
          `${BASE_URL}/api/avatar/sessions/${avatarSessionId}`,
          {
            method:
              "DELETE",

            credentials:
              "include",
          }
        ).catch((error) => {
          console.error(
            "AVATAR SESSION DELETE ERROR:",
            error
          );
        });
      }

      const peerConnection =
        peerConnectionRef.current;

      if (
        peerConnection
      ) {
        peerConnection.ontrack =
          null;

        peerConnection.onicecandidate =
          null;

        peerConnection.onconnectionstatechange =
          null;

        peerConnection.oniceconnectionstatechange =
          null;

        peerConnection.onicegatheringstatechange =
          null;

        peerConnection.onsignalingstatechange =
          null;

        try {
          peerConnection.close();
        } catch (error) {
          console.error(
            "PEER CONNECTION CLOSE ERROR:",
            error
          );
        }
      }

      peerConnectionRef.current =
        null;

      const remoteStream =
        remoteStreamRef.current;

      if (remoteStream) {
        remoteStream
          .getTracks()
          .forEach(
            (track) => {
              try {
                track.stop();
              } catch {
                // Ignore.
              }
            }
          );
      }

      remoteStreamRef.current =
        null;

      const video =
        videoRef.current;

      if (video) {
        try {
          video.pause();
        } catch {
          // Ignore.
        }

        video.srcObject =
          null;
      }

      setAvatarConnected(
        false
      );

      setAvatarPlaying(
        false
      );

      setAvatarLoading(
        false
      );

      setConnectionState(
        "closed"
      );
    }, []);

  /* =======================================================
     SEND ICE CANDIDATE
  ======================================================= */

  const sendIceCandidate =
    useCallback(
      async ({
        avatarSessionId,
        candidate,
      }) => {
        const response =
          await fetch(
            `${BASE_URL}/api/avatar/sessions/${avatarSessionId}/ice`,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  candidate:
                    candidate
                      ?.candidate ??
                    null,

                  sdpMid:
                    candidate
                      ?.sdpMid ??
                    null,

                  sdpMLineIndex:
                    candidate
                      ?.sdpMLineIndex ??
                    null,
                }),
            }
          );

        if (
          !response.ok
        ) {
          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          console.error(
            "D-ID ICE API ERROR:",
            data
          );
        }
      },
      []
    );

  /* =======================================================
     CREATE AVATAR SESSION
  ======================================================= */

  const createAvatarSession =
    useCallback(
      async ({
        twinId,
        realtimeSessionId,
      }) => {
        if (!twinId) {
          throw new Error(
            "Twin ID is required."
          );
        }

        if (
          peerConnectionRef.current ||
          avatarSessionIdRef.current
        ) {
          await closeAvatar();
        }

        closedRef.current =
          false;

        streamAttachedRef.current =
          false;

        playPromiseRef.current =
          null;

        setAvatarLoading(
          true
        );

        setAvatarConnected(
          false
        );

        setAvatarPlaying(
          false
        );

        setAvatarError(
          null
        );

        setConnectionState(
          "creating-session"
        );

        try {
          /* ---------------------------------------------
             1. CREATE BACKEND/D-ID SESSION
          --------------------------------------------- */

          const sessionResponse =
            await fetch(
              `${BASE_URL}/api/avatar/sessions`,
              {
                method:
                  "POST",

                credentials:
                  "include",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    twinId,

                    realtimeSessionId:
                      realtimeSessionId ||
                      null,
                  }),
              }
            );

          const sessionData =
            await parseResponse(
              sessionResponse
            );

          if (
            !sessionData
              .avatarSessionId
          ) {
            throw new Error(
              "Avatar session ID was not returned."
            );
          }

          if (
            !sessionData.offer
              ?.type ||
            !sessionData.offer
              ?.sdp
          ) {
            throw new Error(
              "D-ID did not return a valid WebRTC offer."
            );
          }

          avatarSessionIdRef.current =
            sessionData.avatarSessionId;

          console.log(
            "D-ID SESSION CREATED:",
            {
              avatarSessionId:
                sessionData
                  .avatarSessionId,

              streamId:
                sessionData
                  .streamId,

              offerType:
                sessionData.offer
                  .type,

              iceServers:
                sessionData
                  .iceServers
                  ?.length ||
                0,
            }
          );

          /* ---------------------------------------------
             2. CREATE REMOTE STREAM
          --------------------------------------------- */

          const remoteStream =
            new MediaStream();

          remoteStreamRef.current =
            remoteStream;

          /* ---------------------------------------------
             3. CREATE WEBRTC CONNECTION
          --------------------------------------------- */

          const peerConnection =
            new RTCPeerConnection(
              {
                iceServers:
                  Array.isArray(
                    sessionData
                      .iceServers
                  )
                    ? sessionData
                        .iceServers
                    : [],
              }
            );

          peerConnectionRef.current =
            peerConnection;

          setConnectionState(
            "connecting-webrtc"
          );

          /* ---------------------------------------------
             4. HANDLE REMOTE AUDIO/VIDEO TRACKS
          --------------------------------------------- */

          peerConnection.ontrack =
            (event) => {
              if (
                closedRef.current
              ) {
                return;
              }

              console.log(
                "D-ID REMOTE TRACK:",
                {
                  kind:
                    event.track
                      .kind,

                  id:
                    event.track.id,

                  readyState:
                    event.track
                      .readyState,

                  muted:
                    event.track
                      .muted,

                  streamCount:
                    event.streams
                      ?.length ||
                    0,
                }
              );

              const receivedStream =
                event.streams
                  ?.length
                  ? event
                      .streams[0]
                  : null;

              /*
               * Add tracks into one stable
               * MediaStream instance.
               */
              if (
                receivedStream
              ) {
                receivedStream
                  .getTracks()
                  .forEach(
                    (track) => {
                      const exists =
                        remoteStream
                          .getTracks()
                          .some(
                            (
                              existing
                            ) =>
                              existing.id ===
                              track.id
                          );

                      if (
                        !exists
                      ) {
                        remoteStream.addTrack(
                          track
                        );
                      }
                    }
                  );
              } else {
                const exists =
                  remoteStream
                    .getTracks()
                    .some(
                      (
                        existing
                      ) =>
                        existing.id ===
                        event.track.id
                    );

                if (
                  !exists
                ) {
                  remoteStream.addTrack(
                    event.track
                  );
                }
              }

              /*
               * Attach only once.
               */
              attachStreamToVideo(
                remoteStream
              );

              event.track.onunmute =
                () => {
                  console.log(
                    "D-ID TRACK UNMUTED:",
                    event.track
                      .kind
                  );

                  /*
                   * Do not assign srcObject again.
                   */
                  if (
                    event.track
                      .kind ===
                    "video"
                  ) {
                    window.setTimeout(
                      () => {
                        playVideo();
                      },
                      100
                    );
                  }
                };

             event.track.onunmute = () => {
  console.log(
    "D-ID TRACK UNMUTED:",
    event.track.kind
  );

  if (
    event.track.kind ===
    "video"
  ) {
    waitForVideoFrames({
      attempts: 40,
      delay: 250,
    }).catch((error) => {
      console.error(
        "D-ID VIDEO FRAME WAIT ERROR:",
        error
      );
    });
  }
};

              event.track.onended =
                () => {
                  console.warn(
                    "D-ID TRACK ENDED:",
                    event.track
                      .kind
                  );
                };
            };

          /* ---------------------------------------------
             5. SEND LOCAL ICE CANDIDATES
          --------------------------------------------- */

          peerConnection.onicecandidate =
            (event) => {
              if (
                closedRef.current ||
                !avatarSessionIdRef.current
              ) {
                return;
              }

              sendIceCandidate({
                avatarSessionId:
                  sessionData
                    .avatarSessionId,

                candidate:
                  event.candidate,
              }).catch(
                (error) => {
                  console.error(
                    "D-ID ICE SEND ERROR:",
                    error
                  );
                }
              );
            };

          /* ---------------------------------------------
             6. CONNECTION STATE
          --------------------------------------------- */

          peerConnection.onconnectionstatechange =
            () => {
              const state =
                peerConnection
                  .connectionState;

              console.log(
                "D-ID CONNECTION STATE:",
                state
              );

              setConnectionState(
                state
              );

              if (
                state ===
                "connected"
              ) {
                setAvatarConnected(
                  true
                );

                setAvatarError(
                  null
                );

                /*
                 * Do not change srcObject here.
                 * Only retry play.
                 */
                window.setTimeout(
                  () => {
                    playVideo();
                  },
                  150
                );
              }

              if (
                state ===
                  "disconnected" ||
                state ===
                  "failed"
              ) {
                setAvatarConnected(
                  false
                );

                setAvatarPlaying(
                  false
                );

                setAvatarError(
                  `Avatar WebRTC connection is ${state}.`
                );
              }

              if (
                state ===
                "closed"
              ) {
                setAvatarConnected(
                  false
                );

                setAvatarPlaying(
                  false
                );
              }
            };

          peerConnection.oniceconnectionstatechange =
            () => {
              console.log(
                "D-ID ICE CONNECTION STATE:",
                peerConnection
                  .iceConnectionState
              );
            };

          peerConnection.onicegatheringstatechange =
            () => {
              console.log(
                "D-ID ICE GATHERING STATE:",
                peerConnection
                  .iceGatheringState
              );
            };

          peerConnection.onsignalingstatechange =
            () => {
              console.log(
                "D-ID SIGNALING STATE:",
                peerConnection
                  .signalingState
              );
            };

          /* ---------------------------------------------
             7. APPLY REMOTE OFFER
          --------------------------------------------- */

          await peerConnection.setRemoteDescription(
            {
              type:
                sessionData.offer
                  .type,

              sdp:
                sessionData.offer
                  .sdp,
            }
          );

          console.log(
            "D-ID REMOTE DESCRIPTION SET"
          );

          /* ---------------------------------------------
             8. CREATE LOCAL ANSWER
          --------------------------------------------- */

          const answer =
            await peerConnection.createAnswer();

          await peerConnection.setLocalDescription(
            answer
          );

          await waitForIceGatheringComplete(
            peerConnection
          );

          const localDescription =
            peerConnection.localDescription;

          if (
            !localDescription
              ?.type ||
            !localDescription
              ?.sdp
          ) {
            throw new Error(
              "Browser did not create a valid SDP answer."
            );
          }

          /* ---------------------------------------------
             9. SUBMIT SDP ANSWER
          --------------------------------------------- */

          const answerResponse =
            await fetch(
              `${BASE_URL}/api/avatar/sessions/${sessionData.avatarSessionId}/answer`,
              {
                method:
                  "POST",

                credentials:
                  "include",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    answer: {
                      type:
                        localDescription
                          .type,

                      sdp:
                        localDescription
                          .sdp,
                    },
                  }),
              }
            );

          await parseResponse(
            answerResponse
          );

          console.log(
            "D-ID SDP ANSWER ACCEPTED"
          );

          return sessionData;
        } catch (error) {
          console.error(
            "CREATE AVATAR SESSION ERROR:",
            error
          );

          setAvatarError(
            error?.message ||
              "Unable to start the avatar."
          );

          setAvatarConnected(
            false
          );

          setAvatarPlaying(
            false
          );

          await closeAvatar().catch(
            () => {}
          );

          throw error;
        } finally {
          setAvatarLoading(
            false
          );
        }
      },
      [
        
  attachStreamToVideo,
  closeAvatar,
  playVideo,
  sendIceCandidate,
  waitForIceGatheringComplete,
  waitForVideoFrames,

      ]
    );

  /* =======================================================
     MAKE AVATAR SPEAK
  ======================================================= */

  const speak =
    useCallback(
      async (text) => {
        const avatarSessionId =
          avatarSessionIdRef.current;

        const normalizedText =
          String(text || "")
            .trim();

        if (
          !avatarSessionId ||
          !normalizedText
        ) {
          return false;
        }

        const response =
          await fetch(
            `${BASE_URL}/api/avatar/sessions/${avatarSessionId}/speak`,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  text:
                    normalizedText,
                }),
            }
          );

        await parseResponse(
          response
        );

        console.log(
          "D-ID SPEECH REQUEST ACCEPTED"
        );

        /*
         * Speaking usually unmutes the video
         * track. Retry play without reloading
         * the video element.
         */
        window.setTimeout(
          () => {
            playVideo();
          },
          200
        );

        return true;
      },
      [playVideo]
    );

  /* =======================================================
     COMPONENT CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      const peerConnection =
        peerConnectionRef.current;

      if (
        peerConnection
      ) {
        try {
          peerConnection.close();
        } catch {
          // Ignore.
        }
      }
    };
  }, []);

  return {
  videoRef,

  avatarConnected,
  avatarPlaying,
  avatarLoading,
  avatarError,
  connectionState,

  createAvatarSession,
  speak,
  playVideo,
  waitForVideoFrames,
  closeAvatar,
};
}