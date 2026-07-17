import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api";



export const createTwinBasicInfo = createAsyncThunk(
  "twin/createBasicInfo",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(
        "/api/twin/basic-info",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchTwins = createAsyncThunk(
  "twin/fetchTwins",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/api/twin");
      return data.twins || data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveTwinAppearance = createAsyncThunk(
  "twin/saveAppearance",
  async (
    {
      twinId,
      avatarFile,
      avatarUrl,
      style,
      background,
      clothingStyle,
      gesture,
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      if (avatarFile) formData.append("avatar", avatarFile);
      if (avatarUrl) formData.append("avatarUrl", avatarUrl);
      if (style) formData.append("style", style);
      if (background) formData.append("background", background);
      if (clothingStyle) formData.append("clothingStyle", clothingStyle);
      if (gesture) formData.append("gesture", gesture);

      return await apiRequest(`/api/twin/${twinId}/appearance`, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveTwinVoice = createAsyncThunk(
  "twin/saveVoice",
  async (
    { twinId, voiceType, language, speed, pitch, sampleFile },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      if (voiceType) formData.append("voiceType", voiceType);
      if (language) formData.append("language", language);
      if (speed !== undefined) formData.append("speed", String(speed));
      if (pitch !== undefined) formData.append("pitch", String(pitch));
      if (sampleFile) formData.append("sample", sampleFile);

      return await apiRequest(`/api/twin/${twinId}/voice`, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveTwinKnowledge = createAsyncThunk(
  "twin/saveKnowledge",
  async (
    { twinId, title, text, websiteUrl, documentFile, productId },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      if (title) formData.append("title", title);
      if (text) formData.append("text", text);
      if (websiteUrl) formData.append("websiteUrl", websiteUrl);
      if (documentFile) formData.append("document", documentFile);
      if (productId) formData.append("productId", productId);

      return await apiRequest(`/api/twin/${twinId}/knowledge`, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const twinSlice = createSlice({
  name: "twin",
  initialState: {
    twins: [],
    loading: false,
    initialized: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(
  createTwinBasicInfo.pending,
  (state) => {
    state.loading = true;
    state.error = "";
  }
)

.addCase(
  createTwinBasicInfo.fulfilled,
  (state) => {
    state.loading = false;
  }
)

.addCase(
  createTwinBasicInfo.rejected,
  (state, action) => {
    state.loading = false;
    state.error =
      action.payload ||
      "Unable to create AI Twin.";
  }
)
      .addCase(fetchTwins.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchTwins.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.twins = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTwins.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload || "Unable to load AI Twins.";
      });
  },
});

export default twinSlice.reducer;
