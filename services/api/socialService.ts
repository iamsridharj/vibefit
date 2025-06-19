import { apiClient } from "./apiClient";
import {
  SocialActivity,
  Friend,
  FriendRequest,
  PaginatedResponse,
} from "../../types/api";

export class SocialService {
  // User Search and Discovery
  async searchUsers(
    query: string,
    limit: number = 10
  ): Promise<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      isFollowing: boolean;
      mutualFriends: number;
    }>
  > {
    const response = await apiClient.get<{
      users: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        isFollowing: boolean;
        mutualFriends: number;
      }>;
    }>(
      `/api/v1/social/users/search?q=${encodeURIComponent(
        query
      )}&limit=${limit}`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.users;
  }

  // Friend Requests
  async sendFriendRequest(
    targetUserId: string,
    message?: string
  ): Promise<FriendRequest> {
    const response = await apiClient.post<{ connection: FriendRequest }>(
      "/social/friends/request",
      {
        targetUserId,
        message,
      }
    );

    apiClient.clearCache();
    return response.data.connection;
  }

  async getFriendRequests(
    type: "sent" | "received" = "received"
  ): Promise<FriendRequest[]> {
    const response = await apiClient.get<{ requests: FriendRequest[] }>(
      `/social/friends/request?type=${type}`,
      {
        enableCache: true,
        cacheTTL: 60000, // 1 minute
      }
    );

    return response.data.requests;
  }

  async acceptFriendRequest(connectionId: string): Promise<FriendRequest> {
    const response = await apiClient.post<{ connection: FriendRequest }>(
      `/social/friends/request/${connectionId}/accept`
    );

    apiClient.clearCache();
    return response.data.connection;
  }

  async declineFriendRequest(connectionId: string): Promise<void> {
    await apiClient.post(`/social/friends/request/${connectionId}/decline`);
    apiClient.clearCache();
  }

  async cancelFriendRequest(requestId: string): Promise<void> {
    await apiClient.delete(`/api/v1/social/friends/${requestId}`);

    // Clear cache to refresh friend lists
    apiClient.clearCache();
  }

  // Friends Management
  async getFriends(): Promise<Friend[]> {
    const response = await apiClient.get<{ friends: Friend[] }>(
      "/social/friends",
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.friends;
  }

  async removeFriend(friendId: string): Promise<void> {
    await apiClient.delete(`/social/friends/${friendId}`);
    apiClient.clearCache();
  }

  async getFriendProfile(friendId: string): Promise<Friend> {
    const response = await apiClient.get<Friend>(`/social/users/${friendId}`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  // Social Feed
  async getFeed(params: {
    limit?: number;
    offset?: number;
    includeOwn?: boolean;
  }): Promise<{
    activities: SocialActivity[];
    meta: {
      count: number;
      hasMore: boolean;
    };
  }> {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());
    if (params.includeOwn !== undefined) {
      queryParams.append("includeOwn", params.includeOwn.toString());
    }

    const response = await apiClient.get<{
      activities: SocialActivity[];
      meta: {
        count: number;
        hasMore: boolean;
      };
    }>(`/social/feed?${queryParams.toString()}`, {
      enableCache: true,
      cacheTTL: 60000, // 1 minute
    });

    return response.data;
  }

  async getUserActivities(
    userId: string,
    params: {
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    activities: SocialActivity[];
    meta: {
      count: number;
      hasMore: boolean;
    };
  }> {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());

    const response = await apiClient.get<{
      activities: SocialActivity[];
      meta: {
        count: number;
        hasMore: boolean;
      };
    }>(`/social/users/${userId}/activities?${queryParams.toString()}`, {
      enableCache: true,
      cacheTTL: 60000, // 1 minute
    });

    return response.data;
  }

  // Reactions
  async addReaction(
    activityId: string,
    reactionType: "like" | "fire" | "strong" | "clap" | "heart"
  ): Promise<void> {
    await apiClient.post(`/api/v1/social/activities/${activityId}/reactions`, {
      type: reactionType,
    });
  }

  async removeReaction(activityId: string): Promise<void> {
    await apiClient.delete(`/api/v1/social/activities/${activityId}/reactions`);
  }

  // Comments
  async addComment(
    activityId: string,
    content: string
  ): Promise<{
    id: string;
    content: string;
    userId: string;
    userName: string;
    timestamp: string;
  }> {
    const response = await apiClient.post<{
      id: string;
      content: string;
      userId: string;
      userName: string;
      timestamp: string;
    }>(`/api/v1/social/activities/${activityId}/comments`, {
      content,
    });

    return response.data;
  }

  async getComments(activityId: string): Promise<
    Array<{
      id: string;
      content: string;
      userId: string;
      userName: string;
      timestamp: string;
    }>
  > {
    const response = await apiClient.get<{
      comments: Array<{
        id: string;
        content: string;
        userId: string;
        userName: string;
        timestamp: string;
      }>;
    }>(`/api/v1/social/activities/${activityId}/comments`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data.comments;
  }

  async deleteComment(activityId: string, commentId: string): Promise<void> {
    await apiClient.delete(
      `/api/v1/social/activities/${activityId}/comments/${commentId}`
    );
  }

  // Leaderboards
  async getLeaderboard(
    type: "workouts" | "volume" | "streak" = "workouts",
    period: "week" | "month" | "all" = "month"
  ): Promise<
    Array<{
      userId: string;
      userName: string;
      rank: number;
      value: number;
      unit: string;
      isCurrentUser: boolean;
    }>
  > {
    const response = await apiClient.get<{
      leaderboard: Array<{
        userId: string;
        userName: string;
        rank: number;
        value: number;
        unit: string;
        isCurrentUser: boolean;
      }>;
    }>(`/api/v1/social/leaderboard?type=${type}&period=${period}`, {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.leaderboard;
  }

  async getCurrentUserRank(
    type: "workouts" | "volume" | "streak" = "workouts"
  ): Promise<{
    rank: number;
    value: number;
    totalUsers: number;
    percentile: number;
  }> {
    const response = await apiClient.get<{
      rank: number;
      value: number;
      totalUsers: number;
      percentile: number;
    }>(`/api/v1/social/leaderboard/me?type=${type}`, {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data;
  }

  // Challenges
  async getChallenges(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      type: string;
      startDate: string;
      endDate: string;
      participants: number;
      isParticipating: boolean;
      progress?: number;
      target?: number;
    }>
  > {
    const response = await apiClient.get<{
      challenges: Array<{
        id: string;
        name: string;
        description: string;
        type: string;
        startDate: string;
        endDate: string;
        participants: number;
        isParticipating: boolean;
        progress?: number;
        target?: number;
      }>;
    }>("/api/v1/social/challenges", {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.challenges;
  }

  async joinChallenge(challengeId: string): Promise<void> {
    await apiClient.post(`/api/v1/social/challenges/${challengeId}/join`);

    // Clear cache to refresh challenges
    apiClient.clearCache();
  }

  async leaveChallenge(challengeId: string): Promise<void> {
    await apiClient.post(`/api/v1/social/challenges/${challengeId}/leave`);

    // Clear cache to refresh challenges
    apiClient.clearCache();
  }

  async getChallengeLeaderboard(challengeId: string): Promise<
    Array<{
      userId: string;
      userName: string;
      rank: number;
      progress: number;
      target: number;
      isCurrentUser: boolean;
    }>
  > {
    const response = await apiClient.get<{
      leaderboard: Array<{
        userId: string;
        userName: string;
        rank: number;
        progress: number;
        target: number;
        isCurrentUser: boolean;
      }>;
    }>(`/api/v1/social/challenges/${challengeId}/leaderboard`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data.leaderboard;
  }

  // Groups/Communities
  async getGroups(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      memberCount: number;
      isPrivate: boolean;
      isMember: boolean;
      recentActivity: number;
    }>
  > {
    const response = await apiClient.get<{
      groups: Array<{
        id: string;
        name: string;
        description: string;
        memberCount: number;
        isPrivate: boolean;
        isMember: boolean;
        recentActivity: number;
      }>;
    }>("/api/v1/social/groups", {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.groups;
  }

  async joinGroup(groupId: string): Promise<void> {
    await apiClient.post(`/api/v1/social/groups/${groupId}/join`);

    // Clear cache to refresh groups
    apiClient.clearCache();
  }

  async leaveGroup(groupId: string): Promise<void> {
    await apiClient.post(`/api/v1/social/groups/${groupId}/leave`);

    // Clear cache to refresh groups
    apiClient.clearCache();
  }

  async getGroupFeed(
    groupId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<SocialActivity>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/v1/social/groups/${groupId}/feed${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiClient.get<PaginatedResponse<SocialActivity>>(
      url,
      {
        enableCache: true,
        cacheTTL: 180000, // 3 minutes
      }
    );

    return response.data;
  }

  // Privacy Settings
  async updatePrivacySettings(settings: {
    profileVisibility?: "public" | "friends" | "private";
    workoutVisibility?: "public" | "friends" | "private";
    allowFriendRequests?: boolean;
    showOnLeaderboards?: boolean;
  }): Promise<void> {
    await apiClient.put("/social/privacy", settings);
    apiClient.clearCache();
  }

  async getPrivacySettings(): Promise<{
    profileVisibility: "public" | "friends" | "private";
    workoutVisibility: "public" | "friends" | "private";
    allowFriendRequests: boolean;
    showOnLeaderboards: boolean;
  }> {
    const response = await apiClient.get<{
      profileVisibility: "public" | "friends" | "private";
      workoutVisibility: "public" | "friends" | "private";
      allowFriendRequests: boolean;
      showOnLeaderboards: boolean;
    }>("/social/privacy", {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data;
  }
}

export const socialService = new SocialService();
