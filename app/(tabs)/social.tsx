import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Colors, spacing, typography, borderRadius } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function SocialScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "feed" | "friends" | "challenges"
  >("feed");

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const mockFeed = [
    {
      id: "1",
      user: { name: "Sarah Chen", avatar: null },
      type: "workout_complete",
      content: "Just crushed a 45-minute upper body workout! 💪",
      timestamp: "2 hours ago",
      likes: 12,
      comments: 3,
      workout: "Upper Body Strength",
    },
    {
      id: "2",
      user: { name: "Mike Johnson", avatar: null },
      type: "personal_record",
      content: "New PR on bench press - 85kg! 🎉",
      timestamp: "4 hours ago",
      likes: 18,
      comments: 7,
      exercise: "Bench Press",
      weight: "85kg",
    },
    {
      id: "3",
      user: { name: "Emma Rodriguez", avatar: null },
      type: "milestone",
      content:
        "Completed my 50th workout this year! Thanks for the motivation everyone!",
      timestamp: "1 day ago",
      likes: 25,
      comments: 11,
      milestone: "50 Workouts",
    },
  ];

  const mockFriends = [
    { id: "1", name: "Sarah Chen", status: "Online", streak: 5, workouts: 23 },
    {
      id: "2",
      name: "Mike Johnson",
      status: "Offline",
      streak: 12,
      workouts: 45,
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      status: "Working out",
      streak: 8,
      workouts: 31,
    },
    {
      id: "4",
      name: "Alex Thompson",
      status: "Online",
      streak: 3,
      workouts: 18,
    },
  ];

  const mockChallenges = [
    {
      id: "1",
      title: "30-Day Consistency Challenge",
      description: "Complete a workout every day for 30 days",
      participants: 156,
      daysLeft: 12,
      progress: 60,
      joined: true,
    },
    {
      id: "2",
      title: "January Cardio Challenge",
      description: "Complete 20 cardio sessions this month",
      participants: 89,
      daysLeft: 8,
      progress: 75,
      joined: true,
    },
    {
      id: "3",
      title: "Strength Building Challenge",
      description: "Increase your total lifting weight by 50kg",
      participants: 234,
      daysLeft: 20,
      progress: 0,
      joined: false,
    },
  ];

  const renderTabSelector = () => (
    <View
      style={[styles.tabSelector, { backgroundColor: colors.surfaceSecondary }]}
    >
      {(["feed", "friends", "challenges"] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            selectedTab === tab && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab(tab)}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  selectedTab === tab
                    ? colors.textInverse
                    : colors.textSecondary,
              },
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFeedItem = ({ item }: { item: (typeof mockFeed)[0] }) => (
    <Card variant="elevated" style={styles.feedCard}>
      <View style={styles.feedHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.textInverse }]}>
              {item.user.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {item.user.name}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {item.timestamp}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.feedContent, { color: colors.text }]}>
        {item.content}
      </Text>

      {item.type === "workout_complete" && (
        <View
          style={[styles.workoutTag, { backgroundColor: colors.primaryLight }]}
        >
          <Ionicons name="fitness" size={16} color={colors.textInverse} />
          <Text style={[styles.workoutTagText, { color: colors.textInverse }]}>
            {item.workout}
          </Text>
        </View>
      )}

      {item.type === "personal_record" && (
        <View style={[styles.prTag, { backgroundColor: colors.accent }]}>
          <Ionicons name="trophy" size={16} color={colors.textInverse} />
          <Text style={[styles.prTagText, { color: colors.textInverse }]}>
            {item.exercise}: {item.weight}
          </Text>
        </View>
      )}

      {item.type === "milestone" && (
        <View
          style={[styles.milestoneTag, { backgroundColor: colors.secondary }]}
        >
          <Ionicons name="star" size={16} color={colors.textInverse} />
          <Text
            style={[styles.milestoneTagText, { color: colors.textInverse }]}
          >
            {item.milestone}
          </Text>
        </View>
      )}

      <View style={styles.feedActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="heart-outline"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {item.comments}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="share-outline"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderFriendItem = ({ item }: { item: (typeof mockFriends)[0] }) => (
    <Card variant="outlined" style={styles.friendCard}>
      <TouchableOpacity style={styles.friendContent}>
        <View style={styles.friendInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.avatarText, { color: colors.textInverse }]}>
              {item.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.friendDetails}>
            <Text style={[styles.friendName, { color: colors.text }]}>
              {item.name}
            </Text>
            <View style={styles.friendStatus}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              />
              <Text
                style={[styles.statusText, { color: colors.textSecondary }]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.friendStats}>
          <View style={styles.friendStat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {item.streak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Streak
            </Text>
          </View>
          <View style={styles.friendStat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {item.workouts}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Workouts
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const renderChallengeItem = ({
    item,
  }: {
    item: (typeof mockChallenges)[0];
  }) => (
    <Card variant="elevated" style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeInfo}>
          <Text style={[styles.challengeTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text
            style={[
              styles.challengeDescription,
              { color: colors.textSecondary },
            ]}
          >
            {item.description}
          </Text>
        </View>
        <Text style={[styles.daysLeft, { color: colors.accent }]}>
          {item.daysLeft} days left
        </Text>
      </View>

      <View style={styles.challengeProgress}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
            Progress
          </Text>
          <Text style={[styles.progressValue, { color: colors.text }]}>
            {item.progress}%
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.secondary,
                width: `${item.progress}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.challengeFooter}>
        <Text style={[styles.participants, { color: colors.textSecondary }]}>
          {item.participants} participants
        </Text>
        <Button
          title={item.joined ? "Joined" : "Join Challenge"}
          variant={item.joined ? "outline" : "primary"}
          size="small"
          disabled={item.joined}
          onPress={() => {}}
        />
      </View>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return colors.success;
      case "Working out":
        return colors.accent;
      default:
        return colors.textTertiary;
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "feed":
        return (
          <FlatList
            data={mockFeed}
            renderItem={renderFeedItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        );
      case "friends":
        return (
          <FlatList
            data={mockFriends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.friendsHeader}>
                <Button
                  title="Find Friends"
                  icon={
                    <Ionicons
                      name="person-add"
                      size={20}
                      color={colors.textInverse}
                    />
                  }
                  onPress={() =>
                    Alert.alert(
                      "Coming Soon",
                      "Find friends feature is under development"
                    )
                  }
                  style={styles.findFriendsButton}
                />
              </View>
            }
          />
        );
      case "challenges":
        return (
          <FlatList
            data={mockChallenges}
            renderItem={renderChallengeItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.challengesHeader}>
                <Button
                  title="Create Challenge"
                  icon={
                    <Ionicons name="add" size={20} color={colors.textInverse} />
                  }
                  onPress={() =>
                    Alert.alert(
                      "Coming Soon",
                      "Create challenge feature is under development"
                    )
                  }
                  style={styles.createChallengeButton}
                />
              </View>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Social</ThemedText>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Notifications feature is under development"
            )
          }
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {renderTabSelector()}

      <View style={styles.contentArea}>{renderContent()}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  tabSelector: {
    flexDirection: "row",
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  tabText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  contentArea: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 100,
  },
  feedCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  timestamp: {
    fontSize: typography.fontSizes.sm,
  },
  feedContent: {
    fontSize: typography.fontSizes.md,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.md,
    marginBottom: spacing.md,
  },
  workoutTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  workoutTagText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  prTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  prTagText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  milestoneTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  milestoneTagText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  feedActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    paddingTop: spacing.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionText: {
    fontSize: typography.fontSizes.sm,
    marginLeft: spacing.xs,
  },
  friendCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  friendContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  friendStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: typography.fontSizes.sm,
  },
  friendStats: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  friendStat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSizes.xs,
  },
  challengeCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  challengeInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  challengeTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  challengeDescription: {
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
  },
  daysLeft: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  challengeProgress: {
    marginBottom: spacing.md,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: typography.fontSizes.sm,
  },
  progressValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  challengeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participants: {
    fontSize: typography.fontSizes.sm,
  },
  friendsHeader: {
    marginBottom: spacing.md,
  },
  findFriendsButton: {
    alignSelf: "center",
  },
  challengesHeader: {
    marginBottom: spacing.md,
  },
  createChallengeButton: {
    alignSelf: "center",
  },
});
