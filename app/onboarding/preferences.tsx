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
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PreferencesScreen() {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [workoutDays, setWorkoutDays] = useState<string[]>([]);
  const [sessionDuration, setSessionDuration] = useState<number>(30);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");

  const equipmentOptions = [
    { value: "none", label: "No Equipment", icon: "home" },
    { value: "dumbbells", label: "Dumbbells", icon: "fitness" },
    {
      value: "resistance_bands",
      label: "Resistance Bands",
      icon: "git-branch",
    },
    { value: "pull_up_bar", label: "Pull-up Bar", icon: "remove" },
    { value: "gym_access", label: "Full Gym", icon: "business" },
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const durationOptions = [15, 30, 45, 60, 90];

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  };

  const toggleWorkoutDay = (day: string) => {
    setWorkoutDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleContinue = () => {
    router.push("/onboarding/complete");
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
          Preferences
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: primaryColor, width: "100%" },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: textSecondaryColor }]}>
          Step 3 of 3
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor }]}>
            Set your preferences
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            Let us know your equipment and schedule preferences
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Available Equipment
            </Text>
            <View style={styles.equipmentGrid}>
              {equipmentOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.equipmentOption,
                    {
                      backgroundColor: selectedEquipment.includes(option.value)
                        ? primaryColor
                        : surfaceColor,
                      borderColor: selectedEquipment.includes(option.value)
                        ? primaryColor
                        : borderColor,
                    },
                  ]}
                  onPress={() => toggleEquipment(option.value)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={
                      selectedEquipment.includes(option.value)
                        ? "white"
                        : primaryColor
                    }
                  />
                  <Text
                    style={[
                      styles.equipmentLabel,
                      {
                        color: selectedEquipment.includes(option.value)
                          ? "white"
                          : textColor,
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
              Preferred Workout Days
            </Text>
            <View style={styles.daysGrid}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayOption,
                    {
                      backgroundColor: workoutDays.includes(day)
                        ? primaryColor
                        : surfaceColor,
                      borderColor: workoutDays.includes(day)
                        ? primaryColor
                        : borderColor,
                    },
                  ]}
                  onPress={() => toggleWorkoutDay(day)}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      {
                        color: workoutDays.includes(day) ? "white" : textColor,
                      },
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Session Duration
            </Text>
            <View style={styles.durationGrid}>
              {durationOptions.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationOption,
                    {
                      backgroundColor:
                        sessionDuration === duration
                          ? primaryColor
                          : surfaceColor,
                      borderColor:
                        sessionDuration === duration
                          ? primaryColor
                          : borderColor,
                    },
                  ]}
                  onPress={() => setSessionDuration(duration)}
                >
                  <Text
                    style={[
                      styles.durationLabel,
                      {
                        color:
                          sessionDuration === duration ? "white" : textColor,
                      },
                    ]}
                  >
                    {duration} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Complete Setup" onPress={handleContinue} />
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
  equipmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  equipmentOption: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  equipmentLabel: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    gap: 8,
  },
  dayOption: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  durationOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
});
