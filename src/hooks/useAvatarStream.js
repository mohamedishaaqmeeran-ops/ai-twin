import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  addAvatarIceApi,
  createAvatarSessionApi,
  endAvatarSessionApi,
  speakAvatarApi,
  submitAvatarAnswerApi,
} from "../lib/avatarApi";

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(
      resolve,
      milliseconds
    );
  });

export default function useAvatarStream() {
  const videoRef =
    useRef(null);

  const peerConnectionRef =
    useRef(null);

  const avatarSessionIdRef =
    useRef(null);

  const closingRef =
    useRef(false);

  const [
    avatarLoading,
    setAvatarLoading,
  ] = useState(false);

  const [
    avatarConnected,
    setAvatarConnected,
  ] = useState(false);

  const [
    avatarPlaying,
    setAvatarPlaying,
  ] = useState(false);

  const [
    avatarError,
    setAvatarError,
  ] = useState("");

  const [
    connectionState,
    setConnectionState,
  ] = useState("idle");

  /* =======================================================
     VIDEO
  ======================================================= */

  const playVideo =
    useCallback(async () => {
      const video =
        videoRef.current;

      if (!video) {
        return false;
      }

      try {
        await video.play();

        setAvatarPlaying(
          true
        );

        return true;
      } catch (error) {
        console.warn(
          "AVATAR VIDEO PLAY ERROR:",
          error
        );

        return false;
      }
    }, []);

  const waitForVideoFrames =
    useCallback(
      async (
        attempts = 40
      ) => {
        for (
          let index = 0;
          index < attempts;
          index += 1
        ) {
          const video =
            videoRef.current;

          if (
            video &&
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {
            await playVideo();

            return true;
          }

          await wait(200);
        }

        return false;
      },
      [playVideo]
    );

  const resetVideo =
    useCallback(() => {
      const video =
        videoRef.current;

      if (video) {
        try {
          video.pause();
        } catch {
          // Ignore pause error.
        }

        video.srcObject =
          null;
      }

      setAvatarPlaying(
        false
      );
    }, []);

  /* =======================================================
     PEER CONNECTION
  ======================================================= */

  const destroyPeerConnection =
    useCallback(() => {
      const peer =
        peerConnectionRef.current;

      if (!peer) {
        return;
      }

      peer.ontrack = null;
      peer.onicecandidate =
        null;

      peer.onconnectionstatechange =
        null;

      peer.oniceconnectionstatechange =
        null;

      try {
        peer
          .getSenders()
          .forEach((sender) => {
            sender.track?.stop();
          });

        peer
          .getReceivers()
          .forEach(
            (receiver) => {
              receiver.track?.stop();
            }
          );

        peer.close();
      } catch (error) {
        console.error(
          "AVATAR PEER CLOSE ERROR:",
          error
        );
      }

      peerConnectionRef.current =
        null;
    }, []);

  /* =======================================================
     CLOSE
  ======================================================= */

  const closeAvatar =
    useCallback(async () => {
      if (
        closingRef.current
      ) {
        return;
      }

      closingRef.current =
        true;

      const avatarSessionId =
        avatarSessionIdRef.current;

      avatarSessionIdRef.current =
        null;

      try {
        if (avatarSessionId) {
          await endAvatarSessionApi(
            avatarSessionId
          ).catch((error) => {
            console.error(
              "END AVATAR SESSION ERROR:",
              error
            );
          });
        }
      } finally {
        destroyPeerConnection();
        resetVideo();

        setAvatarConnected(
          false
        );

        setConnectionState(
          "closed"
        );

        closingRef.current =
          false;
      }
    }, [
      destroyPeerConnection,
      resetVideo,
    ]);

  /* =======================================================
     CREATE D-ID SESSION
  ======================================================= */

  const createAvatarSession =
    useCallback(
      async ({
        twinId,
        realtimeSessionId = null,
      }) => {
        if (!twinId) {
          throw new Error(
            "Twin ID is required."
          );
        }

        await closeAvatar();

        setAvatarLoading(true);
        setAvatarError("");

        setConnectionState(
          "creating-session"
        );

        try {
          const response =
            await createAvatarSessionApi({
              twinId,
              realtimeSessionId,
            });

          const result =
            response.data ||
            response;

          const avatarSessionId =
            result.avatarSessionId;

          const offer =
            result.offer;

          const iceServers =
            result.iceServers ||
            [];

          if (
            !avatarSessionId ||
            !offer?.type ||
            !offer?.sdp
          ) {
            throw new Error(
              "Backend returned invalid avatar stream data."
            );
          }

          avatarSessionIdRef.current =
            avatarSessionId;

          const peerConnection =
            new RTCPeerConnection({
              iceServers,
            });

          peerConnectionRef.current =
            peerConnection;

          /* ===============================================
             REMOTE VIDEO
          =============================================== */

          peerConnection.ontrack =
            async (event) => {
              const remoteStream =
                event.streams?.[0];

              if (
                !remoteStream ||
                !videoRef.current
              ) {
                return;
              }

              videoRef.current.srcObject =
                remoteStream;

              await playVideo();

              await waitForVideoFrames();
            };

          /* ===============================================
             ICE
          =============================================== */

          peerConnection.onicecandidate =
            async (event) => {
              const currentSessionId =
                avatarSessionIdRef.current;

              if (!currentSessionId) {
                return;
              }

              try {
                if (
                  event.candidate
                ) {
                  await addAvatarIceApi({
                    avatarSessionId:
                      currentSessionId,

                    candidate:
                      event.candidate
                        .candidate,

                    sdpMid:
                      event.candidate
                        .sdpMid,

                    sdpMLineIndex:
                      event.candidate
                        .sdpMLineIndex,
                  });
                } else {
                  await addAvatarIceApi({
                    avatarSessionId:
                      currentSessionId,

                    candidate: null,

                    sdpMid: null,

                    sdpMLineIndex:
                      null,
                  });
                }
              } catch (error) {
                console.error(
                  "AVATAR ICE ERROR:",
                  error
                );
              }
            };

          /* ===============================================
             CONNECTION STATE
          =============================================== */

          peerConnection.onconnectionstatechange =
            () => {
              const state =
                peerConnection
                  .connectionState;

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
              }

              if (
                [
                  "failed",
                  "disconnected",
                  "closed",
                ].includes(state)
              ) {
                setAvatarConnected(
                  false
                );
              }
            };

          peerConnection.oniceconnectionstatechange =
            () => {
              const state =
                peerConnection
                  .iceConnectionState;

              if (
                state ===
                "failed"
              ) {
                setAvatarError(
                  "Avatar ICE connection failed."
                );
              }
            };

          /* ===============================================
             SDP
          =============================================== */

          setConnectionState(
            "setting-remote-description"
          );

          await peerConnection
            .setRemoteDescription(
              new RTCSessionDescription(
                offer
              )
            );

          const answer =
            await peerConnection
              .createAnswer();

          await peerConnection
            .setLocalDescription(
              answer
            );

          setConnectionState(
            "submitting-answer"
          );

          await submitAvatarAnswerApi({
            avatarSessionId,

            answer: {
              type:
                peerConnection
                  .localDescription
                  .type,

              sdp:
                peerConnection
                  .localDescription
                  .sdp,
            },
          });

          setAvatarConnected(
            true
          );

          setConnectionState(
            "connected"
          );

          return result;
        } catch (error) {
          console.error(
            "CREATE AVATAR SESSION ERROR:",
            error
          );

          setAvatarError(
            error.message ||
              "Unable to create avatar stream."
          );

          setConnectionState(
            "failed"
          );

          await closeAvatar();

          throw error;
        } finally {
          setAvatarLoading(
            false
          );
        }
      },
      [
        closeAvatar,
        playVideo,
        waitForVideoFrames,
      ]
    );

  /* =======================================================
     SPEAK
  ======================================================= */

  const speak =
    useCallback(
      async (
        text,
        language = "English",
        audioUrl = ""
      ) => {
        const avatarSessionId =
          avatarSessionIdRef.current;

        if (!avatarSessionId) {
          throw new Error(
            "Avatar session is not active."
          );
        }

        const normalizedText =
          String(
            text || ""
          ).trim();

        if (
          !normalizedText &&
          !audioUrl
        ) {
          throw new Error(
            "Speech text or audio URL is required."
          );
        }

        return speakAvatarApi({
          avatarSessionId,

          text:
            normalizedText,

          language,

          audioUrl,
        });
      },
      []
    );

  /* =======================================================
     UNMOUNT CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      const avatarSessionId =
        avatarSessionIdRef.current;

      avatarSessionIdRef.current =
        null;

      if (avatarSessionId) {
        endAvatarSessionApi(
          avatarSessionId
        ).catch(() => {});
      }

      destroyPeerConnection();
      resetVideo();
    };
  }, [
    destroyPeerConnection,
    resetVideo,
  ]);

  return {
    videoRef,

    avatarLoading,
    avatarConnected,
    avatarPlaying,
    avatarError,
    connectionState,

    createAvatarSession,
    speak,
    closeAvatar,
    playVideo,
    waitForVideoFrames,
  };
}