import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Colors, spacing, typography, borderRadius } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useGetActivePlanQuery,
  useGetTodaysWorkoutQuery,
  useGetWeeklyStatsQuery,
  useGetSocialFeedQuery,
} from "@/store/api";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // API queries
  const {
    data: activePlan,
    isLoading: planLoading,
    refetch: refetchPlan,
  } = useGetActivePlanQuery();

  const {
    data: todaysWorkout,
    isLoading: workoutLoading,
    refetch: refetchWorkout,
  } = useGetTodaysWorkoutQuery();

  const {
    data: weeklyStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetWeeklyStatsQuery();

  const {
    data: socialFeed,
    isLoading: feedLoading,
    refetch: refetchFeed,
  } = useGetSocialFeedQuery({ limit: 3 });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchPlan(),
      refetchWorkout(),
      refetchStats(),
      refetchFeed(),
    ]);
    setRefreshing(false);
  }, [refetchPlan, refetchWorkout, refetchStats, refetchFeed]);

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  const renderTodaysWorkout = () => {
    const workout = todaysWorkout?.data;
    const plan = activePlan?.data?.activePlan;

    if (workoutLoading || planLoading) {
      return (
        <Card variant="elevated" style={styles.workoutCard}>
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading today's workout...
            </Text>
          </View>
        </Card>
      );
    }

    // No active plan at all
    if (!plan) {
      return (
        <Card variant="elevated" style={styles.workoutCard}>
          <View style={styles.noWorkoutContainer}>
            <Ionicons
              name="fitness-outline"
              size={48}
              color={colors.textSecondary}
            />
            <ThemedText type="subtitle" style={styles.noWorkoutTitle}>
              No active workout plan
            </ThemedText>
            <ThemedText style={styles.noWorkoutDescription}>
              Let's create a personalized workout plan for you!
            </ThemedText>
            <Button
              title="Generate Workout Plan"
              onPress={() => router.push("/workouts")}
              style={styles.generateButton}
            />
          </View>
        </Card>
      );
    }

    // Has active plan but no workout scheduled for today
    if (!workout || !workout.exercises) {
      const today = new Date()
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      return (
        <Card variant="elevated" style={styles.workoutCard}>
          <View style={styles.noWorkoutContainer}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color={colors.textSecondary}
            />
            <ThemedText type="subtitle" style={styles.noWorkoutTitle}>
              Rest Day
            </ThemedText>
            <ThemedText style={styles.noWorkoutDescription}>
              No workout scheduled for today. Your next workout is on{" "}
              {plan.nextSession?.scheduledFor
                ? new Date(plan.nextSession.scheduledFor).toLocaleDateString(
                    "en-US",
                    { weekday: "long" }
                  )
                : "your next scheduled day"}
              .
            </ThemedText>
            <Button
              title="View Full Schedule"
              onPress={() => router.push("/workouts")}
              style={styles.generateButton}
            />
          </View>
        </Card>
      );
    }

    // Has workout for today
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push(`/workout/${workout.id}`)}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.workoutCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.workoutHeader}>
            <View>
              <Text
                style={[styles.workoutTitle, { color: colors.textInverse }]}
              >
                Today's Workout
              </Text>
              <Text style={[styles.workoutName, { color: colors.textInverse }]}>
                {workout.type === "plan" ? plan.name : "Custom Workout"}
              </Text>
            </View>
            <View style={styles.workoutStatus}>
              <Text style={[styles.statusText, { color: colors.textInverse }]}>
                {workout.status === "completed" ? "Completed" : "Ready"}
              </Text>
            </View>
          </View>

          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.textInverse}
              />
              <Text style={[styles.statText, { color: colors.textInverse }]}>
                {workout.exercises.length * 5} min
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="barbell-outline"
                size={16}
                color={colors.textInverse}
              />
              <Text style={[styles.statText, { color: colors.textInverse }]}>
                {workout.exercises.length} exercises
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="trending-up-outline"
                size={16}
                color={colors.textInverse}
              />
              <Text style={[styles.statText, { color: colors.textInverse }]}>
                {plan.schedule?.[0]?.days?.[0]?.focus || "Full Body"}
              </Text>
            </View>
          </View>

          <View style={styles.workoutAction}>
            <Text style={[styles.actionText, { color: colors.textInverse }]}>
              {workout.status === "completed"
                ? "View Details"
                : "Start Workout"}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={colors.textInverse}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderProgressStats = () => {
    const stats = weeklyStats?.data?.weeklyStats;

    if (!stats) return null;

    const totalVolume = Object.values(stats.volumeByMuscleGroup).reduce(
      (acc: number, val: number) => acc + val,
      0
    );

    return (
      <View style={styles.statsGrid}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="flame" size={24} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.totalSessions || 0}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            This Week
          </Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="time" size={24} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {Math.round(stats.totalDuration / 60) || 0}h
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Time Spent
          </Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="trophy" size={24} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {totalVolume}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total Volume
          </Text>
        </Card>
      </View>
    );
  };

  const renderSocialFeed = () => {
    const activities = socialFeed?.data?.activities;

    if (!activities?.length) return null;

    return (
      <View style={styles.socialSection}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Friend Activity</ThemedText>
          <TouchableOpacity onPress={() => router.push("/social")}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {activities.slice(0, 2).map((activity) => (
          <Card
            key={activity.id}
            variant="outlined"
            style={styles.activityCard}
          >
            <View style={styles.activityHeader}>
              <View style={styles.activityUser}>
                <Ionicons
                  name="person-circle"
                  size={32}
                  color={colors.textSecondary}
                />
                <View style={styles.activityMeta}>
                  <ThemedText type="defaultSemiBold">
                    {activity.userId}
                  </ThemedText>
                  <Text
                    style={[
                      styles.activityTime,
                      { color: colors.textTertiary },
                    ]}
                  >
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.activityContent, { color: colors.text }]}>
              {activity.content.description}
            </Text>
          </Card>
        ))}
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Quick Actions</ThemedText>
      </View>

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/workouts")}
        >
          <Ionicons name="play-circle" size={32} color={colors.primary} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>
            Start Workout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/progress")}
        >
          <Ionicons name="scale" size={32} color={colors.secondary} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>
            Log Progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/social")}
        >
          <Ionicons name="people" size={32} color={colors.info} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>
            Find Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/explore")}
        >
          <Ionicons name="compass" size={32} color={colors.accent} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>
            Explore
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.greeting}>
              {getGreeting()}! 👋
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Ready to crush your fitness goals?
            </ThemedText>
          </View>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Ionicons name="person-circle" size={32} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Today's Workout */}
        {renderTodaysWorkout()}

        {/* Progress Stats */}
        {renderProgressStats()}

        {/* Social Feed */}
        {renderSocialFeed()}

        {/* Quick Actions */}
        {renderQuickActions()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  greeting: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    opacity: 0.7,
  },
  workoutCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  loadingContainer: {
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: typography.fontSizes.md,
  },
  noWorkoutContainer: {
    alignItems: "center",
    padding: spacing.xl,
  },
  noWorkoutTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  noWorkoutDescription: {
    textAlign: "center",
    marginBottom: spacing.lg,
    opacity: 0.8,
  },
  generateButton: {
    minWidth: 200,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  workoutTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    opacity: 0.9,
  },
  workoutName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    marginTop: spacing.xs,
  },
  workoutStatus: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  workoutStats: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.lg,
  },
  statText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSizes.sm,
  },
  workoutAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  actionText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    padding: spacing.md,
  },
  statHeader: {
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    textAlign: "center",
  },
  socialSection: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  activityCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  activityUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityMeta: {
    marginLeft: spacing.sm,
  },
  activityTime: {
    fontSize: typography.fontSizes.xs,
  },
  activityContent: {
    fontSize: typography.fontSizes.sm,
  },
  quickActions: {
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: -spacing.xs,
  },
  actionButton: {
    width: (width - spacing.md * 2 - spacing.xs * 6) / 2,
    margin: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  actionLabel: {
    marginTop: spacing.sm,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
});
