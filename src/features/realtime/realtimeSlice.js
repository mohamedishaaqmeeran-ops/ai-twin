import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

const API =
  `${BASE_URL}/api/realtime`;

const parseResponse =
  async (response) => {
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
   CREATE SESSION
========================================================= */

export const createRealtimeSession =
  createAsyncThunk(
    "realtime/createSession",

    async (
      {
        twinId,
        productId = null,
        mode = "test",
        language = "English",
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await fetch(
            `${API}/sessions`,
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
                  productId,
                  mode,
                  language,
                }),
            }
          );

        return await parseResponse(
          response
        );
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to create realtime session."
        );
      }
    }
  );

/* =========================================================
   GET SESSION
========================================================= */

export const fetchRealtimeSession =
  createAsyncThunk(
    "realtime/fetchSession",

    async (
      sessionId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await fetch(
            `${API}/sessions/${sessionId}`,
            {
              credentials:
                "include",
            }
          );

        return await parseResponse(
          response
        );
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load realtime session."
        );
      }
    }
  );

/* =========================================================
   END SESSION
========================================================= */

export const endRealtimeSession =
  createAsyncThunk(
    "realtime/endSession",

    async (
      sessionId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await fetch(
            `${API}/sessions/${sessionId}`,
            {
              method: "DELETE",

              credentials:
                "include",
            }
          );

        return await parseResponse(
          response
        );
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to end realtime session."
        );
      }
    }
  );

const initialState = {
  session: null,

  socketUrl: "",
  socketToken: "",

  status: "idle",
connectionStage: "idle",
  connected: false,
  microphoneActive: false,
  assistantSpeaking: false,

  userTranscript: "",
  assistantTranscript: "",

  messages: [],

  error: null,
};

const realtimeSlice =
  createSlice({
    name: "realtime",

    initialState,

    reducers: {
      setRealtimeConnected(
        state,
        action
      ) {
        state.connected =
          Boolean(action.payload);
      },
setConnectionStage(
  state,
  action
) {
  state.connectionStage =
    action.payload || "idle";
},
      setMicrophoneActive(
        state,
        action
      ) {
        state.microphoneActive =
          Boolean(action.payload);
      },

      setAssistantSpeaking(
        state,
        action
      ) {
        state.assistantSpeaking =
          Boolean(action.payload);
      },

      setUserTranscript(
        state,
        action
      ) {
        state.userTranscript =
          action.payload || "";
      },

      setAssistantTranscript(
        state,
        action
      ) {
        state.assistantTranscript =
          action.payload || "";
      },

      appendRealtimeMessage(
        state,
        action
      ) {
        const role =
          action.payload?.role;

        const text =
          String(
            action.payload?.text ||
              ""
          ).trim();

        if (
          !text ||
          ![
            "user",
            "assistant",
          ].includes(role)
        ) {
          return;
        }

        state.messages.push({
          id:
            `${Date.now()}-${Math.random()}`,

          role,
          text,

          createdAt:
            new Date().toISOString(),
        });

        if (
          state.messages.length >
          100
        ) {
          state.messages =
            state.messages.slice(
              -100
            );
        }
      },

      clearRealtimeMessages(
        state
      ) {
        state.messages = [];

        state.userTranscript =
          "";

        state.assistantTranscript =
          "";
      },

      setRealtimeError(
        state,
        action
      ) {
        state.error =
          action.payload || null;
      },

      clearRealtimeError(
        state
      ) {
        state.error = null;
      },

      clearRealtimeState(
        state
      ) {
        Object.assign(
          state,
          initialState
        );
      },
    },

    extraReducers:
      (builder) => {
        builder

          /* CREATE */

          .addCase(
            createRealtimeSession.pending,
            (state) => {
              state.status =
                "creating";

              state.error = null;
            }
          )

          .addCase(
            createRealtimeSession.fulfilled,
            (
              state,
              action
            ) => {
              state.status =
                "created";

              state.session =
                action.payload
                  .session;

              state.socketUrl =
                action.payload
                  .socketUrl;

              state.socketToken =
                action.payload
                  .socketToken;

              state.error = null;
            }
          )

          .addCase(
            createRealtimeSession.rejected,
            (
              state,
              action
            ) => {
              state.status =
                "failed";

              state.error =
                action.payload ||
                "Unable to create realtime session.";
            }
          )

          /* FETCH */

          .addCase(
            fetchRealtimeSession.fulfilled,
            (
              state,
              action
            ) => {
              state.session =
                action.payload
                  .session;
            }
          )

          /* END */

          .addCase(
            endRealtimeSession.pending,
            (state) => {
              state.status =
                "ending";
            }
          )

          .addCase(
            endRealtimeSession.fulfilled,
            (state) => {
              state.session = null;

              state.socketUrl =
                "";

              state.socketToken =
                "";

              state.status =
                "ended";

              state.connected =
                false;

              state.microphoneActive =
                false;

              state.assistantSpeaking =
                false;
            }
          )

          .addCase(
            endRealtimeSession.rejected,
            (
              state,
              action
            ) => {
              state.status =
                "failed";

              state.error =
                action.payload ||
                "Unable to end realtime session.";
            }
          );
      },
  });

export const {
  setConnectionStage,
  setRealtimeConnected,
  setMicrophoneActive,
  setAssistantSpeaking,
  setUserTranscript,
  setAssistantTranscript,
  appendRealtimeMessage,
  clearRealtimeMessages,
  setRealtimeError,
  clearRealtimeError,
  clearRealtimeState,
} = realtimeSlice.actions;

export default realtimeSlice.reducer;