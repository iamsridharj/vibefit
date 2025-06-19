import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Colors, spacing, typography, borderRadius } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PlanGeneratorModal } from "@/components/modals/PlanGeneratorModal";
import {
  useGetWorkoutPlansQuery,
  useGetActivePlanQuery,
  useGenerateWorkoutPlanMutation,
  useCreateWorkoutSessionMutation,
} from "@/store/api";
import type { WorkoutPlan, ApiResponse } from "@/types/api";

export default function WorkoutsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [refreshing, setRefreshing] = useState(false);
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);

  const {
    data: plans,
    isLoading: plansLoading,
    refetch: refetchPlans,
  } = useGetWorkoutPlansQuery() as {
    data:
      | ApiResponse<{
          plans: WorkoutPlan[];
          pagination: {
            limit: number;
            offset: number;
            pages: number;
            total: number;
          };
        }>
      | undefined;
    isLoading: boolean;
    refetch: () => Promise<any>;
  };

  const {
    data: activePlan,
    isLoading: activePlanLoading,
    refetch: refetchActivePlan,
  } = useGetActivePlanQuery() as {
    data: ApiResponse<{ activePlan: WorkoutPlan }> | undefined;
    isLoading: boolean;
    refetch: () => Promise<any>;
  };

  const [generatePlan] = useGenerateWorkoutPlanMutation();
  const [createSession] = useCreateWorkoutSessionMutation();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchPlans(), refetchActivePlan()]);
    setRefreshing(false);
  }, [refetchPlans, refetchActivePlan]);

  const handleGeneratePlan = async (goals: string[], constraints: any) => {
    try {
      await generatePlan({
        userGoals: goals,
        constraints,
        preferences: {
          intensityPreference: "moderate",
          equipmentPreference: ["bodyweight", "dumbbell", "barbell"],
        },
      }).unwrap();
      refetchPlans();
      refetchActivePlan();
    } catch (error) {
      console.error("Failed to generate plan:", error);
    }
  };

  const handleStartSession = async (
    planId: string,
    weekNumber: number,
    dayNumber: number
  ) => {
    try {
      const session = await createSession({
        planId,
        weekNumber,
        dayNumber,
        type: "plan",
      }).unwrap();
      router.push(`/workout/${session.data.id}`);
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  const renderActivePlan = () => {
    if (!activePlan?.data?.activePlan) return null;

    const plan: WorkoutPlan = activePlan.data.activePlan;
    const nextSession = plan.nextSession;
    const progress = {
      adherenceRate: 0,
      completedSessions: 0,
      totalSessions: 0,
      currentWeek: 0,
      currentDay: 0,
    };

    return (
      <Card variant="elevated" style={styles.planCard}>
        <View style={styles.cardHeader}>
          <ThemedText type="subtitle">Active Plan</ThemedText>
          <TouchableOpacity onPress={() => router.push(`/plan/${plan.id}`)}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.planInfo}>
          <Text style={[styles.planName, { color: colors.text }]}>
            {plan.name || "Core Focus Weight Loss"}
          </Text>
          <Text
            style={[styles.planDescription, { color: colors.textSecondary }]}
          >
            {plan.description ||
              "A bodyweight core-focused workout plan for intermediate users aiming for weight loss."}
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${progress.adherenceRate * 100}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={[styles.progressValue, { color: colors.text }]}>
                {progress.completedSessions}
              </Text>
              <Text
                style={[styles.progressLabel, { color: colors.textSecondary }]}
              >
                Completed
              </Text>
            </View>

            <View style={styles.progressStat}>
              <Text style={[styles.progressValue, { color: colors.text }]}>
                {progress.totalSessions}
              </Text>
              <Text
                style={[styles.progressLabel, { color: colors.textSecondary }]}
              >
                Total
              </Text>
            </View>

            <View style={styles.progressStat}>
              <Text style={[styles.progressValue, { color: colors.text }]}>
                {(progress.adherenceRate * 100).toFixed(0)}%
              </Text>
              <Text
                style={[styles.progressLabel, { color: colors.textSecondary }]}
              >
                Adherence
              </Text>
            </View>
          </View>

          {nextSession ? (
            <View style={styles.nextSession}>
              <Text style={[styles.nextSessionTitle, { color: colors.text }]}>
                Next Session
              </Text>
              <Text
                style={[
                  styles.nextSessionFocus,
                  { color: colors.textSecondary },
                ]}
              >
                {nextSession.focus}
              </Text>
              <Button
                variant="primary"
                title="Start Workout"
                onPress={() =>
                  handleStartSession(
                    plan.id,
                    nextSession.weekNumber,
                    nextSession.dayNumber
                  )
                }
              />
            </View>
          ) : (
            <View style={styles.nextSession}>
              <Text style={[styles.nextSessionTitle, { color: colors.text }]}>
                No Session Scheduled
              </Text>
              <Text
                style={[
                  styles.nextSessionFocus,
                  { color: colors.textSecondary },
                ]}
              >
                Your next workout session will be scheduled soon.
              </Text>
            </View>
          )}
        </View>
      </Card>
    );
  };

  const renderPlans = () => {
    if (!plans?.data?.plans) return null;

    return (
      <View style={styles.plansSection}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Your Plans</ThemedText>
          <TouchableOpacity onPress={() => setShowPlanGenerator(true)}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              New Plan
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.plansRow}>
            {plans.data.plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => router.push(`/plan/${plan.id}`)}
              >
                <Card variant="elevated" style={styles.planPreview}>
                  <View style={styles.planPreviewContent}>
                    <Text style={[styles.planName, { color: colors.text }]}>
                      {plan.name}
                    </Text>
                    <Text
                      style={[
                        styles.planDescription,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {plan.description}
                    </Text>
                    <View style={styles.planStats}>
                      <View style={styles.planStat}>
                        <Ionicons
                          name="calendar"
                          size={16}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.planStatText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {plan.durationWeeks || "8"} weeks
                        </Text>
                      </View>
                      <View style={styles.planStat}>
                        <Ionicons
                          name="time"
                          size={16}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.planStatText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {plan.planData?.plan?.timePerSession || "45"} min
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
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
        {renderActivePlan()}
        {renderPlans()}
      </ScrollView>

      {showPlanGenerator && (
        <PlanGeneratorModal
          onClose={() => setShowPlanGenerator(false)}
          onGenerate={handleGeneratePlan}
        />
      )}
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
  planCard: {
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
  planInfo: {
    padding: spacing.md,
  },
  planName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  planDescription: {
    fontSize: typography.fontSizes.sm,
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  progressFill: {
    height: "100%",
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.md,
  },
  progressStat: {
    alignItems: "center",
  },
  progressValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.fontSizes.sm,
  },
  nextSession: {
    padding: spacing.md,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: borderRadius.md,
  },
  nextSessionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  nextSessionFocus: {
    fontSize: typography.fontSizes.sm,
    marginBottom: spacing.md,
  },
  plansSection: {
    margin: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  plansRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  planPreview: {
    width: 240,
  },
  planPreviewContent: {
    padding: spacing.md,
  },
  planStats: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  planStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  planStatText: {
    fontSize: typography.fontSizes.sm,
  },
});
