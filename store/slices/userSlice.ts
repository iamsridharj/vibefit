import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, FitnessProfile } from "../../types/api";
import { userService } from "../../services/api/userService";

interface UserState {
  profile: User | null;
  fitnessProfile: FitnessProfile | null;
  isLoading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
}

const initialState: UserState = {
  profile: null,
  fitnessProfile: null,
  isLoading: false,
  error: null,
  onboardingCompleted: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const profile = await userService.getProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const profile = await userService.updateProfile(data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFitnessProfile = createAsyncThunk(
  "user/fetchFitnessProfile",
  async (_, { rejectWithValue }) => {
    try {
      const fitnessProfile = await userService.getFitnessProfile();
      return fitnessProfile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFitnessProfile = createAsyncThunk(
  "user/updateFitnessProfile",
  async (data: Partial<FitnessProfile>, { rejectWithValue }) => {
    try {
      const fitnessProfile = await userService.updateFitnessProfile(data);
      return fitnessProfile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  "user/completeOnboarding",
  async (data: any, { rejectWithValue }) => {
    try {
      const result = await userService.completeOnboarding(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboardingCompleted = action.payload;
    },
    updateProfileField: (
      state,
      action: PayloadAction<{ field: keyof User; value: any }>
    ) => {
      if (state.profile) {
        (state.profile as any)[action.payload.field] = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.onboardingCompleted = !!(
          action.payload.primaryGoal && action.payload.experienceLevel
        );
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch fitness profile
    builder
      .addCase(fetchFitnessProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFitnessProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fitnessProfile = action.payload;
      })
      .addCase(fetchFitnessProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update fitness profile
    builder
      .addCase(updateFitnessProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFitnessProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fitnessProfile = action.payload;
      })
      .addCase(updateFitnessProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Complete onboarding
    builder
      .addCase(completeOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user;
        state.fitnessProfile = action.payload.fitnessProfile;
        state.onboardingCompleted = true;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError, setOnboardingCompleted, updateProfileField } =
  userSlice.actions;
export default userSlice.reducer;
