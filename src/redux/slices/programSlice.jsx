import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const createProgram = createAsyncThunk(
  "program/createProgram",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/program", formData);
      return "Program başarıyla oluşturuldu.";
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else if (error.request) {
        return rejectWithValue("Sunucudan yanıt alınamadı.");
      } else {
        return rejectWithValue("Program oluşturulurken bir hata oluştu.");
      }
    }
  }
);

export const createProgramByUser = createAsyncThunk(
  "program/createProgramByUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/program/createProgramByUser",
        formData
      );
      return "Program başarıyla oluşturuldu.";
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else if (error.request) {
        return rejectWithValue("Sunucudan yanıt alınamadı.");
      } else {
        return rejectWithValue("Program oluşturulurken bir hata oluştu.");
      }
    }
  }
);
export const getAllPrograms = createAsyncThunk(
  "program/getAllPrograms",
  async () => {
    const response = await axiosInstance.get("/program");
    return response.data;
  }
);
export const getUserCreatedAllPrograms = createAsyncThunk(
  "program/getUserCreatedAllPrograms",
  async () => {
    const response = await axiosInstance.get("/program/getUserCreatedPrograms");
    return response.data;
  }
);
export const getProgramDetail = createAsyncThunk(
  "program/getProgramDetail",
  async (programId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/program/${programId}`);

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Bir hata oluştu";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProgramDetailByUser = createAsyncThunk(
  "program/getProgramDetailByUser",
  async (programId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/program/user${programId}`);

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Bir hata oluştu";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
  programs: [],
  usersPrograms: {
    programs: []
  },
  programDetail: null,
  usersProgramDetail: null,
};

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    clearProgramMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
    resetProgramState: (state) => {
      state.success = false;
      state.error = null;
      state.message = "";
    },
    clearProgramDetail: (state) => {
      state.programDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProgram.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(createProgramByUser.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(createProgramByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(createProgramByUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(getAllPrograms.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(getAllPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
        state.programs = action.payload;
      })
      .addCase(getAllPrograms.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(getUserCreatedAllPrograms.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(getUserCreatedAllPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = null;
        const programs = action.payload?.programs || [];
        const uniquePrograms = programs.filter((program, index, self) =>
          index === self.findIndex((p) => p._id === program._id)
        );
        state.usersPrograms = {
          ...action.payload,
          programs: uniquePrograms
        };
      })
      .addCase(getUserCreatedAllPrograms.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      .addCase(getProgramDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProgramDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.programDetail = action.payload;
      })
      .addCase(getProgramDetail.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || "Program detayı alınamadı.";
      })
      .addCase(getProgramDetailByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProgramDetailByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usersProgramDetail = action.payload;
      })
      .addCase(getProgramDetailByUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || "Program detayı alınamadı.";
      });
  },
});
export const { resetProgramState, clearProgramDetail, clearProgramMessages } =
  programSlice.actions;

export default programSlice.reducer;
