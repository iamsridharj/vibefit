import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function FitnessProfileScreen() {
  const [experienceLevel, setExperienceLevel] = useState<
    "beginner" | "intermediate" | "advanced" | ""
  >("");
  const [primaryGoal, setPrimaryGoal] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");

  const experienceOptions = [
    { value: "beginner", label: "Beginner", description: "New to fitness" },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "Some experience",
    },
    { value: "advanced", label: "Advanced", description: "Very experienced" },
  ];

  const goalOptions = [
    { value: "weight_loss", label: "Weight Loss", icon: "trending-down" },
    { value: "muscle_building", label: "Muscle Building", icon: "fitness" },
    { value: "strength_building", label: "Strength", icon: "barbell" },
    { value: "endurance", label: "Endurance", icon: "heart" },
    {
      value: "general_fitness",
      label: "General Fitness",
      icon: "checkmark-circle",
    },
  ];

  const activityOptions = [
    {
      value: "sedentary",
      label: "Sedentary",
      description: "Little to no exercise",
    },
    {
      value: "lightly_active",
      label: "Lightly Active",
      description: "Light exercise 1-3 days/week",
    },
    {
      value: "moderately_active",
      label: "Moderately Active",
      description: "Moderate exercise 3-5 days/week",
    },
    {
      value: "active",
      label: "Active",
      description: "Hard exercise 6-7 days/week",
    },
    {
      value: "very_active",
      label: "Very Active",
      description: "Very hard exercise, physical job",
    },
  ];

  const validateForm = () => {
    if (!experienceLevel) {
      Alert.alert("Validation Error", "Please select your experience level");
      return false;
    }
    if (!primaryGoal) {
      Alert.alert("Validation Error", "Please select your primary goal");
      return false;
    }
    if (!activityLevel) {
      Alert.alert("Validation Error", "Please select your activity level");
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      router.push("/onboarding/preferences");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Fitness Profile
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: primaryColor, width: "66%" },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: textSecondaryColor }]}>
          Step 2 of 3
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor }]}>
            Your fitness profile
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            Help us understand your fitness background and goals
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Experience Level
            </Text>
            <View style={styles.optionsGrid}>
              {experienceOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.experienceOption,
                    {
                      backgroundColor:
                        experienceLevel === option.value
                          ? primaryColor
                          : surfaceColor,
                      borderColor:
                        experienceLevel === option.value
                          ? primaryColor
                          : borderColor,
                    },
                  ]}
                  onPress={() => setExperienceLevel(option.value as any)}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color:
                          experienceLevel === option.value
                            ? "white"
                            : textColor,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      {
                        color:
                          experienceLevel === option.value
                            ? "rgba(255,255,255,0.8)"
                            : textSecondaryColor,
                      },
                    ]}
                  >
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Primary Goal
            </Text>
            <View style={styles.goalGrid}>
              {goalOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.goalOption,
                    {
                      backgroundColor:
                        primaryGoal === option.value
                          ? primaryColor
                          : surfaceColor,
                      borderColor:
                        primaryGoal === option.value
                          ? primaryColor
                          : borderColor,
                    },
                  ]}
                  onPress={() => setPrimaryGoal(option.value)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={
                      primaryGoal === option.value ? "white" : primaryColor
                    }
                  />
                  <Text
                    style={[
                      styles.goalLabel,
                      {
                        color:
                          primaryGoal === option.value ? "white" : textColor,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Activity Level
            </Text>
            <View style={styles.activityOptions}>
              {activityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.activityOption,
                    {
                      backgroundColor:
                        activityLevel === option.value
                          ? primaryColor
                          : surfaceColor,
                      borderColor:
                        activityLevel === option.value
                          ? primaryColor
                          : borderColor,
                    },
                  ]}
                  onPress={() => setActivityLevel(option.value)}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color:
                          activityLevel === option.value ? "white" : textColor,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      {
                        color:
                          activityLevel === option.value
                            ? "rgba(255,255,255,0.8)"
                            : textSecondaryColor,
                      },
                    ]}
                  >
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  optionsGrid: {
    gap: 12,
  },
  experienceOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  goalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  goalOption: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  activityOptions: {
    gap: 8,
  },
  activityOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
});
