import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  SocialActivity,
  Friend,
  FriendRequest,
  Reaction,
  Comment,
} from "../../types/api";
import { socialService } from "../../services/api/socialService";

type ReactionType = "like" | "fire" | "strong" | "clap" | "heart";

type UserSearchResult = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isFollowing: boolean;
  mutualFriends: number;
};

// Async Thunks
export const getFeed = createAsyncThunk(
  "social/getFeed",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      return await socialService.getFeed(params);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get social feed");
    }
  }
);

export const getFriends = createAsyncThunk(
  "social/getFriends",
  async (_, { rejectWithValue }) => {
    try {
      return await socialService.getFriends();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get friends");
    }
  }
);

export const getFriendRequests = createAsyncThunk(
  "social/getFriendRequests",
  async (type: "sent" | "received" = "received", { rejectWithValue }) => {
    try {
      return await socialService.getFriendRequests(type);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get friend requests");
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  "social/sendFriendRequest",
  async (params: { userId: string; message?: string }, { rejectWithValue }) => {
    try {
      return await socialService.sendFriendRequest(
        params.userId,
        params.message
      );
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to send friend request");
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "social/acceptFriendRequest",
  async (requestId: string, { rejectWithValue }) => {
    try {
      await socialService.acceptFriendRequest(requestId);
      return requestId;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to accept friend request"
      );
    }
  }
);

export const declineFriendRequest = createAsyncThunk(
  "social/declineFriendRequest",
  async (requestId: string, { rejectWithValue }) => {
    try {
      await socialService.declineFriendRequest(requestId);
      return requestId;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to decline friend request"
      );
    }
  }
);

export const addReaction = createAsyncThunk(
  "social/addReaction",
  async (
    params: { activityId: string; reactionType: ReactionType },
    { rejectWithValue }
  ) => {
    try {
      await socialService.addReaction(params.activityId, params.reactionType);
      return params;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add reaction");
    }
  }
);

export const addComment = createAsyncThunk(
  "social/addComment",
  async (
    params: { activityId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const comment = await socialService.addComment(
        params.activityId,
        params.content
      );
      return { activityId: params.activityId, comment };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add comment");
    }
  }
);

export const searchUsers = createAsyncThunk(
  "social/searchUsers",
  async (query: string, { rejectWithValue }) => {
    try {
      return await socialService.searchUsers(query);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search users");
    }
  }
);

// State Interface
interface SocialState {
  feed: SocialActivity[];
  friends: Friend[];
  friendRequests: FriendRequest[];
  searchResults: UserSearchResult[];
  loading: {
    feed: boolean;
    friends: boolean;
    friendRequests: boolean;
    sendingRequest: boolean;
    responding: boolean;
    addingReaction: boolean;
    addingComment: boolean;
    searching: boolean;
  };
  error: {
    feed: string | null;
    friends: string | null;
    friendRequests: string | null;
    sendingRequest: string | null;
    responding: string | null;
    addingReaction: string | null;
    addingComment: string | null;
    searching: string | null;
  };
  feedPagination: {
    page: number;
    hasMore: boolean;
  };
  selectedActivity: SocialActivity | null;
}

// Initial State
const initialState: SocialState = {
  feed: [],
  friends: [],
  friendRequests: [],
  searchResults: [],
  loading: {
    feed: false,
    friends: false,
    friendRequests: false,
    sendingRequest: false,
    responding: false,
    addingReaction: false,
    addingComment: false,
    searching: false,
  },
  error: {
    feed: null,
    friends: null,
    friendRequests: null,
    sendingRequest: null,
    responding: null,
    addingReaction: null,
    addingComment: null,
    searching: null,
  },
  feedPagination: {
    page: 1,
    hasMore: true,
  },
  selectedActivity: null,
};

// Slice
const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error.searching = null;
    },
    setSelectedActivity: (
      state,
      action: PayloadAction<SocialActivity | null>
    ) => {
      state.selectedActivity = action.payload;
    },
    updateLocalReaction: (
      state,
      action: PayloadAction<{ activityId: string; reaction: Reaction }>
    ) => {
      const activity = state.feed.find(
        (a) => a.id === action.payload.activityId
      );
      if (activity) {
        const existingReaction = activity.reactions.find(
          (r) => r.userId === action.payload.reaction.userId
        );
        if (existingReaction) {
          existingReaction.type = action.payload.reaction.type;
        } else {
          activity.reactions.push(action.payload.reaction);
        }
      }
    },
    updateLocalComment: (
      state,
      action: PayloadAction<{ activityId: string; comment: Comment }>
    ) => {
      const activity = state.feed.find(
        (a) => a.id === action.payload.activityId
      );
      if (activity) {
        activity.comments.push(action.payload.comment);
      }
    },
    removeFriendRequest: (state, action: PayloadAction<string>) => {
      state.friendRequests = state.friendRequests.filter(
        (req) => req.id !== action.payload
      );
    },
    addNewFriend: (state, action: PayloadAction<Friend>) => {
      if (!state.friends.find((f) => f.id === action.payload.id)) {
        state.friends.push(action.payload);
      }
    },
    resetFeed: (state) => {
      state.feed = [];
      state.feedPagination = { page: 1, hasMore: true };
    },
    clearErrors: (state) => {
      state.error = {
        feed: null,
        friends: null,
        friendRequests: null,
        sendingRequest: null,
        responding: null,
        addingReaction: null,
        addingComment: null,
        searching: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Get Feed
    builder
      .addCase(getFeed.pending, (state) => {
        state.loading.feed = true;
        state.error.feed = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.loading.feed = false;
        if (state.feedPagination.page === 1) {
          state.feed = action.payload.items;
        } else {
          state.feed = [...state.feed, ...action.payload.items];
        }
        state.feedPagination.hasMore =
          action.payload.pagination.page < action.payload.pagination.pages;
        state.feedPagination.page = action.payload.pagination.page;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.loading.feed = false;
        state.error.feed = action.payload as string;
      });

    // Get Friends
    builder
      .addCase(getFriends.pending, (state) => {
        state.loading.friends = true;
        state.error.friends = null;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.loading.friends = false;
        state.friends = action.payload;
      })
      .addCase(getFriends.rejected, (state, action) => {
        state.loading.friends = false;
        state.error.friends = action.payload as string;
      });

    // Get Friend Requests
    builder
      .addCase(getFriendRequests.pending, (state) => {
        state.loading.friendRequests = true;
        state.error.friendRequests = null;
      })
      .addCase(getFriendRequests.fulfilled, (state, action) => {
        state.loading.friendRequests = false;
        state.friendRequests = action.payload;
      })
      .addCase(getFriendRequests.rejected, (state, action) => {
        state.loading.friendRequests = false;
        state.error.friendRequests = action.payload as string;
      });

    // Send Friend Request
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading.sendingRequest = true;
        state.error.sendingRequest = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.loading.sendingRequest = false;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading.sendingRequest = false;
        state.error.sendingRequest = action.payload as string;
      });

    // Accept Friend Request
    builder
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading.responding = true;
        state.error.responding = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading.responding = false;
        state.friendRequests = state.friendRequests.filter(
          (req) => req.id !== action.payload
        );
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading.responding = false;
        state.error.responding = action.payload as string;
      });

    // Decline Friend Request
    builder
      .addCase(declineFriendRequest.pending, (state) => {
        state.loading.responding = true;
        state.error.responding = null;
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        state.loading.responding = false;
        state.friendRequests = state.friendRequests.filter(
          (req) => req.id !== action.payload
        );
      })
      .addCase(declineFriendRequest.rejected, (state, action) => {
        state.loading.responding = false;
        state.error.responding = action.payload as string;
      });

    // Add Reaction
    builder
      .addCase(addReaction.pending, (state) => {
        state.loading.addingReaction = true;
        state.error.addingReaction = null;
      })
      .addCase(addReaction.fulfilled, (state) => {
        state.loading.addingReaction = false;
      })
      .addCase(addReaction.rejected, (state, action) => {
        state.loading.addingReaction = false;
        state.error.addingReaction = action.payload as string;
      });

    // Add Comment
    builder
      .addCase(addComment.pending, (state) => {
        state.loading.addingComment = true;
        state.error.addingComment = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading.addingComment = false;
        const activity = state.feed.find(
          (a) => a.id === action.payload.activityId
        );
        if (activity) {
          const comment: Comment = {
            id: action.payload.comment.id,
            userId: action.payload.comment.userId,
            userName: action.payload.comment.userName,
            content: action.payload.comment.content,
            timestamp: action.payload.comment.timestamp,
          };
          activity.comments.push(comment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading.addingComment = false;
        state.error.addingComment = action.payload as string;
      });

    // Search Users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading.searching = true;
        state.error.searching = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading.searching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading.searching = false;
        state.error.searching = action.payload as string;
      });
  },
});

export const {
  clearSearchResults,
  setSelectedActivity,
  updateLocalReaction,
  updateLocalComment,
  removeFriendRequest,
  addNewFriend,
  resetFeed,
  clearErrors,
} = socialSlice.actions;

export default socialSlice.reducer;
