import React, { useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors, spacing, typography, borderRadius } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ThemedText";

interface PlanGeneratorModalProps {
  onClose: () => void;
  onGenerate: (goals: string[], constraints: any) => void;
}

const GOALS = [
  "weight_loss",
  "muscle_gain",
  "strength_training",
  "general_fitness",
  "endurance",
  "flexibility",
];

const TIME_OPTIONS = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
  { label: "90 min", value: 90 },
];

const DAYS_OPTIONS = [
  { label: "2 days", value: 2 },
  { label: "3 days", value: 3 },
  { label: "4 days", value: 4 },
  { label: "5 days", value: 5 },
  { label: "6 days", value: 6 },
];

const DURATION_OPTIONS = [
  { label: "4 weeks", value: 4 },
  { label: "8 weeks", value: 8 },
  { label: "12 weeks", value: 12 },
];

export function PlanGeneratorModal({
  onClose,
  onGenerate,
}: PlanGeneratorModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [timePerSession, setTimePerSession] = useState(45);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [durationWeeks, setDurationWeeks] = useState(8);

  const handleGenerate = () => {
    if (selectedGoals.length === 0) {
      return;
    }

    onGenerate(selectedGoals, {
      timePerSession,
      daysPerWeek,
      durationWeeks,
    });
    onClose();
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View
        style={[styles.modalContainer, { backgroundColor: colors.overlay }]}
      >
        <Card variant="elevated" style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <ThemedText type="title">Generate Workout Plan</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                What are your goals?
              </ThemedText>
              <View style={styles.goalsGrid}>
                {GOALS.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.goalChip,
                      {
                        backgroundColor: selectedGoals.includes(goal)
                          ? colors.primary
                          : colors.surfaceSecondary,
                      },
                    ]}
                    onPress={() => toggleGoal(goal)}
                  >
                    <Text
                      style={[
                        styles.goalText,
                        {
                          color: selectedGoals.includes(goal)
                            ? colors.textInverse
                            : colors.textSecondary,
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
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Time per session
              </ThemedText>
              <View style={styles.optionsRow}>
                {TIME_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor:
                          timePerSession === option.value
                            ? colors.primary
                            : colors.surfaceSecondary,
                      },
                    ]}
                    onPress={() => setTimePerSession(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            timePerSession === option.value
                              ? colors.textInverse
                              : colors.textSecondary,
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
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Days per week
              </ThemedText>
              <View style={styles.optionsRow}>
                {DAYS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor:
                          daysPerWeek === option.value
                            ? colors.primary
                            : colors.surfaceSecondary,
                      },
                    ]}
                    onPress={() => setDaysPerWeek(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            daysPerWeek === option.value
                              ? colors.textInverse
                              : colors.textSecondary,
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
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Program duration
              </ThemedText>
              <View style={styles.optionsRow}>
                {DURATION_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor:
                          durationWeeks === option.value
                            ? colors.primary
                            : colors.surfaceSecondary,
                      },
                    ]}
                    onPress={() => setDurationWeeks(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            durationWeeks === option.value
                              ? colors.textInverse
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              variant="primary"
              size="large"
              title="Generate Plan"
              onPress={handleGenerate}
              disabled={selectedGoals.length === 0}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.md,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  modalBody: {
    paddingHorizontal: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  goalChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  goalText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    textTransform: "capitalize",
  },
  optionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  optionChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  optionText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  modalFooter: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
});
