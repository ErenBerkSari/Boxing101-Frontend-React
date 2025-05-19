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

export const completeProgramDay = createAsyncThunk(
  "user/completeProgramDay",
  async (
    { programId, dayId, lastCompletedStep = 0 },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await axiosInstance.patch(`/user/complete-day`, {
        programId,
        dayId,
        lastCompletedStep,
      });
      console.log("Gün tamamlama başarılı:", response.data);

      // Tamamlama işleminden sonra ilerleme bilgisini otomatik yenile
      dispatch(getProgramProgress(programId));

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Gün tamamlama hatası.";
      console.error("Gün tamamlama hatası:", message);
      return rejectWithValue(message);
    }
  }
);

export const getProgramProgress = createAsyncThunk(
  "user/getProgramProgress",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/${programId}/progress`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "İlerleme verisi alınamadı.";
      console.error("İlerleme alma hatası:", message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  userIsLoading: false,
  isRegisteredProgram: null,
  error: null,
  dayCompletionSuccess: false,
  progress: [],
  isProgressLoading: false,
  progressError: null,
  completedDays: [],
  currentProgramId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearDayCompletionStatus: (state) => {
      state.dayCompletionSuccess = false;
      state.error = null;
    },
    setCurrentProgram: (state, action) => {
      state.currentProgramId = action.payload;
    },
    resetUserState: (state) => {
      return {
        ...initialState,
        isRegisteredProgram: state.isRegisteredProgram,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // registerProgram
      .addCase(registerProgram.rejected, (state, action) => {
        state.userIsLoading = false;
        state.error = action.payload;
      })
      .addCase(registerProgram.fulfilled, (state, action) => {
        state.userIsLoading = false;
        state.error = null;
        // Kayıt başarılı olduğunda güncelle
        state.isRegisteredProgram = { isRegistered: true };
      })
      .addCase(registerProgram.pending, (state) => {
        state.userIsLoading = true;
        state.error = null;
      })

      // programIsRegistered
      .addCase(programIsRegistered.rejected, (state, action) => {
        state.userIsLoading = false;
        state.error = action.payload;
      })
      .addCase(programIsRegistered.fulfilled, (state, action) => {
        state.userIsLoading = false;
        state.isRegisteredProgram = action.payload;
        state.error = null;
      })
      .addCase(programIsRegistered.pending, (state) => {
        state.userIsLoading = true;
        state.error = null;
      })

      // completeProgramDay
      .addCase(completeProgramDay.pending, (state) => {
        state.userIsLoading = true;
        state.dayCompletionSuccess = false;
        state.error = null;
      })
      .addCase(completeProgramDay.fulfilled, (state, action) => {
        state.userIsLoading = false;
        state.dayCompletionSuccess = true;
        state.error = null;

        // Tamamlanan gün verisini lokalde güncelle (getProgramProgress yanıtı gelene kadar)
        if (action.meta.arg.dayId) {
          // completedDays dizisine ekle (varsa güncelle)
          const existingDayIndex = state.completedDays.findIndex(
            (day) => day.dayId === action.meta.arg.dayId
          );

          if (existingDayIndex === -1) {
            state.completedDays.push({
              dayId: action.meta.arg.dayId,
              completedAt: new Date().toISOString(),
            });
          }
        }
      })
      .addCase(completeProgramDay.rejected, (state, action) => {
        state.userIsLoading = false;
        state.dayCompletionSuccess = false;
        state.error = action.payload;
      })

      // getProgramProgress
      .addCase(getProgramProgress.pending, (state) => {
        state.isProgressLoading = true;
        state.progressError = null;
      })
      .addCase(getProgramProgress.fulfilled, (state, action) => {
        state.isProgressLoading = false;
        state.progress = action.payload;
        state.completedDays = action.payload.completedDays || [];
        state.progressError = null;

        // Program ID'sini sakla
        if (action.meta.arg) {
          state.currentProgramId = action.meta.arg;
        }
      })
      .addCase(getProgramProgress.rejected, (state, action) => {
        state.isProgressLoading = false;
        state.progressError = action.payload;
      });
  },
});

export const { clearDayCompletionStatus, setCurrentProgram, resetUserState } =
  userSlice.actions;

export default userSlice.reducer;
