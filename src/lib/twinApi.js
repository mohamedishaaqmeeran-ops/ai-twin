import {
  apiRequest,
} from "./api";

/* =========================================================
   TWIN
========================================================= */

export const getTwinsApi = () => {
  return apiRequest(
    "/api/twin"
  );
};

export const getTwinApi = (
  twinId
) => {
  return apiRequest(
    `/api/twin/${twinId}`
  );
};

/* =========================================================
   PRODUCT TRAINING
========================================================= */

export const trainProductApi = ({
  twinId,
  productId,
  title,
  text,
  websiteUrl,
  documentFile,
}) => {
  const formData =
    new FormData();

  if (title) {
    formData.append(
      "title",
      title
    );
  }

  if (documentFile) {
    formData.append(
      "document",
      documentFile
    );
  } else if (websiteUrl) {
    formData.append(
      "websiteUrl",
      websiteUrl
    );
  } else if (text) {
    formData.append(
      "text",
      text
    );
  }

  return apiRequest(
    `/api/twin/${twinId}/products/${productId}/train`,
    {
      method: "POST",
      body: formData,
    }
  );
};

/* =========================================================
   CHAT
========================================================= */

export const chatWithTwinApi = ({
  twinId,
  productId,
  message,
  conversationId,
}) => {
  return apiRequest(
    "/api/twin/chat",
    {
      method: "POST",

      body: JSON.stringify({
        twinId,
        productId,
        message,
        conversationId,
      }),
    }
  );
};

/* =========================================================
   TEXT TO SPEECH
========================================================= */

export const textToSpeechApi = ({
  twinId,
  text,
}) => {
  return apiRequest(
    "/api/twin/text-to-speech",
    {
      method: "POST",

      body: JSON.stringify({
        twinId,
        text,
      }),
    }
  );
};

/* =========================================================
   SPEECH TO TEXT
========================================================= */

export const speechToTextApi = ({
  twinId,
  audioFile,
  language,
}) => {
  const formData =
    new FormData();

  formData.append(
    "twinId",
    twinId
  );

  formData.append(
    "audio",
    audioFile
  );

  if (language) {
    formData.append(
      "language",
      language
    );
  }

  return apiRequest(
    "/api/twin/speech-to-text",
    {
      method: "POST",
      body: formData,
    }
  );
};

/* =========================================================
   SPEECH TO SPEECH
========================================================= */

export const speechToSpeechApi = ({
  twinId,
  productId,
  audioFile,
  language,
  conversationId,
}) => {
  const formData =
    new FormData();

  formData.append(
    "twinId",
    twinId
  );

  formData.append(
    "productId",
    productId
  );

  formData.append(
    "audio",
    audioFile
  );

  if (language) {
    formData.append(
      "language",
      language
    );
  }

  if (conversationId) {
    formData.append(
      "conversationId",
      conversationId
    );
  }

  return apiRequest(
    "/api/twin/speech-to-speech",
    {
      method: "POST",
      body: formData,
    }
  );
};

/* =========================================================
   RECORDED TALKING AVATAR
========================================================= */

export const createTalkingAvatarApi = ({
  twinId,
  text,
  audioUrl,
}) => {
  return apiRequest(
    "/api/twin/talking-avatar",
    {
      method: "POST",

      body: JSON.stringify({
        twinId,
        text,
        audioUrl,
      }),
    }
  );
};

export const getTalkingAvatarStatusApi = (
  generationId
) => {
  return apiRequest(
    `/api/twin/talking-avatar/${generationId}`
  );
};