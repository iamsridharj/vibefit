import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RootState, AppDispatch } from "@/store";
import { completeOnboarding as completeUserOnboarding } from "@/store/slices/userSlice";
import { setOnboardingCompleted as setAppOnboardingCompleted } from "@/store/slices/appSlice";
import { setOnboardingComplete as setUIOnboardingComplete } from "@/store/slices/uiSlice";
import {
  completeOnboarding as completeOnboardingFlow,
  setGeneratedPlan,
} from "@/store/slices/onboardingSlice";
import { OnboardingPlanRequest } from "@/types/api";

const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

const FITNESS_GOALS = [
  "weight_loss",
  "muscle_gain",
  "strength_training",
  "general_fitness",
  "endurance",
  "flexibility",
] as const;
type FitnessGoal = (typeof FITNESS_GOALS)[number];

const EQUIPMENT_OPTIONS = [
  "bodyweight",
  "dumbbells",
  "barbell",
  "machines",
  "cables",
  "kettlebells",
];

const INTENSITY_LEVELS = ["low", "moderate", "high", "variable"];

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function FitnessProfileScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");

  const [formData, setFormData] = useState({
    experienceLevel: "beginner" as ExperienceLevel,
    fitnessGoals: [] as FitnessGoal[],
    timePerSession: 60,
    daysPerWeek: 3,
    programDuration: 12,
    equipmentPreference: [] as string[],
    intensityPreference: "moderate" as "low" | "moderate" | "high" | "variable",
    exercisePreferences: [] as string[],
    selectedDays: [] as string[],
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleGoalToggle = (goal: FitnessGoal) => {
    setFormData((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter((g) => g !== goal)
        : [...prev.fitnessGoals, goal],
    }));
  };

  const handleEquipmentToggle = (equipment: string) => {
    setFormData((prev) => ({
      ...prev,
      equipmentPreference: prev.equipmentPreference.includes(equipment)
        ? prev.equipmentPreference.filter((e) => e !== equipment)
        : [...prev.equipmentPreference, equipment],
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      const newSelectedDays = prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day];

      return {
        ...prev,
        selectedDays: newSelectedDays,
        daysPerWeek: newSelectedDays.length,
      };
    });
  };

  const handleIntensityChange = (
    level: "low" | "moderate" | "high" | "variable"
  ) => {
    setFormData((prev) => ({
      ...prev,
      intensityPreference: level,
    }));
  };

  const handleSubmit = async () => {
    if (formData.fitnessGoals.length === 0) {
      setError("Please select at least one fitness goal");
      return;
    }

    if (formData.equipmentPreference.length === 0) {
      setError("Please select at least one equipment option");
      return;
    }

    if (!formData.intensityPreference) {
      setError("Please select your preferred workout intensity");
      return;
    }

    if (formData.selectedDays.length === 0) {
      setError("Please select at least one workout day");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { workoutService } = await import("@/services/api/workoutService");

      // Generate workout plan using actual form data
      const planRequest: OnboardingPlanRequest = {
        userGoals: formData.fitnessGoals,
        constraints: {
          timePerSession: formData.timePerSession,
          daysPerWeek: formData.daysPerWeek,
          durationWeeks: formData.programDuration,
        },
        preferences: {
          intensityPreference: formData.intensityPreference,
          equipmentPreference: formData.equipmentPreference,
          exercisePreferences: formData.exercisePreferences,
        },
      };

      const response = await workoutService.generateOnboardingPlan(planRequest);

      // Store the generated plan in Redux
      dispatch(setGeneratedPlan(response.plan));

      // Navigate to plan preview screen
      router.push("/onboarding/plan-preview");
    } catch (err: any) {
      setError(
        err.message || "Failed to generate workout plan. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, { color: textColor }]}>
          Create Your Fitness Profile
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            What are your fitness goals?
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Select all that apply
          </Text>
          <View style={styles.optionsGrid}>
            {FITNESS_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.option,
                  {
                    backgroundColor: formData.fitnessGoals.includes(goal)
                      ? primaryColor
                      : "transparent",
                    borderColor: primaryColor,
                  },
                ]}
                onPress={() => handleGoalToggle(goal)}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: formData.fitnessGoals.includes(goal)
                        ? "white"
                        : textColor,
                    },
                  ]}
                >
                  {goal.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            What's your fitness experience level?
          </Text>
          <View style={styles.optionsGrid}>
            {EXPERIENCE_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      formData.experienceLevel === level
                        ? primaryColor
                        : "transparent",
                    borderColor: primaryColor,
                  },
                ]}
                onPress={() =>
                  setFormData({ ...formData, experienceLevel: level })
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        formData.experienceLevel === level
                          ? "white"
                          : textColor,
                    },
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            What equipment do you have access to?
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Select all available options
          </Text>
          <View style={styles.optionsGrid}>
            {EQUIPMENT_OPTIONS.map((equipment) => (
              <TouchableOpacity
                key={equipment}
                style={[
                  styles.option,
                  {
                    backgroundColor: formData.equipmentPreference.includes(
                      equipment
                    )
                      ? primaryColor
                      : "transparent",
                    borderColor: primaryColor,
                  },
                ]}
                onPress={() => handleEquipmentToggle(equipment)}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: formData.equipmentPreference.includes(equipment)
                        ? "white"
                        : textColor,
                    },
                  ]}
                >
                  {equipment}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Preferred Workout Intensity
          </Text>
          <View style={styles.optionsGrid}>
            {INTENSITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      formData.intensityPreference === level
                        ? primaryColor
                        : "transparent",
                    borderColor: primaryColor,
                  },
                ]}
                onPress={() =>
                  handleIntensityChange(
                    level as "low" | "moderate" | "high" | "variable"
                  )
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        formData.intensityPreference === level
                          ? "white"
                          : textColor,
                    },
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Time Preferences
          </Text>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>
              Minutes per workout session
            </Text>
            <Input
              value={formData.timePerSession.toString()}
              onChangeText={(value) =>
                setFormData({
                  ...formData,
                  timePerSession: parseInt(value) || 60,
                })
              }
              keyboardType="numeric"
              placeholder="e.g., 60"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>
              Program duration (weeks)
            </Text>
            <Input
              value={formData.programDuration.toString()}
              onChangeText={(value) =>
                setFormData({
                  ...formData,
                  programDuration: parseInt(value) || 12,
                })
              }
              keyboardType="numeric"
              placeholder="e.g., 12"
            />
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Preferred workout days
          </Text>
          <View style={styles.optionsGrid}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.option,
                  {
                    backgroundColor: formData.selectedDays.includes(day)
                      ? primaryColor
                      : "transparent",
                    borderColor: primaryColor,
                  },
                ]}
                onPress={() => handleDayToggle(day)}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: formData.selectedDays.includes(day)
                        ? "white"
                        : textColor,
                    },
                  ]}
                >
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title="Create My Plan"
          onPress={handleSubmit}
          style={styles.button}
          loading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minWidth: "30%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  error: {
    color: "red",
    marginBottom: 16,
  },
  button: {
    marginVertical: 20,
  },
});
