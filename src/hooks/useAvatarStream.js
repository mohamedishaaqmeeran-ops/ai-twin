import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

const parseResponse =
  async (response) => {
    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.description ||
          `Avatar request failed (${response.status}).`
      );
    }

    return data;
  };

export default function useAvatarStream() {
  /*
   * avatarConnected means WebRTC connected.
   * avatarPlaying means actual video frames are playing.
   */
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

  /* =======================================================
     PLAY VIDEO
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

      try {
        /*
         * Keep it muted initially.
         * Browsers commonly block autoplay
         * when a WebRTC stream includes audio.
         */
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;

        await video.play();

        console.log(
          "D-ID VIDEO PLAYING"
        );

        setAvatarPlaying(true);
        setAvatarError(null);

        return true;
      } catch (error) {
        console.error(
          "D-ID VIDEO PLAY ERROR:",
          error
        );

        setAvatarPlaying(false);

        setAvatarError(
          "Avatar stream connected, but browser blocked video playback. Click the preview to start it."
        );

        return false;
      }
    }, []);

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
            const timeout =
              window.setTimeout(
                () => {
                  peerConnection.removeEventListener(
                    "icegatheringstatechange",
                    handleChange
                  );

                  resolve();
                },
                5000
              );

            const handleChange =
              () => {
                console.log(
                  "D-ID ICE GATHERING:",
                  peerConnection
                    .iceGatheringState
                );

                if (
                  peerConnection
                    .iceGatheringState ===
                  "complete"
                ) {
                  window.clearTimeout(
                    timeout
                  );

                  peerConnection.removeEventListener(
                    "icegatheringstatechange",
                    handleChange
                  );

                  resolve();
                }
              };

            peerConnection.addEventListener(
              "icegatheringstatechange",
              handleChange
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
      closedRef.current = true;

      const avatarSessionId =
        avatarSessionIdRef.current;

      avatarSessionIdRef.current =
        null;

      if (avatarSessionId) {
        await fetch(
          `${BASE_URL}/api/avatar/sessions/${avatarSessionId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        ).catch((error) => {
          console.error(
            "AVATAR DELETE ERROR:",
            error
          );
        });
      }

      const peerConnection =
        peerConnectionRef.current;

      if (peerConnection) {
        peerConnection.ontrack =
          null;

        peerConnection.onicecandidate =
          null;

        peerConnection.onconnectionstatechange =
          null;

        peerConnection.oniceconnectionstatechange =
          null;

        peerConnection.onsignalingstatechange =
          null;

        try {
          peerConnection
            .getSenders()
            .forEach((sender) => {
              sender.track?.stop();
            });

          peerConnection
            .getReceivers()
            .forEach((receiver) => {
              receiver.track?.stop();
            });

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

      if (
        remoteStreamRef.current
      ) {
        remoteStreamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      remoteStreamRef.current =
        null;

      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch {
          // Ignore.
        }

        videoRef.current.srcObject =
          null;
      }

      setAvatarConnected(false);
      setAvatarPlaying(false);
      setAvatarLoading(false);
      setConnectionState("closed");
    }, []);

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

        /*
         * Close any previous avatar connection.
         */
        if (
          peerConnectionRef.current ||
          avatarSessionIdRef.current
        ) {
          await closeAvatar();
        }

        closedRef.current = false;

        setAvatarLoading(true);
        setAvatarConnected(false);
        setAvatarPlaying(false);
        setAvatarError(null);
        setConnectionState(
          "creating-session"
        );

        try {
          /* -----------------------------------------------
             1. CREATE D-ID STREAM
          ----------------------------------------------- */

          const response =
            await fetch(
              `${BASE_URL}/api/avatar/sessions`,
              {
                method: "POST",

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

          const data =
            await parseResponse(
              response
            );

          console.log(
            "D-ID SESSION RESPONSE:",
            {
              avatarSessionId:
                data.avatarSessionId,

              streamId:
                data.streamId,

              hasOffer:
                Boolean(
                  data.offer
                ),

              iceServerCount:
                data.iceServers
                  ?.length || 0,
            }
          );

          if (
            !data.avatarSessionId
          ) {
            throw new Error(
              "Avatar session ID was not returned."
            );
          }

          if (
            !data.offer?.sdp ||
            !data.offer?.type
          ) {
            throw new Error(
              "D-ID did not return a valid WebRTC offer."
            );
          }

          avatarSessionIdRef.current =
            data.avatarSessionId;

          /* -----------------------------------------------
             2. CREATE REMOTE MEDIA STREAM
          ----------------------------------------------- */

          const remoteStream =
            new MediaStream();

          remoteStreamRef.current =
            remoteStream;

          /* -----------------------------------------------
             3. CREATE PEER CONNECTION
          ----------------------------------------------- */

          const peerConnection =
            new RTCPeerConnection({
              iceServers:
                Array.isArray(
                  data.iceServers
                )
                  ? data.iceServers
                  : [],
            });

          peerConnectionRef.current =
            peerConnection;

          setConnectionState(
            "connecting-webrtc"
          );

          /* -----------------------------------------------
             4. HANDLE REMOTE TRACKS
          ----------------------------------------------- */

          peerConnection.ontrack =
            async (event) => {
              if (
                closedRef.current
              ) {
                return;
              }

              console.log(
                "D-ID REMOTE TRACK:",
                {
                  kind:
                    event.track.kind,

                  id:
                    event.track.id,

                  readyState:
                    event.track
                      .readyState,

                  muted:
                    event.track.muted,

                  streamCount:
                    event.streams
                      ?.length || 0,
                }
              );

              /*
               * D-ID may provide event.streams[0].
               * Some WebRTC implementations provide
               * the track without a stream.
               */
              if (
                event.streams?.[0]
              ) {
                event.streams[0]
                  .getTracks()
                  .forEach(
                    (track) => {
                      const alreadyAdded =
                        remoteStream
                          .getTracks()
                          .some(
                            (
                              currentTrack
                            ) =>
                              currentTrack.id ===
                              track.id
                          );

                      if (
                        !alreadyAdded
                      ) {
                        remoteStream.addTrack(
                          track
                        );
                      }
                    }
                  );
              } else {
                const alreadyAdded =
                  remoteStream
                    .getTracks()
                    .some(
                      (
                        currentTrack
                      ) =>
                        currentTrack.id ===
                        event.track.id
                    );

                if (
                  !alreadyAdded
                ) {
                  remoteStream.addTrack(
                    event.track
                  );
                }
              }

              event.track.onunmute =
                async () => {
                  console.log(
                    "D-ID TRACK UNMUTED:",
                    event.track.kind
                  );

                  if (
                    videoRef.current
                  ) {
                    videoRef.current.srcObject =
                      remoteStream;

                    await playVideo();
                  }
                };

              event.track.onended =
                () => {
                  console.warn(
                    "D-ID TRACK ENDED:",
                    event.track.kind
                  );
                };

              if (
                videoRef.current
              ) {
                videoRef.current.srcObject =
                  remoteStream;

                await playVideo();
              }
            };

          /* -----------------------------------------------
             5. HANDLE LOCAL ICE CANDIDATES
          ----------------------------------------------- */

          peerConnection.onicecandidate =
            async (event) => {
              if (
                closedRef.current ||
                !avatarSessionIdRef.current
              ) {
                return;
              }

              try {
                /*
                 * Send the candidate, including null
                 * at the end of candidate gathering.
                 */
                const candidate =
                  event.candidate;

                const iceResponse =
                  await fetch(
                    `${BASE_URL}/api/avatar/sessions/${data.avatarSessionId}/ice`,
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

                /*
                 * Your controller may reject null
                 * candidates. The backend fix is
                 * included below.
                 */
                if (
                  !iceResponse.ok
                ) {
                  const iceData =
                    await iceResponse
                      .json()
                      .catch(
                        () => ({})
                      );

                  console.error(
                    "D-ID ICE API ERROR:",
                    iceData
                  );
                }
              } catch (error) {
                console.error(
                  "D-ID ICE SEND ERROR:",
                  error
                );
              }
            };

          /* -----------------------------------------------
             6. DEBUG CONNECTION STATES
          ----------------------------------------------- */

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

                if (
                  videoRef.current &&
                  remoteStreamRef.current
                ) {
                  videoRef.current.srcObject =
                    remoteStreamRef.current;

                  playVideo();
                }
              }

              if (
                state ===
                  "failed" ||
                state ===
                  "disconnected"
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

          peerConnection.onsignalingstatechange =
            () => {
              console.log(
                "D-ID SIGNALING STATE:",
                peerConnection
                  .signalingState
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

          /* -----------------------------------------------
             7. APPLY D-ID OFFER
          ----------------------------------------------- */

          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(
              data.offer
            )
          );

          console.log(
            "D-ID REMOTE DESCRIPTION SET"
          );

          /* -----------------------------------------------
             8. CREATE BROWSER ANSWER
          ----------------------------------------------- */

          const answer =
            await peerConnection.createAnswer();

          await peerConnection.setLocalDescription(
            answer
          );

          /*
           * Allow ICE candidates to be collected.
           * Trickle ICE is still sent separately.
           */
          await waitForIceGatheringComplete(
            peerConnection
          );

          const localDescription =
            peerConnection.localDescription;

          if (
            !localDescription?.sdp
          ) {
            throw new Error(
              "Browser did not create a valid SDP answer."
            );
          }

          /* -----------------------------------------------
             9. SEND SDP ANSWER TO D-ID
          ----------------------------------------------- */

          const answerResponse =
            await fetch(
              `${BASE_URL}/api/avatar/sessions/${data.avatarSessionId}/answer`,
              {
                method: "POST",

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
                        localDescription.type,

                      sdp:
                        localDescription.sdp,
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

          /*
           * Do not mark video as playing here.
           * Wait for ontrack/video.onplaying.
           */
          return data;
        } catch (error) {
          console.error(
            "CREATE AVATAR SESSION ERROR:",
            error
          );

          setAvatarConnected(false);
          setAvatarPlaying(false);
          setAvatarError(
            error.message ||
              "Unable to create avatar stream."
          );

          await closeAvatar().catch(
            () => {}
          );

          throw error;
        } finally {
          setAvatarLoading(false);
        }
      },
      [
        closeAvatar,
        playVideo,
        waitForIceGatheringComplete,
      ]
    );

  /* =======================================================
     SPEAK
  ======================================================= */

  const speak =
    useCallback(
      async (text) => {
        const avatarSessionId =
          avatarSessionIdRef.current;

        const normalizedText =
          String(text || "").trim();

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
              method: "POST",

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

        /*
         * Retry playback after D-ID starts
         * producing speaking video frames.
         */
        window.setTimeout(
          () => {
            playVideo();
          },
          150
        );

        return true;
      },
      [playVideo]
    );

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      const peerConnection =
        peerConnectionRef.current;

      if (peerConnection) {
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
    closeAvatar,
  };
}