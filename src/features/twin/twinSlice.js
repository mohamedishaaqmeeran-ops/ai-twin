import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

const API = `${BASE_URL}/api/twin`;

const readResponse = async (response) => {
  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

/* =========================================================
   CREATE BASIC INFO
========================================================= */

export const createTwinBasicInfo =
  createAsyncThunk(
    "twin/createBasicInfo",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API}/basic-info`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to save Twin basic information."
        );
      }
    }
  );

/* =========================================================
   SAVE APPEARANCE
========================================================= */

export const saveTwinAppearance =
  createAsyncThunk(
    "twin/saveAppearance",
    async (
      {
        twinId,
        avatarFile,
        avatarUrl,
        style,
        background,
        gender,
        ageGroup,
        skinTone,
        hairStyle,
        clothingStyle,
      },
      { rejectWithValue }
    ) => {
      try {
        const formData = new FormData();

        formData.append("twinId", twinId);

        if (avatarFile) {
          formData.append(
            "avatar",
            avatarFile
          );
        } else if (avatarUrl) {
          formData.append(
            "avatarUrl",
            avatarUrl
          );
        }

        formData.append(
          "style",
          style || "Professional"
        );

        formData.append(
          "background",
          background || ""
        );

        formData.append(
          "gender",
          gender || ""
        );

        formData.append(
          "ageGroup",
          ageGroup || ""
        );

        formData.append(
          "skinTone",
          skinTone || ""
        );

        formData.append(
          "hairStyle",
          hairStyle || ""
        );

        formData.append(
          "clothingStyle",
          clothingStyle || ""
        );

        const response = await fetch(
          `${API}/appearance`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to save Twin appearance."
        );
      }
    }
  );

/* =========================================================
   SAVE VOICE
========================================================= */

export const saveTwinVoice =
  createAsyncThunk(
    "twin/saveVoice",
    async (
      {
        twinId,
        voiceType,
        language,
        speed,
        pitch,
        sampleFile,
      },
      { rejectWithValue }
    ) => {
      try {
        const formData = new FormData();

        formData.append("twinId", twinId);

        formData.append(
          "voiceType",
          voiceType || "Warm Female"
        );

        formData.append(
          "language",
          language || "English"
        );

        formData.append(
          "speed",
          String(speed ?? 1)
        );

        formData.append(
          "pitch",
          String(pitch ?? 1)
        );

        if (sampleFile) {
          formData.append(
            "sample",
            sampleFile
          );
        }

        const response = await fetch(
          `${API}/voice`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to save Twin voice."
        );
      }
    }
  );

/* =========================================================
   SAVE KNOWLEDGE
========================================================= */

export const saveTwinKnowledge =
  createAsyncThunk(
    "twin/saveKnowledge",
    async (
      {
        twinId,
        title,
        text,
        websiteUrl,
        documentFile,
      },
      { rejectWithValue }
    ) => {
      try {
        const formData = new FormData();

        formData.append("twinId", twinId);

        formData.append(
          "title",
          title || "Training Knowledge"
        );

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
        } else {
          formData.append(
            "text",
            text || ""
          );
        }

        const response = await fetch(
          `${API}/knowledge`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to train AI Twin."
        );
      }
    }
  );

/* =========================================================
   GET ALL TWINS
========================================================= */

export const fetchTwins =
  createAsyncThunk(
    "twin/fetchTwins",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch(API, {
          method: "GET",
          credentials: "include",
        });

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load AI Twins."
        );
      }
    }
  );

/* =========================================================
   GET SINGLE TWIN
========================================================= */

export const fetchTwin =
  createAsyncThunk(
    "twin/fetchTwin",
    async (
      twinId,
      { rejectWithValue }
    ) => {
      try {
        const response = await fetch(
          `${API}/${twinId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load AI Twin."
        );
      }
    }
  );

/* =========================================================
   GET KNOWLEDGE
========================================================= */

export const fetchTwinKnowledge =
  createAsyncThunk(
    "twin/fetchKnowledge",
    async (
      twinId,
      { rejectWithValue }
    ) => {
      try {
        const response = await fetch(
          `${API}/${twinId}/knowledge`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load Twin knowledge."
        );
      }
    }
  );

/* =========================================================
   GET CONVERSATIONS
========================================================= */

export const fetchTwinConversations =
  createAsyncThunk(
    "twin/fetchConversations",
    async (
      twinId,
      { rejectWithValue }
    ) => {
      try {
        const response = await fetch(
          `${API}/${twinId}/conversations`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load conversations."
        );
      }
    }
  );

/* =========================================================
   CHAT
========================================================= */

export const sendTwinMessage =
  createAsyncThunk(
    "twin/sendMessage",
    async (
      {
        twinId,
        message,
        conversationId,
      },
      { rejectWithValue }
    ) => {
      try {
        const response = await fetch(
          `${API}/chat`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              twinId,
              message,
              conversationId,
            }),
          }
        );

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to chat with AI Twin."
        );
      }
    }
  );

/* =========================================================
   DELETE
========================================================= */

