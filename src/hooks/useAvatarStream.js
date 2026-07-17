import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest } from "../lib/api";

export default function useAvatarStream() {
  const videoRef = useRef(null);
  const peerRef = useRef(null);
  const sessionRef = useRef(null);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarConnected, setAvatarConnected] = useState(false);
  const [avatarPlaying, setAvatarPlaying] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [connectionState, setConnectionState] = useState("idle");

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return false;

    try {
      await video.play();
      setAvatarPlaying(video.videoWidth > 0 || Boolean(video.srcObject));
      return true;
    } catch (error) {
      setAvatarError(error.message || "Browser blocked avatar video playback.");
      return false;
    }
  }, []);

  const waitForVideoFrames = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return false;

    for (let attempt = 0; attempt < 30; attempt += 1) {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setAvatarPlaying(true);
        return true;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 200));
    }

    return false;
  }, []);

  const postIceCandidate = useCallback(async (candidate) => {
    const session = sessionRef.current;
    if (!session?.avatarSessionId || !candidate) return;

    await apiRequest(
      `/api/avatar/sessions/${session.avatarSessionId}/ice`,
      {
        method: "POST",
        body: JSON.stringify({
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid,
          sdpMLineIndex: candidate.sdpMLineIndex,
        }),
      }
    );
  }, []);

  const createAvatarSession = useCallback(
    async ({ twinId, realtimeSessionId }) => {
      if (!twinId) throw new Error("Twin ID is required.");
      if (!realtimeSessionId) throw new Error("Realtime session ID is required.");

      setAvatarLoading(true);
      setAvatarError("");
      setConnectionState("creating");

      try {
        const result = await apiRequest("/api/avatar/sessions", {
          method: "POST",
          body: JSON.stringify({ twinId, realtimeSessionId }),
        });

        const data = result.session || result.data || result;

        const avatarSessionId =
          data.avatarSessionId || data.sessionId || data._id || data.id;

        const offer = data.offer || data.sdp;
        const iceServers = data.iceServers || data.ice_servers || [];

        if (!avatarSessionId || !offer) {
          throw new Error("Avatar session response is incomplete.");
        }

        sessionRef.current = {
          ...data,
          avatarSessionId,
        };

        const peer = new RTCPeerConnection({ iceServers });
        peerRef.current = peer;

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            postIceCandidate(event.candidate).catch((error) => {
              console.error("AVATAR ICE ERROR:", error);
            });
          }
        };

        peer.onconnectionstatechange = () => {
          setConnectionState(peer.connectionState);

          if (peer.connectionState === "connected") {
            setAvatarConnected(true);
          }

          if (
            peer.connectionState === "failed" ||
            peer.connectionState === "closed" ||
            peer.connectionState === "disconnected"
          ) {
            setAvatarConnected(false);
          }
        };

        peer.ontrack = (event) => {
          const stream = event.streams?.[0];

          if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            setAvatarConnected(true);
            setConnectionState("connected");

            videoRef.current
              .play()
              .then(() => setAvatarPlaying(true))
              .catch(() => {});
          }
        };

        await peer.setRemoteDescription(
          new RTCSessionDescription(
            typeof offer === "string"
              ? { type: "offer", sdp: offer }
              : offer
          )
        );

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        await apiRequest(
          `/api/avatar/sessions/${avatarSessionId}/answer`,
          {
            method: "POST",
            body: JSON.stringify({
              answer: peer.localDescription,
              sdp: peer.localDescription?.sdp,
              type: peer.localDescription?.type,
            }),
          }
        );

        setAvatarConnected(true);
        setConnectionState("connecting");

        return {
          ...result,
          avatarSessionId,
        };
      } catch (error) {
        setAvatarError(error.message || "Unable to start avatar session.");
        setConnectionState("failed");
        throw error;
      } finally {
        setAvatarLoading(false);
      }
    },
    [postIceCandidate]
  );

  const speak = useCallback(async (text, language = "English") => {
    const session = sessionRef.current;

    if (!session?.avatarSessionId) {
      throw new Error("Avatar session is not connected.");
    }

    const normalized = String(text || "").trim();
    if (!normalized) return null;

    return apiRequest(
      `/api/avatar/sessions/${session.avatarSessionId}/speak`,
      {
        method: "POST",
        body: JSON.stringify({ text: normalized, language }),
      }
    );
  }, []);

  const closeAvatar = useCallback(async () => {
    const session = sessionRef.current;

    if (session?.avatarSessionId) {
      await apiRequest(
        `/api/avatar/sessions/${session.avatarSessionId}/end`,
        { method: "POST" }
      ).catch(() => {});
    }

    peerRef.current?.getSenders().forEach((sender) => sender.track?.stop());
    peerRef.current?.getReceivers().forEach((receiver) => receiver.track?.stop());
    peerRef.current?.close();

    peerRef.current = null;
    sessionRef.current = null;

    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      stream?.getTracks?.().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setAvatarConnected(false);
    setAvatarPlaying(false);
    setAvatarLoading(false);
    setConnectionState("closed");
  }, []);

  useEffect(() => {
    return () => {
      peerRef.current?.close();
    };
  }, []);

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
