import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, ExerciseSearchParams } from "../../types/api";
import { exerciseService } from "../../services/api/exerciseService";

// Async Thunks
export const searchExercises = createAsyncThunk(
  "exercise/searchExercises",
  async (params: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      return await exerciseService.searchExercises(params.query, params.limit);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search exercises");
    }
  }
);

export const getExercises = createAsyncThunk(
  "exercise/getExercises",
  async (params: ExerciseSearchParams, { rejectWithValue }) => {
    try {
      return await exerciseService.getExercises(params);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get exercises");
    }
  }
);

export const getExerciseRecommendations = createAsyncThunk(
  "exercise/getRecommendations",
  async (_, { rejectWithValue }) => {
    try {
      return await exerciseService.getRecommendedExercises();
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to get exercise recommendations"
      );
    }
  }
);

export const getMuscleGroups = createAsyncThunk(
  "exercise/getMuscleGroups",
  async (_, { rejectWithValue }) => {
    try {
      return await exerciseService.getMuscleGroups();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get muscle groups");
    }
  }
);

export const getEquipmentTypes = createAsyncThunk(
  "exercise/getEquipmentTypes",
  async (_, { rejectWithValue }) => {
    try {
      return await exerciseService.getEquipmentTypes();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get equipment types");
    }
  }
);

// State Interface
interface ExerciseState {
  exercises: Exercise[];
  searchResults: Exercise[];
  recommendations: Exercise[];
  muscleGroups: string[];
  equipmentTypes: string[];
  searchParams: ExerciseSearchParams;
  loading: {
    search: boolean;
    exercises: boolean;
    recommendations: boolean;
    muscleGroups: boolean;
    equipment: boolean;
  };
  error: {
    search: string | null;
    exercises: string | null;
    recommendations: string | null;
    muscleGroups: string | null;
    equipment: string | null;
  };
  selectedExercise: Exercise | null;
  favoriteExercises: string[];
  recentExercises: Exercise[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

// Initial State
const initialState: ExerciseState = {
  exercises: [],
  searchResults: [],
  recommendations: [],
  muscleGroups: [],
  equipmentTypes: [],
  searchParams: {
    q: "",
    page: 1,
    limit: 20,
  },
  loading: {
    search: false,
    exercises: false,
    recommendations: false,
    muscleGroups: false,
    equipment: false,
  },
  error: {
    search: null,
    exercises: null,
    recommendations: null,
    muscleGroups: null,
    equipment: null,
  },
  selectedExercise: null,
  favoriteExercises: [],
  recentExercises: [],
  pagination: null,
};

// Slice
const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    setSearchParams: (
      state,
      action: PayloadAction<Partial<ExerciseSearchParams>>
    ) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error.search = null;
    },
    setSelectedExercise: (state, action: PayloadAction<Exercise | null>) => {
      state.selectedExercise = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favoriteExercises.includes(action.payload)) {
        state.favoriteExercises.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favoriteExercises = state.favoriteExercises.filter(
        (id) => id !== action.payload
      );
    },
    addToRecentExercises: (state, action: PayloadAction<Exercise>) => {
      const existing = state.recentExercises.find(
        (ex) => ex.id === action.payload.id
      );
      if (!existing) {
        state.recentExercises.unshift(action.payload);
        // Keep only last 10 recent exercises
        if (state.recentExercises.length > 10) {
          state.recentExercises = state.recentExercises.slice(0, 10);
        }
      }
    },
    clearErrors: (state) => {
      state.error = {
        search: null,
        exercises: null,
        recommendations: null,
        muscleGroups: null,
        equipment: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Search Exercises
    builder
      .addCase(searchExercises.pending, (state) => {
        state.loading.search = true;
        state.error.search = null;
      })
      .addCase(searchExercises.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload;
      })
      .addCase(searchExercises.rejected, (state, action) => {
        state.loading.search = false;
        state.error.search = action.payload as string;
      });

    // Get Exercises
    builder
      .addCase(getExercises.pending, (state) => {
        state.loading.exercises = true;
        state.error.exercises = null;
      })
      .addCase(getExercises.fulfilled, (state, action) => {
        state.loading.exercises = false;
        state.exercises = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(getExercises.rejected, (state, action) => {
        state.loading.exercises = false;
        state.error.exercises = action.payload as string;
      });

    // Get Recommendations
    builder
      .addCase(getExerciseRecommendations.pending, (state) => {
        state.loading.recommendations = true;
        state.error.recommendations = null;
      })
      .addCase(getExerciseRecommendations.fulfilled, (state, action) => {
        state.loading.recommendations = false;
        state.recommendations = action.payload;
      })
      .addCase(getExerciseRecommendations.rejected, (state, action) => {
        state.loading.recommendations = false;
        state.error.recommendations = action.payload as string;
      });

    // Get Muscle Groups
    builder
      .addCase(getMuscleGroups.pending, (state) => {
        state.loading.muscleGroups = true;
        state.error.muscleGroups = null;
      })
      .addCase(getMuscleGroups.fulfilled, (state, action) => {
        state.loading.muscleGroups = false;
        state.muscleGroups = action.payload;
      })
      .addCase(getMuscleGroups.rejected, (state, action) => {
        state.loading.muscleGroups = false;
        state.error.muscleGroups = action.payload as string;
      });

    // Get Equipment Types
    builder
      .addCase(getEquipmentTypes.pending, (state) => {
        state.loading.equipment = true;
        state.error.equipment = null;
      })
      .addCase(getEquipmentTypes.fulfilled, (state, action) => {
        state.loading.equipment = false;
        state.equipmentTypes = action.payload;
      })
      .addCase(getEquipmentTypes.rejected, (state, action) => {
        state.loading.equipment = false;
        state.error.equipment = action.payload as string;
      });
  },
});

export const {
  setSearchParams,
  clearSearchResults,
  setSelectedExercise,
  addToFavorites,
  removeFromFavorites,
  addToRecentExercises,
  clearErrors,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;
