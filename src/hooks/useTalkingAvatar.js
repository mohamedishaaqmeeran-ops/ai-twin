import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  createTalkingAvatarApi,
  getTalkingAvatarStatusApi,
} from "../lib/twinApi";

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(
      resolve,
      milliseconds
    );
  });

export default function useTalkingAvatar() {
  const cancelledRef =
    useRef(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState("idle");

  const [
    videoUrl,
    setVideoUrl,
  ] = useState("");

  const [
    audioUrl,
    setAudioUrl,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const cancel =
    useCallback(() => {
      cancelledRef.current =
        true;

      setLoading(false);
    }, []);

  const generate =
    useCallback(
      async ({
        twinId,
        text,
        audioUrl:
          providedAudioUrl = "",
      }) => {
        if (!twinId) {
          throw new Error(
            "Twin ID is required."
          );
        }

        if (!text?.trim()) {
          throw new Error(
            "Avatar script is required."
          );
        }

        cancelledRef.current =
          false;

        setLoading(true);
        setError("");
        setVideoUrl("");
        setAudioUrl("");
        setStatus("creating");

        try {
          const response =
            await createTalkingAvatarApi({
              twinId,

              text:
                text.trim(),

              audioUrl:
                providedAudioUrl,
            });

          const generation =
            response.data ||
            response;

          const generationId =
            generation.generationId;

          if (!generationId) {
            throw new Error(
              "Backend did not return an avatar generation ID."
            );
          }

          setAudioUrl(
            generation.audioUrl ||
              ""
          );

          for (
            let attempt = 0;
            attempt < 60;
            attempt += 1
          ) {
            if (
              cancelledRef.current
            ) {
              return null;
            }

            const statusResponse =
              await getTalkingAvatarStatusApi(
                generationId
              );

            const current =
              statusResponse.data ||
              statusResponse;

            setStatus(
              current.status ||
                "processing"
            );

            if (
              current.status ===
              "completed"
            ) {
              if (
                !current.videoUrl
              ) {
                throw new Error(
                  "Avatar completed but no video URL was returned."
                );
              }

              setVideoUrl(
                current.videoUrl
              );

              return current;
            }

            if (
              current.status ===
              "failed"
            ) {
              throw new Error(
                current.error ||
                  "Talking avatar generation failed."
              );
            }

            await wait(2000);
          }

          throw new Error(
            "Avatar generation timed out."
          );
        } catch (
          generationError
        ) {
          setError(
            generationError.message ||
              "Unable to generate talking avatar."
          );

          setStatus("failed");

          throw generationError;
        } finally {
          setLoading(false);
        }
      },
      []
    );

  return {
    loading,
    status,
    videoUrl,
    audioUrl,
    error,
    generate,
    cancel,
  };
}