export const deleteTwin =
  createAsyncThunk(
    "twin/deleteTwin",
    async (
      twinId,
      { rejectWithValue }
    ) => {
      try {
        const response = await fetch(
          `${API}/${twinId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        return await readResponse(response);
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to delete AI Twin."
        );
      }
    }
  );

/* =========================================================
   STATE
========================================================= */

const initialState = {
  twins: [],
  selectedTwin: null,
  knowledge: [],
  conversations: [],

  conversationId: null,
  chatMessages: [],

  loading: false,
  creating: false,
  chatting: false,
  initialized: false,

  error: null,
};

/* =========================================================
   SLICE
========================================================= */

const twinSlice = createSlice({
  name: "twin",
  initialState,

  reducers: {
    clearTwinError(state) {
      state.error = null;
    },

    clearSelectedTwin(state) {
      state.selectedTwin = null;
    },

    clearTwinChat(state) {
      state.conversationId = null;
      state.chatMessages = [];
    },
  },

  extraReducers: (builder) => {
    builder

      /* BASIC INFO */

      .addCase(
        createTwinBasicInfo.pending,
        (state) => {
          state.creating = true;
          state.error = null;
        }
      )

      .addCase(
        createTwinBasicInfo.fulfilled,
        (state, action) => {
          state.creating = false;
          state.selectedTwin =
            action.payload.twin;
        }
      )

      .addCase(
        createTwinBasicInfo.rejected,
        (state, action) => {
          state.creating = false;
          state.error =
            action.payload ||
            "Unable to save basic information.";
        }
      )

      /* APPEARANCE */

      .addCase(
        saveTwinAppearance.pending,
        (state) => {
          state.creating = true;
          state.error = null;
        }
      )

      .addCase(
        saveTwinAppearance.fulfilled,
        (state, action) => {
          state.creating = false;
          state.selectedTwin =
            action.payload.twin;
        }
      )

      .addCase(
        saveTwinAppearance.rejected,
        (state, action) => {
          state.creating = false;
          state.error =
            action.payload ||
            "Unable to save appearance.";
        }
      )

      /* VOICE */

      .addCase(
        saveTwinVoice.pending,
        (state) => {
          state.creating = true;
          state.error = null;
        }
      )

      .addCase(
        saveTwinVoice.fulfilled,
        (state, action) => {
          state.creating = false;
          state.selectedTwin =
            action.payload.twin;
        }
      )

      .addCase(
        saveTwinVoice.rejected,
        (state, action) => {
          state.creating = false;
          state.error =
            action.payload ||
            "Unable to save voice.";
        }
      )

      /* KNOWLEDGE */

      .addCase(
        saveTwinKnowledge.pending,
        (state) => {
          state.creating = true;
          state.error = null;
        }
      )

      .addCase(
        saveTwinKnowledge.fulfilled,
        (state, action) => {
          state.creating = false;
          state.selectedTwin =
            action.payload.twin;

          const twin =
            action.payload.twin;

          if (twin) {
            const existingIndex =
              state.twins.findIndex(
                (item) =>
                  item._id === twin._id
              );

            if (existingIndex >= 0) {
              state.twins[
                existingIndex
              ] = twin;
            } else {
              state.twins.unshift(twin);
            }
          }
        }
      )

      .addCase(
        saveTwinKnowledge.rejected,
        (state, action) => {
          state.creating = false;
          state.error =
            action.payload ||
            "Unable to train AI Twin.";
        }
      )

      /* GET ALL */

      .addCase(
        fetchTwins.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchTwins.fulfilled,
        (state, action) => {
          state.loading = false;
          state.initialized = true;
          state.twins =
            action.payload.twins || [];
        }
      )

      .addCase(
        fetchTwins.rejected,
        (state, action) => {
          state.loading = false;
          state.initialized = true;
          state.error =
            action.payload ||
            "Unable to load AI Twins.";
        }
      )

      /* GET SINGLE */

      .addCase(
        fetchTwin.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchTwin.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedTwin =
            action.payload.twin;
        }
      )

      .addCase(
        fetchTwin.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Unable to load AI Twin.";
        }
      )

      /* KNOWLEDGE LIST */

      .addCase(
        fetchTwinKnowledge.fulfilled,
        (state, action) => {
          state.knowledge =
            action.payload.knowledge ||
            [];
        }
      )

      /* CONVERSATIONS */

      .addCase(
        fetchTwinConversations.fulfilled,
        (state, action) => {
          state.conversations =
            action.payload
              .conversations || [];
        }
      )

      /* CHAT */

      .addCase(
        sendTwinMessage.pending,
        (state, action) => {
          state.chatting = true;
          state.error = null;

          state.chatMessages.push({
            role: "user",
            content:
              action.meta.arg.message,
          });
        }
      )

      .addCase(
        sendTwinMessage.fulfilled,
        (state, action) => {
          state.chatting = false;

          const result =
            action.payload.data ||
            action.payload;

          state.conversationId =
            result.conversationId ||
            null;

          state.chatMessages.push({
            role: "assistant",
            content:
              action.payload.reply ||
              result.reply,
            sources:
              result.sources || [],
          });
        }
      )

      .addCase(
        sendTwinMessage.rejected,
        (state, action) => {
          state.chatting = false;
          state.error =
            action.payload ||
            "Unable to chat with AI Twin.";
        }
      )

      /* DELETE */

      .addCase(
        deleteTwin.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteTwin.fulfilled,
        (state, action) => {
          state.loading = false;

          const deletedId =
            action.payload
              .deletedTwinId;

          state.twins =
            state.twins.filter(
              (item) =>
                item._id !== deletedId
            );

          if (
            state.selectedTwin?._id ===
            deletedId
          ) {
            state.selectedTwin = null;
          }
        }
      )

      .addCase(
        deleteTwin.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Unable to delete AI Twin.";
        }
      );
  },
});

export const {
  clearTwinError,
  clearSelectedTwin,
  clearTwinChat,
} = twinSlice.actions;

export default twinSlice.reducer;