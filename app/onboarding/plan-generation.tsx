import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { workoutService } from "@/services/api/workoutService";
import { GenerateWorkoutPlanRequest } from "@/types/api";
import { RootState } from "@/store";

const STEPS = [
  {
    title: "Analyzing Profile",
    description: "Understanding your fitness level and goals",
    icon: "analytics",
  },
  {
    title: "Creating Workouts",
    description: "Designing effective exercise combinations",
    icon: "fitness",
  },
  {
    title: "Optimizing Schedule",
    description: "Planning your workout calendar",
    icon: "calendar",
  },
];

export default function PlanGenerationScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get onboarding data from Redux
  const formData = useSelector(
    (state: RootState) => state.persisted.onboarding.formData
  );

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Simulate steps with delays
      for (let i = 0; i < STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const planRequest: GenerateWorkoutPlanRequest = {
        userGoals: formData.fitnessGoals,
        constraints: {
          timePerSession: formData.timePerSession,
          daysPerWeek: formData.daysPerWeek,
          durationWeeks: formData.programDuration,
        },
        preferences: {
          intensityPreference: formData.intensityPreference as
            | "low"
            | "moderate"
            | "high"
            | "variable",
          equipmentPreference: formData.equipmentPreference,
          exercisePreferences: formData.exercisePreferences,
        },
      };

      const response = await workoutService.generateWorkoutPlan(planRequest);

      // Plan generated successfully
      router.push("/onboarding/complete");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate workout plan"
      );
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            Creating Your Plan
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            Our AI is designing your personalized workout plan
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => {
            const isActive = currentStep === index;
            const isComplete = currentStep > index;

            return (
              <View key={index} style={styles.step}>
                <LinearGradient
                  colors={
                    isComplete
                      ? ["#4CAF50", "#45B649"]
                      : isActive
                      ? ["#2196F3", "#1E88E5"]
                      : ["#9E9E9E", "#757575"]
                  }
                  style={styles.stepIcon}
                >
                  <Ionicons
                    name={isComplete ? "checkmark" : (step.icon as any)}
                    size={24}
                    color="white"
                  />
                </LinearGradient>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: textColor }]}>
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.stepDescription,
                      { color: textSecondaryColor },
                    ]}
                  >
                    {step.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: "red" }]}>{error}</Text>
            <Button
              title="Try Again"
              onPress={generatePlan}
              style={styles.retryButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  stepsContainer: {
    gap: 24,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
  },
  errorContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  errorText: {
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    minWidth: 120,
  },
});
