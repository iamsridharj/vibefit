import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  Dimensions,
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

const { width } = Dimensions.get("window");

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "week" | "month" | "year"
  >("month");

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Simulate API calls
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const renderStatsOverview = () => (
    <View style={styles.statsGrid}>
      <Card variant="elevated" style={styles.statCard}>
        <View style={styles.statContent}>
          <Ionicons name="flame" size={24} color={colors.accent} />
          <Text style={[styles.statValue, { color: colors.text }]}>7</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Day Streak
          </Text>
        </View>
      </Card>

      <Card variant="elevated" style={styles.statCard}>
        <View style={styles.statContent}>
          <Ionicons name="trending-up" size={24} color={colors.secondary} />
          <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Workouts
          </Text>
        </View>
      </Card>

      <Card variant="elevated" style={styles.statCard}>
        <View style={styles.statContent}>
          <Ionicons name="time" size={24} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.text }]}>8.5</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Avg Hours
          </Text>
        </View>
      </Card>

      <Card variant="elevated" style={styles.statCard}>
        <View style={styles.statContent}>
          <Ionicons name="flash" size={24} color={colors.warning} />
          <Text style={[styles.statValue, { color: colors.text }]}>2.1k</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Calories
          </Text>
        </View>
      </Card>
    </View>
  );

  const renderTimeframeSelector = () => (
    <View
      style={[
        styles.timeframeSelector,
        { backgroundColor: colors.surfaceSecondary },
      ]}
    >
      {(["week", "month", "year"] as const).map((timeframe) => (
        <TouchableOpacity
          key={timeframe}
          style={[
            styles.timeframeButton,
            selectedTimeframe === timeframe && {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() => setSelectedTimeframe(timeframe)}
        >
          <Text
            style={[
              styles.timeframeText,
              {
                color:
                  selectedTimeframe === timeframe
                    ? colors.textInverse
                    : colors.textSecondary,
              },
            ]}
          >
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBodyMetrics = () => (
    <Card variant="elevated" style={styles.metricsCard}>
      <View style={styles.cardHeader}>
        <ThemedText type="subtitle">Body Metrics</ThemedText>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Coming Soon", "Metrics feature is under development")
          }
        >
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Weight
            </Text>
            <View
              style={[
                styles.trendIndicator,
                { backgroundColor: colors.successLight },
              ]}
            >
              <Ionicons name="arrow-down" size={12} color={colors.success} />
              <Text style={[styles.trendText, { color: colors.success }]}>
                -2.3kg
              </Text>
            </View>
          </View>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            72.5 kg
          </Text>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Body Fat
            </Text>
            <View
              style={[
                styles.trendIndicator,
                { backgroundColor: colors.successLight },
              ]}
            >
              <Ionicons name="arrow-down" size={12} color={colors.success} />
              <Text style={[styles.trendText, { color: colors.success }]}>
                -1.2%
              </Text>
            </View>
          </View>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            15.2%
          </Text>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Muscle Mass
            </Text>
            <View
              style={[
                styles.trendIndicator,
                { backgroundColor: colors.successLight },
              ]}
            >
              <Ionicons name="arrow-up" size={12} color={colors.success} />
              <Text style={[styles.trendText, { color: colors.success }]}>
                +0.8kg
              </Text>
            </View>
          </View>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            45.3 kg
          </Text>
        </View>
      </View>

      <Button
        title="Log New Measurement"
        variant="outline"
        onPress={() =>
          Alert.alert("Coming Soon", "Log metrics feature is under development")
        }
        style={styles.logButton}
      />
    </Card>
  );

  const renderWorkoutProgress = () => (
    <Card variant="elevated" style={styles.progressCard}>
      <View style={styles.cardHeader}>
        <ThemedText type="subtitle">Workout Progress</ThemedText>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Workout history feature is under development"
            )
          }
        >
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            Details
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressItems}>
        <View style={styles.progressItem}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>
              Bench Press
            </Text>
            <Text
              style={[styles.progressSubLabel, { color: colors.textSecondary }]}
            >
              Personal Record
            </Text>
          </View>
          <View style={styles.progressValue}>
            <Text style={[styles.progressNumber, { color: colors.text }]}>
              85 kg
            </Text>
            <View
              style={[
                styles.progressTrend,
                { backgroundColor: colors.successLight },
              ]}
            >
              <Ionicons name="arrow-up" size={10} color={colors.success} />
              <Text
                style={[styles.progressTrendText, { color: colors.success }]}
              >
                +5kg
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>
              Squat
            </Text>
            <Text
              style={[styles.progressSubLabel, { color: colors.textSecondary }]}
            >
              Personal Record
            </Text>
          </View>
          <View style={styles.progressValue}>
            <Text style={[styles.progressNumber, { color: colors.text }]}>
              120 kg
            </Text>
            <View
              style={[
                styles.progressTrend,
                { backgroundColor: colors.successLight },
              ]}
            >
              <Ionicons name="arrow-up" size={10} color={colors.success} />
              <Text
                style={[styles.progressTrendText, { color: colors.success }]}
              >
                +10kg
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>
              5K Run Time
            </Text>
            <Text
              style={[styles.progressSubLabel, { color: colors.textSecondary }]}
            >
              Best Time
            </Text>
          </View>
          <View style={styles.progressValue}>
            <Text style={[styles.progressNumber, { color: colors.text }]}>
              24:15
            </Text>
            <View
              style={[
                styles.progressTrend,
                { backgroundColor: colors.successLight },
              ]}
            >
              <Ionicons name="arrow-down" size={10} color={colors.success} />
              <Text
                style={[styles.progressTrendText, { color: colors.success }]}
              >
                -1:30
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderAIInsights = () => (
    <Card variant="elevated" style={styles.insightsCard}>
      <View style={styles.cardHeader}>
        <ThemedText type="subtitle">AI Insights</ThemedText>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Coming Soon", "Insights feature is under development")
          }
        >
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.insightsList}>
        <View style={styles.insightItem}>
          <View
            style={[
              styles.insightIcon,
              { backgroundColor: colors.successLight },
            ]}
          >
            <Ionicons name="trophy" size={16} color={colors.success} />
          </View>
          <View style={styles.insightContent}>
            <Text style={[styles.insightTitle, { color: colors.text }]}>
              Great Progress!
            </Text>
            <Text
              style={[
                styles.insightDescription,
                { color: colors.textSecondary },
              ]}
            >
              Your strength has increased by 15% this month. Keep up the
              consistent training!
            </Text>
          </View>
        </View>

        <View style={styles.insightItem}>
          <View
            style={[
              styles.insightIcon,
              { backgroundColor: colors.warningLight },
            ]}
          >
            <Ionicons name="bulb" size={16} color={colors.warning} />
          </View>
          <View style={styles.insightContent}>
            <Text style={[styles.insightTitle, { color: colors.text }]}>
              Recovery Tip
            </Text>
            <Text
              style={[
                styles.insightDescription,
                { color: colors.textSecondary },
              ]}
            >
              Consider adding more rest days between intense workouts for better
              recovery.
            </Text>
          </View>
        </View>

        <View style={styles.insightItem}>
          <View
            style={[styles.insightIcon, { backgroundColor: colors.infoLight }]}
          >
            <Ionicons name="fitness" size={16} color={colors.info} />
          </View>
          <View style={styles.insightContent}>
            <Text style={[styles.insightTitle, { color: colors.text }]}>
              Cardio Focus
            </Text>
            <Text
              style={[
                styles.insightDescription,
                { color: colors.textSecondary },
              ]}
            >
              Adding 2 cardio sessions per week could help improve your
              endurance.
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.surface }]}
        onPress={() =>
          Alert.alert(
            "Coming Soon",
            "Progress photos feature is under development"
          )
        }
      >
        <Ionicons name="camera" size={24} color={colors.primary} />
        <Text style={[styles.actionLabel, { color: colors.text }]}>
          Progress Photos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.surface }]}
        onPress={() =>
          Alert.alert("Coming Soon", "Export data feature is under development")
        }
      >
        <Ionicons name="share" size={24} color={colors.secondary} />
        <Text style={[styles.actionLabel, { color: colors.text }]}>
          Export Data
        </Text>
      </TouchableOpacity>
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
          <ThemedText type="title">Progress</ThemedText>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Coming Soon", "Charts feature is under development")
            }
          >
            <Ionicons name="bar-chart" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        {renderStatsOverview()}

        {/* Timeframe Selector */}
        {renderTimeframeSelector()}

        {/* Body Metrics */}
        {renderBodyMetrics()}

        {/* Workout Progress */}
        {renderWorkoutProgress()}

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
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  statCard: {
    width: (width - spacing.md * 2 - spacing.sm) / 2,
    marginBottom: spacing.sm,
  },
  statContent: {
    alignItems: "center",
    padding: spacing.md,
  },
  statValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    marginVertical: spacing.sm,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    textAlign: "center",
  },
  timeframeSelector: {
    flexDirection: "row",
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  timeframeText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  metricsCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  metricsGrid: {
    marginBottom: spacing.md,
  },
  metricItem: {
    marginBottom: spacing.md,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: typography.fontSizes.sm,
  },
  trendIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  trendText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  metricValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
  logButton: {
    marginTop: spacing.sm,
  },
  progressCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  progressItems: {
    gap: spacing.md,
  },
  progressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  progressSubLabel: {
    fontSize: typography.fontSizes.sm,
  },
  progressValue: {
    alignItems: "flex-end",
  },
  progressNumber: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  progressTrend: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  progressTrendText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  insightsCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  insightsList: {
    gap: spacing.md,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  insightDescription: {
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
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
