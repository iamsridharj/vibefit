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
import {
  useGetProgressAnalyticsQuery,
  useGetBodyMetricsQuery,
  useGetProgressComparisonQuery,
} from "@/store/api";

const { width } = Dimensions.get("window");

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "week" | "month" | "year"
  >("month");

  const {
    data: analytics,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useGetProgressAnalyticsQuery({ timeframe: 90 });

  const {
    data: metrics,
    isLoading: metricsLoading,
    refetch: refetchMetrics,
  } = useGetBodyMetricsQuery({
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const {
    data: comparison,
    isLoading: comparisonLoading,
    refetch: refetchComparison,
  } = useGetProgressComparisonQuery({
    period1: 30,
    period2: 60,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchAnalytics(),
      refetchMetrics(),
      refetchComparison(),
    ]);
    setRefreshing(false);
  }, [refetchAnalytics, refetchMetrics, refetchComparison]);

  const renderStatsOverview = () => {
    if (!analytics?.data.analytics) return null;

    const { analytics: stats } = analytics.data;
    return (
      <View style={styles.statsGrid}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="trending-up" size={24} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.weight.current.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Weight (kg)
            </Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="body" size={24} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.bodyComposition.fatPercentage.current.toFixed(1)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Body Fat
            </Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="fitness" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.bodyComposition.muscleMass.current.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Muscle (kg)
            </Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="analytics" size={24} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.measurements.waist.current.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Waist (cm)
            </Text>
          </View>
        </Card>
      </View>
    );
  };

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

  const renderBodyMetrics = () => {
    if (!analytics?.data.analytics) return null;

    const { analytics: stats } = analytics.data;
    return (
      <Card variant="elevated" style={styles.metricsCard}>
        <View style={styles.cardHeader}>
          <ThemedText type="subtitle">Body Metrics</ThemedText>
          <TouchableOpacity onPress={() => router.push("/metrics")}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text
                style={[styles.metricLabel, { color: colors.textSecondary }]}
              >
                Weight
              </Text>
              <View
                style={[
                  styles.trendIndicator,
                  {
                    backgroundColor:
                      stats.weight.change < 0
                        ? colors.successLight
                        : colors.warningLight,
                  },
                ]}
              >
                <Ionicons
                  name={stats.weight.change < 0 ? "arrow-down" : "arrow-up"}
                  size={12}
                  color={
                    stats.weight.change < 0 ? colors.success : colors.warning
                  }
                />
                <Text
                  style={[
                    styles.trendText,
                    {
                      color:
                        stats.weight.change < 0
                          ? colors.success
                          : colors.warning,
                    },
                  ]}
                >
                  {Math.abs(stats.weight.change).toFixed(1)}kg
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stats.weight.current.toFixed(1)} kg
            </Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text
                style={[styles.metricLabel, { color: colors.textSecondary }]}
              >
                Body Fat
              </Text>
              <View
                style={[
                  styles.trendIndicator,
                  {
                    backgroundColor:
                      stats.bodyComposition.fatPercentage.change < 0
                        ? colors.successLight
                        : colors.warningLight,
                  },
                ]}
              >
                <Ionicons
                  name={
                    stats.bodyComposition.fatPercentage.change < 0
                      ? "arrow-down"
                      : "arrow-up"
                  }
                  size={12}
                  color={
                    stats.bodyComposition.fatPercentage.change < 0
                      ? colors.success
                      : colors.warning
                  }
                />
                <Text
                  style={[
                    styles.trendText,
                    {
                      color:
                        stats.bodyComposition.fatPercentage.change < 0
                          ? colors.success
                          : colors.warning,
                    },
                  ]}
                >
                  {Math.abs(stats.bodyComposition.fatPercentage.change).toFixed(
                    1
                  )}
                  %
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stats.bodyComposition.fatPercentage.current.toFixed(1)}%
            </Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text
                style={[styles.metricLabel, { color: colors.textSecondary }]}
              >
                Muscle Mass
              </Text>
              <View
                style={[
                  styles.trendIndicator,
                  {
                    backgroundColor:
                      stats.bodyComposition.muscleMass.change > 0
                        ? colors.successLight
                        : colors.warningLight,
                  },
                ]}
              >
                <Ionicons
                  name={
                    stats.bodyComposition.muscleMass.change > 0
                      ? "arrow-up"
                      : "arrow-down"
                  }
                  size={12}
                  color={
                    stats.bodyComposition.muscleMass.change > 0
                      ? colors.success
                      : colors.warning
                  }
                />
                <Text
                  style={[
                    styles.trendText,
                    {
                      color:
                        stats.bodyComposition.muscleMass.change > 0
                          ? colors.success
                          : colors.warning,
                    },
                  ]}
                >
                  {Math.abs(stats.bodyComposition.muscleMass.change).toFixed(1)}
                  kg
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stats.bodyComposition.muscleMass.current.toFixed(1)} kg
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderTrendChart = () => {
    if (!analytics?.data.analytics?.trends.weightTrend) return null;

    return (
      <Card variant="elevated" style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <ThemedText type="subtitle">Weight Trend</ThemedText>
          <TouchableOpacity onPress={() => router.push("/trends")}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add your chart component here */}
      </Card>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderStatsOverview()}
        {renderTimeframeSelector()}
        {renderBodyMetrics()}
        {renderTrendChart()}
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: (width - spacing.md * 2 - spacing.sm) / 2,
  },
  statContent: {
    padding: spacing.md,
    alignItems: "center",
  },
  statValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    color: Colors.light.textSecondary,
  },
  timeframeSelector: {
    flexDirection: "row",
    margin: spacing.md,
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  timeframeText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  metricsCard: {
    margin: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  metricsGrid: {
    padding: spacing.md,
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
    color: Colors.light.textSecondary,
  },
  trendIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  trendText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  metricValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
  chartCard: {
    margin: spacing.md,
  },
});
