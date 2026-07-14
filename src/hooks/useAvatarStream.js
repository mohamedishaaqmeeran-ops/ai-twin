import {
  useCallback,
  useRef,
  useState,
} from "react";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

const parseResponse = async (
  response
) => {
  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Avatar request failed."
    );
  }

  return data;
};

export default function useAvatarStream() {
  const [
    avatarConnected,
    setAvatarConnected,
  ] = useState(false);

  const [
    avatarLoading,
    setAvatarLoading,
  ] = useState(false);

  const [
    avatarError,
    setAvatarError,
  ] = useState(null);

  const peerConnectionRef =
    useRef(null);

  const videoRef =
    useRef(null);

  const avatarSessionIdRef =
    useRef(null);

  const createAvatarSession =
    useCallback(
      async ({
        twinId,
        realtimeSessionId,
      }) => {
        setAvatarLoading(true);
        setAvatarError(null);

        try {
          const response = await fetch(
            `${BASE_URL}/api/avatar/sessions`,
            {
              method: "POST",
              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                twinId,
                realtimeSessionId,
              }),
            }
          );

          const data =
            await parseResponse(
              response
            );

          avatarSessionIdRef.current =
            data.avatarSessionId;

          const peerConnection =
            new RTCPeerConnection({
              iceServers:
                data.iceServers,
            });

          peerConnectionRef.current =
            peerConnection;

          peerConnection.ontrack =
            (event) => {
              const [stream] =
                event.streams;

              if (
                videoRef.current &&
                stream
              ) {
                videoRef.current.srcObject =
                  stream;

                videoRef.current
                  .play()
                  .catch(() => {});
              }
            };

          peerConnection.onicecandidate =
            async (event) => {
              if (!event.candidate) {
                return;
              }

              await fetch(
                `${BASE_URL}/api/avatar/sessions/${data.avatarSessionId}/ice`,
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
                      candidate:
                        event.candidate
                          .candidate,

                      sdpMid:
                        event.candidate
                          .sdpMid,

                      sdpMLineIndex:
                        event.candidate
                          .sdpMLineIndex,
                    }),
                }
              );
            };

          peerConnection.onconnectionstatechange =
            () => {
              const state =
                peerConnection.connectionState;

              setAvatarConnected(
                state ===
                  "connected"
              );

              if (
                state ===
                  "failed" ||
                state ===
                  "disconnected"
              ) {
                setAvatarError(
                  `Avatar connection ${state}.`
                );
              }
            };

          await peerConnection.setRemoteDescription(
            data.offer
          );

          const answer =
            await peerConnection.createAnswer();

          await peerConnection.setLocalDescription(
            answer
          );

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
                    answer,
                  }),
              }
            );

          await parseResponse(
            answerResponse
          );

          return data;
        } catch (error) {
          setAvatarError(
            error.message
          );

          throw error;
        } finally {
          setAvatarLoading(false);
        }
      },
      []
    );

  const speak =
    useCallback(
      async (text) => {
        const avatarSessionId =
          avatarSessionIdRef.current;

        if (
          !avatarSessionId ||
          !text
        ) {
          return false;
        }

        const response = await fetch(
          `${BASE_URL}/api/avatar/sessions/${avatarSessionId}/speak`,
          {
            method: "POST",
            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              text,
            }),
          }
        );

        await parseResponse(
          response
        );

        return true;
      },
      []
    );

  const closeAvatar =
    useCallback(async () => {
      const avatarSessionId =
        avatarSessionIdRef.current;

      if (avatarSessionId) {
        await fetch(
          `${BASE_URL}/api/avatar/sessions/${avatarSessionId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        ).catch(() => {});
      }

      peerConnectionRef.current?.close();

      peerConnectionRef.current =
        null;

      avatarSessionIdRef.current =
        null;

      if (videoRef.current) {
        videoRef.current.srcObject =
          null;
      }

      setAvatarConnected(false);
    }, []);

  return {
    videoRef,
    avatarConnected,
    avatarLoading,
    avatarError,

    createAvatarSession,
    speak,
    closeAvatar,
  };
}