import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials, {
        withCredentials: true,
      });
      const { userId, email, role, username } = response.data;

      return { 
        user: { userId, email, role, username },
        message: "Giriş başarılı! Hoş geldiniz."
      };
    } catch (error) {
      console.error("Login işlemi sırasında hata: ", error);
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Bilinmeyen bir hata oluştu.",
          type: "error"
        });
      } else if (error.request) {
        return rejectWithValue({
          message: "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.",
          type: "error"
        });
      } else {
        return rejectWithValue({
          message: "Bir hata oluştu. Lütfen tekrar deneyin.",
          type: "error"
        });
      }
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData, {
        withCredentials: true,
      });
      const { userId, email, role } = response.data;
      return { 
        user: { userId, email, role },
        message: "Kayıt başarılı! Giriş yapabilirsiniz."
      };
    } catch (error) {
      console.error("Register işlemi sırasında hata: ", error);
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Bilinmeyen bir hata oluştu.",
          type: "error"
        });
      } else if (error.request) {
        return rejectWithValue({
          message: "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.",
          type: "error"
        });
      } else {
        return rejectWithValue({
          message: "Bir hata oluştu. Lütfen tekrar deneyin.",
          type: "error"
        });
      }
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      return true;
    } catch (error) {
      console.log("Logout isteği başarısız", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(
          "Çıkış işlemi başarısız oldu. Lütfen tekrar deneyin."
        );
      }
    }
  }
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/getAuthUser", {
        withCredentials: true, // Çerezdeki tokeni otomatik olarak backend'e gönderir
      });
      const { userId, role } = response.data;
      return { userId, role };
    } catch (error) {
      console.error("Kullanıcı bilgileri yüklenirken hata:", error);
      return rejectWithValue("Oturum bilgileri yüklenemedi.");
    }
  }
);

export const getServerDate = createAsyncThunk(
  "auth/getServerDate",
  async () => {
    const res = await axiosInstance.get("/auth/getServerDate");
    return res.data.today;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
    authIsLoading: false,
    error: null,
    successMessage: null,
    serverDate: null,
  },
  reducers: {
    clearUserState: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.error = null;
        state.successMessage = action.payload.message;
        state.authIsLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.authIsLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.successMessage = null;
        state.authIsLoading = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.error = null;
        state.successMessage = action.payload.message;
        state.authIsLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.successMessage = null;
        state.authIsLoading = false;
      })
      .addCase(register.pending, (state) => {
        state.authIsLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.successMessage = "Başarıyla çıkış yapıldı.";
        state.authIsLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.authIsLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.successMessage = null;
        state.authIsLoading = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        state.authIsLoading = false;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.payload;
        state.authIsLoading = false;
      })
      .addCase(loadUser.pending, (state) => {
        state.authIsLoading = true;
      })
      .addCase(getServerDate.pending, (state) => {
        state.authIsLoading = true;
      })
      .addCase(getServerDate.fulfilled, (state, action) => {
        state.authIsLoading = false;
        state.serverDate = action.payload;
      })
      .addCase(getServerDate.rejected, (state) => {
        state.authIsLoading = false;
      });
  },
});

export const { clearUserState } = authSlice.actions;
export default authSlice.reducer;
