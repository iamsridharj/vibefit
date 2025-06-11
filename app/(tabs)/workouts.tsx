import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  FlatList,
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
import { useGetWorkoutPlansQuery, useGetExercisesQuery } from "@/store/api";

export default function WorkoutsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"plans" | "exercises">(
    "plans"
  );

  // API queries
  const {
    data: workoutPlans,
    isLoading: plansLoading,
    refetch: refetchPlans,
  } = useGetWorkoutPlansQuery();

  const {
    data: exercises,
    isLoading: exercisesLoading,
    refetch: refetchExercises,
  } = useGetExercisesQuery({});

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchPlans(), refetchExercises()]);
    setRefreshing(false);
  }, [refetchPlans, refetchExercises]);

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Card variant="elevated" style={styles.quickActionCard}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Quick start workout feature is under development"
            )
          }
        >
          <View
            style={[
              styles.quickActionIcon,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="play" size={24} color={colors.textInverse} />
          </View>
          <View style={styles.quickActionContent}>
            <Text style={[styles.quickActionTitle, { color: colors.text }]}>
              Quick Start
            </Text>
            <Text
              style={[
                styles.quickActionSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Start a workout now
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </Card>

      <Card variant="elevated" style={styles.quickActionCard}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Generate workout plan feature is under development"
            )
          }
        >
          <View
            style={[
              styles.quickActionIcon,
              { backgroundColor: colors.secondary },
            ]}
          >
            <Ionicons name="sparkles" size={24} color={colors.textInverse} />
          </View>
          <View style={styles.quickActionContent}>
            <Text style={[styles.quickActionTitle, { color: colors.text }]}>
              AI Generate Plan
            </Text>
            <Text
              style={[
                styles.quickActionSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Create personalized plan
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </Card>
    </View>
  );

  const renderTabSelector = () => (
    <View
      style={[styles.tabSelector, { backgroundColor: colors.surfaceSecondary }]}
    >
      <TouchableOpacity
        style={[
          styles.tab,
          selectedTab === "plans" && { backgroundColor: colors.primary },
        ]}
        onPress={() => setSelectedTab("plans")}
      >
        <Text
          style={[
            styles.tabText,
            {
              color:
                selectedTab === "plans"
                  ? colors.textInverse
                  : colors.textSecondary,
            },
          ]}
        >
          My Plans
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          selectedTab === "exercises" && { backgroundColor: colors.primary },
        ]}
        onPress={() => setSelectedTab("exercises")}
      >
        <Text
          style={[
            styles.tabText,
            {
              color:
                selectedTab === "exercises"
                  ? colors.textInverse
                  : colors.textSecondary,
            },
          ]}
        >
          Exercises
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderWorkoutPlan = ({ item }: { item: any }) => (
    <Card variant="elevated" style={styles.planCard}>
      <TouchableOpacity
        style={styles.planContent}
        onPress={() =>
          Alert.alert(
            "Coming Soon",
            "Workout plan details feature is under development"
          )
        }
      >
        <View style={styles.planHeader}>
          <View style={styles.planInfo}>
            <Text style={[styles.planName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.planDescription, { color: colors.textSecondary }]}
            >
              {item.description}
            </Text>
          </View>
          {item.aiGenerated && (
            <View style={[styles.aiTag, { backgroundColor: colors.accent }]}>
              <Ionicons name="sparkles" size={12} color={colors.textInverse} />
              <Text style={[styles.aiTagText, { color: colors.textInverse }]}>
                AI
              </Text>
            </View>
          )}
        </View>

        <View style={styles.planStats}>
          <View style={styles.planStat}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.planStatText, { color: colors.textSecondary }]}
            >
              {item.durationWeeks} weeks
            </Text>
          </View>
          <View style={styles.planStat}>
            <Ionicons
              name="barbell-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.planStatText, { color: colors.textSecondary }]}
            >
              Level {item.difficultyLevel}
            </Text>
          </View>
          <View style={styles.planStat}>
            <Ionicons
              name="trophy-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.planStatText, { color: colors.textSecondary }]}
            >
              {item.goal}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const renderExercise = ({ item }: { item: any }) => (
    <Card variant="outlined" style={styles.exerciseCard}>
      <TouchableOpacity
        style={styles.exerciseContent}
        onPress={() =>
          Alert.alert(
            "Coming Soon",
            "Exercise details feature is under development"
          )
        }
      >
        <View style={styles.exerciseHeader}>
          <View
            style={[
              styles.categoryIcon,
              { backgroundColor: getCategoryColor(item.category) },
            ]}
          >
            <Ionicons
              name={getCategoryIcon(item.category)}
              size={20}
              color={colors.textInverse}
            />
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={[styles.exerciseName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.exerciseCategory, { color: colors.textSecondary }]}
            >
              {item.category} • {item.muscleGroups.join(", ")}
            </Text>
          </View>
          <View style={styles.difficultyIndicator}>
            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.difficultyDot,
                  {
                    backgroundColor:
                      index < item.difficultyLevel
                        ? colors.warning
                        : colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.exerciseEquipment}>
          {item.equipmentRequired.length > 0 ? (
            item.equipmentRequired
              .slice(0, 3)
              .map((equipment: string, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.equipmentTag,
                    { backgroundColor: colors.surfaceSecondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.equipmentText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {equipment}
                  </Text>
                </View>
              ))
          ) : (
            <View
              style={[
                styles.equipmentTag,
                { backgroundColor: colors.successLight },
              ]}
            >
              <Text style={[styles.equipmentText, { color: colors.success }]}>
                Bodyweight
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "strength":
        return colors.strength;
      case "cardio":
        return colors.cardio;
      case "flexibility":
        return colors.flexibility;
      case "core":
        return colors.core;
      default:
        return colors.primary;
    }
  };

  const getCategoryIcon = (
    category: string
  ): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case "strength":
        return "barbell-outline";
      case "cardio":
        return "heart-outline";
      case "flexibility":
        return "body-outline";
      case "core":
        return "fitness-outline";
      default:
        return "fitness-outline";
    }
  };

  const renderContent = () => {
    if (selectedTab === "plans") {
      const plans = workoutPlans?.data || [];

      if (plansLoading) {
        return (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading workout plans...
            </Text>
          </View>
        );
      }

      if (plans.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="fitness-outline"
              size={64}
              color={colors.textSecondary}
            />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No workout plans yet
            </ThemedText>
            <ThemedText style={styles.emptyDescription}>
              Create your first workout plan to get started with your fitness
              journey!
            </ThemedText>
            <Button
              title="Create Plan"
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Create workout plan feature is under development"
                )
              }
              style={styles.createButton}
            />
          </View>
        );
      }

      return (
        <FlatList
          data={plans}
          renderItem={renderWorkoutPlan}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      );
    } else {
      const exerciseList = exercises?.data || [];

      if (exercisesLoading) {
        return (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading exercises...
            </Text>
          </View>
        );
      }

      return (
        <FlatList
          data={exerciseList}
          renderItem={renderExercise}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      );
    }
  };

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
          <ThemedText type="title">Workouts</ThemedText>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Workout history feature is under development"
              )
            }
          >
            <Ionicons name="time-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Tab Selector */}
        {renderTabSelector()}
      </ScrollView>

      {/* Content */}
      <View style={styles.contentArea}>{renderContent()}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 0,
  },
  contentContainer: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  quickActionsContainer: {
    marginBottom: spacing.lg,
  },
  quickActionCard: {
    marginBottom: spacing.sm,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  quickActionSubtitle: {
    fontSize: typography.fontSizes.sm,
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: typography.fontSizes.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    textAlign: "center",
    marginBottom: spacing.xl,
    opacity: 0.8,
  },
  createButton: {
    minWidth: 200,
  },
  listContainer: {
    paddingBottom: 100,
  },
  planCard: {
    marginBottom: spacing.md,
  },
  planContent: {
    padding: spacing.md,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  planInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  planName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  planDescription: {
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
  },
  aiTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  aiTagText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  planStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planStat: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  planStatText: {
    fontSize: typography.fontSizes.sm,
    marginLeft: spacing.xs,
  },
  exerciseCard: {
    marginBottom: spacing.sm,
  },
  exerciseContent: {
    padding: spacing.md,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  exerciseCategory: {
    fontSize: typography.fontSizes.sm,
  },
  difficultyIndicator: {
    flexDirection: "row",
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: spacing.xs,
  },
  exerciseEquipment: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  equipmentTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  equipmentText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
});
