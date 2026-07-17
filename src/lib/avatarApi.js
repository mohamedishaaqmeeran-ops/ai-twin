import {
  apiRequest,
} from "./api";

/* =========================================================
   CREATE SESSION
========================================================= */

export const createAvatarSessionApi = ({
  twinId,
  realtimeSessionId,
}) => {
  return apiRequest(
    "/api/avatar/sessions",
    {
      method: "POST",

      body: JSON.stringify({
        twinId,

        realtimeSessionId:
          realtimeSessionId ||
          null,
      }),
    }
  );
};

/* =========================================================
   SUBMIT SDP ANSWER
========================================================= */

export const submitAvatarAnswerApi = ({
  avatarSessionId,
  answer,
}) => {
  return apiRequest(
    `/api/avatar/sessions/${avatarSessionId}/answer`,
    {
      method: "POST",

      body: JSON.stringify({
        answer,
      }),
    }
  );
};

/* =========================================================
   ADD ICE CANDIDATE
========================================================= */

export const addAvatarIceApi = ({
  avatarSessionId,
  candidate,
  sdpMid,
  sdpMLineIndex,
}) => {
  return apiRequest(
    `/api/avatar/sessions/${avatarSessionId}/ice`,
    {
      method: "POST",

      body: JSON.stringify({
        candidate,
        sdpMid,
        sdpMLineIndex,
      }),
    }
  );
};

/* =========================================================
   SPEAK
========================================================= */

export const speakAvatarApi = ({
  avatarSessionId,
  text,
  language,
  audioUrl,
}) => {
  return apiRequest(
    `/api/avatar/sessions/${avatarSessionId}/speak`,
    {
      method: "POST",

      body: JSON.stringify({
        text,
        language,
        audioUrl,
      }),
    }
  );
};

/* =========================================================
   GET SESSION
========================================================= */

export const getAvatarSessionApi = (
  avatarSessionId
) => {
  return apiRequest(
    `/api/avatar/sessions/${avatarSessionId}`
  );
};

/* =========================================================
   END SESSION
========================================================= */

export const endAvatarSessionApi = (
  avatarSessionId
) => {
  return apiRequest(
    `/api/avatar/sessions/${avatarSessionId}`,
    {
      method: "DELETE",
    }
  );
};