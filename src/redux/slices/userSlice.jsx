import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const registerProgram = createAsyncThunk(
  "user/registerProgram",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/user/${programId}/registerProgram`
      );

      console.log("Program başarıyla kaydedildi:", response.data);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Beklenmeyen bir hata oluştu.";
      console.error("Program kaydı hatası:", message);
      return rejectWithValue(message);
    }
  }
);
export const programIsRegistered = createAsyncThunk(
  "user/programIsRegistered",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/user/${programId}/isRegistered`
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Beklenmeyen bir hata oluştu.";
      console.error("Program kontrol hatası:", message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  userIsLoading: false,
  isRegisteredProgram: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerProgram.rejected, (state) => {
        state.userIsLoading = false;
      })
      .addCase(registerProgram.fulfilled, (state) => {
        state.userIsLoading = false;
      })
      .addCase(registerProgram.pending, (state) => {
        state.userIsLoading = true;
      })
      .addCase(programIsRegistered.rejected, (state) => {
        state.userIsLoading = false;
      })
      .addCase(programIsRegistered.fulfilled, (state, action) => {
        state.userIsLoading = false;
        state.isRegisteredProgram = action.payload;
      })
      .addCase(programIsRegistered.pending, (state) => {
        state.userIsLoading = true;
      });
  },
});
export const {} = userSlice.actions;

export default userSlice.reducer;
