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
  useGetTodaysWorkoutQuery,
  useGetProgressStatsQuery,
  useGetInsightsQuery,
} from "@/store/api";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // API queries
  const {
    data: todaysWorkout,
    isLoading: workoutLoading,
    refetch: refetchWorkout,
  } = useGetTodaysWorkoutQuery();

  const {
    data: progressStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetProgressStatsQuery({ timeframe: "week" });

  const {
    data: insights,
    isLoading: insightsLoading,
    refetch: refetchInsights,
  } = useGetInsightsQuery({ timeframe: "week" });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchWorkout(), refetchStats(), refetchInsights()]);
    setRefreshing(false);
  }, [refetchWorkout, refetchStats, refetchInsights]);

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  const renderTodaysWorkout = () => {
    const workout = todaysWorkout?.data;

    if (workoutLoading) {
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

    if (!workout) {
      return (
        <Card variant="elevated" style={styles.workoutCard}>
          <View style={styles.noWorkoutContainer}>
            <Ionicons
              name="fitness-outline"
              size={48}
              color={colors.textSecondary}
            />
            <ThemedText type="subtitle" style={styles.noWorkoutTitle}>
              No workout scheduled
            </ThemedText>
            <ThemedText style={styles.noWorkoutDescription}>
              Let's create a personalized workout plan for you!
            </ThemedText>
            <Button
              title="Generate Workout Plan"
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Workout plan creation feature is under development"
                )
              }
              style={styles.generateButton}
            />
          </View>
        </Card>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          Alert.alert(
            "Coming Soon",
            "Workout session feature is under development"
          )
        }
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
                {workout.workoutPlan?.name || "Custom Workout"}
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
                45 min
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="flash-outline"
                size={16}
                color={colors.textInverse}
              />
              <Text style={[styles.statText, { color: colors.textInverse }]}>
                8 exercises
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="trending-up-outline"
                size={16}
                color={colors.textInverse}
              />
              <Text style={[styles.statText, { color: colors.textInverse }]}>
                Upper Body
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
    const stats = progressStats?.data;

    return (
      <View style={styles.statsGrid}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="flame" size={24} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats?.weeklyStreak || 0}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Day Streak
          </Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="fitness" size={24} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats?.weeklyWorkouts || 0}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            This Week
          </Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="trophy" size={24} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats?.totalWorkouts || 0}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total Workouts
          </Text>
        </Card>
      </View>
    );
  };

  const renderAIInsights = () => {
    const latestInsights = insights?.data?.slice(0, 2) || [];

    if (latestInsights.length === 0) {
      return null;
    }

    return (
      <View style={styles.insightsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">AI Insights</ThemedText>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Progress insights feature is under development"
              )
            }
          >
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {latestInsights.map((insight) => (
          <Card key={insight.id} variant="outlined" style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View
                style={[
                  styles.priorityIndicator,
                  {
                    backgroundColor:
                      insight.priority === 1 ? colors.success : colors.warning,
                  },
                ]}
              />
              <Text style={[styles.insightTitle, { color: colors.text }]}>
                {insight.title}
              </Text>
            </View>
            <Text
              style={[
                styles.insightDescription,
                { color: colors.textSecondary },
              ]}
            >
              {insight.description}
            </Text>
            <Text
              style={[styles.confidenceText, { color: colors.textTertiary }]}
            >
              Confidence: {Math.round(insight.confidence * 100)}%
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
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Quick start workout feature is under development"
            )
          }
        >
          <Ionicons name="play-circle" size={32} color={colors.primary} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>
            Quick Workout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Log metrics feature is under development"
            )
          }
        >
          <Ionicons name="scale" size={32} color={colors.secondary} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>
            Log Weight
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() =>
            Alert.alert("Coming Soon", "AI coach feature is under development")
          }
        >
          <Ionicons name="chatbubbles" size={32} color={colors.accent} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>
            AI Coach
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Social friends feature is under development"
            )
          }
        >
          <Ionicons name="people" size={32} color={colors.info} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>
            Find Friends
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

        {/* Today's Workout */}
        {renderTodaysWorkout()}

        {/* Progress Stats */}
        {renderProgressStats()}

        {/* AI Insights */}
        {renderAIInsights()}

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
    paddingBottom: 100, // Extra space for tab bar
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
    fontSize: typography.fontSizes.sm,
    marginLeft: spacing.xs,
  },
  workoutAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
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
    alignItems: "center",
  },
  statHeader: {
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    textAlign: "center",
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
  insightsSection: {
    marginBottom: spacing.lg,
  },
  insightCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  insightTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    flex: 1,
  },
  insightDescription: {
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
    marginBottom: spacing.xs,
  },
  confidenceText: {
    fontSize: typography.fontSizes.xs,
  },
  quickActions: {
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: (width - spacing.md * 2 - spacing.sm) / 2,
    aspectRatio: 1.2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginTop: spacing.sm,
    textAlign: "center",
  },
});
