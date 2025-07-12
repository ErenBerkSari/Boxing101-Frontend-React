import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const createMovement = createAsyncThunk(
  "movement/createMovement",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/movement", credentials);

      const { movementName } = response.data;
      return `${movementName} was created.`;
    } catch (error) {
      console.error("Error during movement creation: ", error);
      if (error.response) {
        console.error("Server error: ", error.response.data);
        return rejectWithValue(error.response.data.message);
      } else if (error.request) {
        return rejectWithValue("No response received from server.");
      } else {
        return rejectWithValue("Creating movement failed. Please try again.");
      }
    }
  }
);
export const getAllMovements = createAsyncThunk(
  "movement/getAllMovements",
  async () => {
    const response = await axiosInstance.get("/movement");
    return response.data;
  }
);

export const getMovement = createAsyncThunk(
  "movement/getMovementById",
  async (movementId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/movement/${movementId}`);

      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteMovement = createAsyncThunk(
  "movement/deleteMovement",
  async (movementId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/movement/${movementId}`);
      return movementId;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updateMovement = createAsyncThunk(
  "movement/updateMovement",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/movement/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // FormData için gerekli header
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const movementSlice = createSlice({
  name: "movement",
  initialState: {
    movements: [],
    movement: {},
    isLoading: false,
  },
  reducers: {
    clearMovementState: (state) => {
      state.movement = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMovement.fulfilled, (state, action) => {
        state.movement = action.payload;
        state.isLoading = false;
      })
      .addCase(getMovement.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getAllMovements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMovements.fulfilled, (state, action) => {
        state.movements = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllMovements.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteMovement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMovement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movements = state.movements.filter(
          (movement) => movement._id !== action.payload
        );
      })
      .addCase(deleteMovement.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateMovement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMovement.fulfilled, (state, action) => {
        state.movement = action.payload;
        state.isLoading = false;
      })
      .addCase(updateMovement.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
export const { clearMovementState } = movementSlice.actions;

export default movementSlice.reducer;
