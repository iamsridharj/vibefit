import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Colors, spacing, typography, borderRadius } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useGetWorkoutSessionQuery,
  useUpdateWorkoutSessionMutation,
  useCompleteWorkoutSessionMutation,
} from "@/store/api";
import { WorkoutSession } from "@/types/api";

type WorkoutExercise = WorkoutSession["exercises"][0];
type ExerciseSet = NonNullable<WorkoutExercise["setDetails"]>[0];

export default function WorkoutSessionScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);

  const {
    data: session,
    isLoading,
    refetch,
  } = useGetWorkoutSessionQuery(id as string);

  const [updateSession] = useUpdateWorkoutSessionMutation();
  const [completeSession] = useCompleteWorkoutSessionMutation();

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartWorkout = async () => {
    try {
      await updateSession({
        id: id as string,
        status: "in_progress",
        startTime: new Date().toISOString(),
      }).unwrap();
      setTimerActive(true);
      refetch();
    } catch (error) {
      console.error("Failed to start workout:", error);
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      await completeSession({
        id: id as string,
        endTime: new Date().toISOString(),
        duration: timer,
      }).unwrap();
      setTimerActive(false);
      router.back();
    } catch (error) {
      console.error("Failed to complete workout:", error);
    }
  };

  const handleToggleExercise = async (exerciseId: string) => {
    if (!session?.data) return;

    const updatedExercises = session.data.exercises.map(
      (exercise: WorkoutExercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            completed: !exercise.completed,
          };
        }
        return exercise;
      }
    );

    try {
      await updateSession({
        id: id as string,
        exercises: updatedExercises,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update exercise:", error);
    }
  };

  const handleUpdateSet = async (
    exerciseId: string,
    setNumber: number,
    updates: Partial<{
      weight: number;
      reps: number;
      rpe: number;
      completed: boolean;
    }>
  ) => {
    if (!session?.data) return;

    const updatedExercises = session.data.exercises.map(
      (exercise: WorkoutExercise) => {
        if (exercise.id === exerciseId) {
          const updatedSetDetails = exercise.setDetails?.map(
            (set: ExerciseSet) => {
              if (set.setNumber === setNumber) {
                return {
                  ...set,
                  ...updates,
                  timestamp: new Date().toISOString(),
                };
              }
              return set;
            }
          );

          return {
            ...exercise,
            setDetails: updatedSetDetails,
          };
        }
        return exercise;
      }
    );

    try {
      await updateSession({
        id: id as string,
        exercises: updatedExercises,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update set:", error);
    }
  };

  if (isLoading || !session?.data) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading workout session...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const workoutSession = session.data;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText type="title">Workout Session</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card variant="elevated" style={styles.timerCard}>
          <View style={styles.timerContent}>
            <Text style={[styles.timerText, { color: colors.text }]}>
              {formatTime(timer)}
            </Text>
            {workoutSession.status === "not_started" ? (
              <Button
                variant="primary"
                title="Start Workout"
                onPress={handleStartWorkout}
              />
            ) : workoutSession.status === "in_progress" ? (
              <Button
                variant="primary"
                title="Complete Workout"
                onPress={handleCompleteWorkout}
              />
            ) : null}
          </View>
        </Card>

        {workoutSession.exercises.map((exercise) => (
          <Card
            key={exercise.id}
            variant="elevated"
            style={styles.exerciseCard}
          >
            <TouchableOpacity
              style={styles.exerciseHeader}
              onPress={() => handleToggleExercise(exercise.id)}
            >
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName, { color: colors.text }]}>
                  {exercise.name}
                </Text>
                <Text
                  style={[
                    styles.exerciseDetails,
                    { color: colors.textSecondary },
                  ]}
                >
                  {exercise.sets} sets • {exercise.reps} reps • {exercise.rest}{" "}
                  rest
                </Text>
              </View>
              <Ionicons
                name={
                  exercise.completed
                    ? "checkmark-circle-outline"
                    : "ellipse-outline"
                }
                size={24}
                color={
                  exercise.completed ? colors.success : colors.textSecondary
                }
              />
            </TouchableOpacity>

            {exercise.setDetails && (
              <View style={styles.setsList}>
                {exercise.setDetails.map((set) => (
                  <View key={set.setNumber} style={styles.setRow}>
                    <Text
                      style={[
                        styles.setNumber,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Set {set.setNumber}
                    </Text>
                    <View style={styles.setInputs}>
                      <TouchableOpacity
                        style={[
                          styles.setInput,
                          { backgroundColor: colors.surfaceSecondary },
                        ]}
                        onPress={() =>
                          Alert.prompt(
                            "Weight",
                            "Enter weight (kg)",
                            (weight) =>
                              handleUpdateSet(exercise.id, set.setNumber, {
                                weight: parseFloat(weight),
                              })
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.setInputText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {set.weight ? `${set.weight}kg` : "Weight"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.setInput,
                          { backgroundColor: colors.surfaceSecondary },
                        ]}
                        onPress={() =>
                          Alert.prompt("Reps", "Enter number of reps", (reps) =>
                            handleUpdateSet(exercise.id, set.setNumber, {
                              reps: parseInt(reps, 10),
                            })
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.setInputText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {set.reps || "Reps"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.setInput,
                          { backgroundColor: colors.surfaceSecondary },
                        ]}
                        onPress={() =>
                          Alert.prompt("RPE", "Enter RPE (1-10)", (rpe) =>
                            handleUpdateSet(exercise.id, set.setNumber, {
                              rpe: parseInt(rpe, 10),
                            })
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.setInputText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {set.rpe ? `RPE ${set.rpe}` : "RPE"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.setComplete,
                          {
                            backgroundColor: set.completed
                              ? colors.success
                              : colors.surfaceSecondary,
                          },
                        ]}
                        onPress={() =>
                          handleUpdateSet(exercise.id, set.setNumber, {
                            completed: !set.completed,
                          })
                        }
                      >
                        <Ionicons
                          name={set.completed ? "checkmark" : "close"}
                          size={20}
                          color={
                            set.completed
                              ? colors.textInverse
                              : colors.textSecondary
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {exercise.notes && (
              <Text style={[styles.exerciseNotes, { color: colors.text }]}>
                {exercise.notes}
              </Text>
            )}
          </Card>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  content: {
    flex: 1,
  },
  timerCard: {
    margin: spacing.md,
  },
  timerContent: {
    padding: spacing.md,
    alignItems: "center",
  },
  timerText: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    margin: spacing.md,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  exerciseDetails: {
    fontSize: typography.fontSizes.sm,
  },
  setsList: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  setNumber: {
    fontSize: typography.fontSizes.sm,
    width: 50,
  },
  setInputs: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
  },
  setInput: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: "center",
  },
  setInputText: {
    fontSize: typography.fontSizes.sm,
  },
  setComplete: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseNotes: {
    fontSize: typography.fontSizes.sm,
    padding: spacing.md,
    fontStyle: "italic",
  },
});
