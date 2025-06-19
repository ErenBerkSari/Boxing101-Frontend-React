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
        message: "Giriş başarılı! Hoş geldiniz.",
      };
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        const message = error.response.data?.message || getDefaultErrorMessage(error.response.status);
        return rejectWithValue({ message, type: "error" });
      } else if (error.request) {
        return rejectWithValue({
          message: "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.",
          type: "error",
        });
      } else {
        return rejectWithValue({
          message: "Bir hata oluştu. Lütfen tekrar deneyin.",
          type: "error",
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
        message: "Kayıt başarılı! Giriş yapabilirsiniz.",
      };
    } catch (error) {
      console.error("Register error:", error);
      
      if (error.response) {
        const message = error.response.data?.message || getDefaultErrorMessage(error.response.status);
        return rejectWithValue({ message, type: "error" });
      } else if (error.request) {
        return rejectWithValue({
          message: "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.",
          type: "error",
        });
      } else {
        return rejectWithValue({
          message: "Bir hata oluştu. Lütfen tekrar deneyin.",
          type: "error",
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
      return { message: "Başarıyla çıkış yapıldı." };
    } catch (error) {
      console.error("Logout error:", error);
      // Logout işlemi başarısız olsa bile kullanıcıyı çıkış yapmış olarak kabul et
      return { message: "Çıkış yapıldı." };
    }
  }
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/getAuthUser", {
        withCredentials: true,
      });
      
      if (!response.data.isAuthenticated) {
        return rejectWithValue("Kullanıcı oturumu bulunmuyor.");
      }

      return {
        userId: response.data.userId,
        email: response.data.email,
        username: response.data.username,
        role: response.data.role
      };
    } catch (error) {
      console.error("Load user error:", error);
      return rejectWithValue("Kullanıcı bilgileri yüklenirken bir hata oluştu.");
    }
  }
);

export const getServerDate = createAsyncThunk(
  "auth/getServerDate",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/getServerDate");
      return res.data.now;
    } catch (error) {
      console.error("Get server date error:", error);
      return rejectWithValue("Sunucu tarihi alınırken hata oluştu.");
    }
  }
);

// Yardımcı fonksiyon
const getDefaultErrorMessage = (statusCode) => {
  switch (statusCode) {
    case 401:
      return "E-posta veya şifre yanlış.";
    case 404:
      return "Kullanıcı bulunamadı.";
    case 409:
      return "Bu e-posta ile zaten bir kullanıcı var.";
    case 500:
      return "Sunucuda bir hata oluştu.";
    default:
      return "Bilinmeyen bir hata oluştu.";
  }
};

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
    // Hata ve başarı mesajlarını temizlemek için yeni reducer
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.authIsLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.error = null;
        state.successMessage = action.payload.message;
        state.authIsLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.payload || { message: "Bir hata oluştu. Lütfen tekrar deneyin." };
        state.successMessage = null;
        state.authIsLoading = false;
      })
      
      // REGISTER
      .addCase(register.pending, (state) => {
        state.authIsLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.error = null;
        state.successMessage = action.payload.message;
        state.authIsLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.payload || { message: "Bir hata oluştu. Lütfen tekrar deneyin." };
        state.successMessage = null;
        state.authIsLoading = false;
      })
      
      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.authIsLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.successMessage = action.payload.message;
        state.authIsLoading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        // Logout başarısız olsa bile kullanıcıyı çıkış yapmış olarak kabul et
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.successMessage = "Çıkış yapıldı.";
        state.authIsLoading = false;
      })
      
      // LOAD USER
      .addCase(loadUser.pending, (state) => {
        state.authIsLoading = true;
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
        state.error = null;
        state.authIsLoading = false;
      })
      
      // GET SERVER DATE
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

export const { clearUserState, clearMessages } = authSlice.actions;
export default authSlice.reducer;