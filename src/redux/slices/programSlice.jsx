import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Program oluşturma işlemini yapan asenkron thunk
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

const initialState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
  programs: [],
};

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    clearProgramMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
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
      });
  },
});

export const { clearProgramMessages } = programSlice.actions;
export default programSlice.reducer;
