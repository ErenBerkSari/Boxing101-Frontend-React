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


export const completeUserCreatedProgramDay = createAsyncThunk(
  "user/completeUserCreatedProgramDay",
  async (
    { programId, dayId, lastCompletedStep = 0 },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await axiosInstance.patch(`/user/complete-user-created-day`, {
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
export const completeDefaultProgramDay = createAsyncThunk(
  "user/completeDefaultProgramDay",
  async (
    { programId, dayId, lastCompletedStep = 0 },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await axiosInstance.patch(`/user/complete-day-default`, {
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

export const completeProgram = createAsyncThunk(
  "user/completeProgram",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/user/${programId}/complete`);
      console.log("Program tamamlama başarılı:", response.data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Program tamamlama hatası.";
      console.error("Program tamamlama hatası:", message);
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

export const getUserRegisteredPrograms = createAsyncThunk(
  "program/getUserRegisterPrograms",
  async () => {
    const response = await axiosInstance.get(
      "/program/getUserRegisterPrograms"
    );
    return response.data;
  }
);

export const getUserStats = createAsyncThunk(
  "user/getUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/stats");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Kullanıcı istatistikleri alınamadı.";
      console.error("İstatistik alma hatası:", message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  isRegisteredProgram: null,
  userIsLoading: false,
  isProgressLoading: false,
  error: null,
  progress: {
    programId: null,
    isCompleted: false,
    progress: [],
    totalDays: 0
  },
  completedDays: [],
  dayCompletionSuccess: false,
  currentProgramId: null,
  userRegisteredPrograms: [],
  userRegisteredProgramsLoading: false,
  programCompletionSuccess: false,
  completedPrograms: [],
  userStats: {
    user: {
      username: '',
      email: '',
      role: ''
    },
    stats: {
      totalPrograms: 0,
      totalCompletedPrograms: 0,
      registeredPrograms: 0,
      completedRegisteredPrograms: 0,
      userCreatedPrograms: 0,
      completedUserCreatedPrograms: 0
    }
  },
  userStatsLoading: false,
  userStatsError: null
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
        state.progress = initialState.progress;
        state.completedDays = [];
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

      // completeDefaultProgramDay
      .addCase(completeDefaultProgramDay.pending, (state) => {
        state.userIsLoading = true;
        state.dayCompletionSuccess = false;
        state.error = null;
      })
      .addCase(completeDefaultProgramDay.fulfilled, (state, action) => {
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
      .addCase(completeDefaultProgramDay.rejected, (state, action) => {
        state.userIsLoading = false;
        state.dayCompletionSuccess = false;
        state.error = action.payload;
      })
// completeUserCreatedProgramDay
.addCase(completeUserCreatedProgramDay.pending, (state) => {
  state.userIsLoading = true;
  state.dayCompletionSuccess = false;
  state.error = null;
})
.addCase(completeUserCreatedProgramDay.fulfilled, (state, action) => {
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
.addCase(completeUserCreatedProgramDay.rejected, (state, action) => {
  state.userIsLoading = false;
  state.dayCompletionSuccess = false;
  state.error = action.payload;
})
      // getProgramProgress
      .addCase(getProgramProgress.pending, (state) => {
        state.isProgressLoading = true;
        state.error = null;
      })
      .addCase(getProgramProgress.fulfilled, (state, action) => {
        state.isProgressLoading = false;
        // Progress'i güncellerken programId'yi de sakla
        state.progress = {
          ...action.payload,
          programId: action.payload.programId
        };
        state.completedDays = action.payload.completedDays || [];
      })
      .addCase(getProgramProgress.rejected, (state, action) => {
        state.isProgressLoading = false;
        state.error = action.payload;
        // Hata durumunda progress'i sıfırla
        state.progress = initialState.progress;
        state.completedDays = [];
      })

      // getUserRegisteredPrograms
      .addCase(getUserRegisteredPrograms.fulfilled, (state, action) => {
        state.userRegisteredPrograms = action.payload;
        state.userRegisteredProgramsLoading = false;
      })
      .addCase(getUserRegisteredPrograms.rejected, (state, action) => {
        state.userRegisteredPrograms = [];
        state.userRegisteredProgramsLoading = false;
      })
      .addCase(getUserRegisteredPrograms.pending, (state) => {
        state.userRegisteredProgramsLoading = true;
      })

      // completeProgram
      .addCase(completeProgram.pending, (state) => {
        state.userIsLoading = true;
        state.programCompletionSuccess = false;
        state.error = null;
      })
      .addCase(completeProgram.fulfilled, (state, action) => {
        state.userIsLoading = false;
        state.programCompletionSuccess = true;
        state.error = null;

        // Tamamlanan programı lokalde güncelle
        if (action.meta.arg) {
          const existingProgramIndex = state.completedPrograms.findIndex(
            (program) => program.programId === action.meta.arg
          );

          if (existingProgramIndex === -1) {
            state.completedPrograms.push({
              programId: action.meta.arg,
              completedAt: new Date().toISOString(),
            });
          }
        }
      })
      .addCase(completeProgram.rejected, (state, action) => {
        state.userIsLoading = false;
        state.programCompletionSuccess = false;
        state.error = action.payload;
      })

      // getUserStats
      .addCase(getUserStats.pending, (state) => {
        state.userStatsLoading = true;
        state.userStatsError = null;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.userStatsLoading = false;
        state.userStats = action.payload;
        state.userStatsError = null;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.userStatsLoading = false;
        state.userStatsError = action.payload;
      });
  },
});

export const { clearDayCompletionStatus, setCurrentProgram, resetUserState } =
  userSlice.actions;

export default userSlice.reducer;
