import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { workoutService } from "../../services/api/workoutService";
import { completeOnboarding } from "../../store/slices/userSlice";
import { completeOnboarding as completeOnboardingFlow } from "../../store/slices/onboardingSlice";
import { RootState, useAppDispatch } from "../../store";
import { WorkoutPlan } from "../../types/api";

interface Week {
  week: number;
  days: Array<{
    day: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest: string;
    }>;
  }>;
}

interface GeneratedPlan {
  plan: {
    name: string;
    description: string;
    duration: string;
    difficulty: string;
  };
  weeks: Array<{
    week: number;
    days: Array<{
      day: string;
      exercises: Array<{
        name: string;
        sets: number;
        reps: string;
        rest: string;
      }>;
    }>;
  }>;
  progressionPlan?: string;
  alternatives?: {
    [exerciseName: string]: string;
  };
}

export default function PlanPreviewScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const generatedPlan = useSelector(
    (state: RootState) => state.persisted.onboarding.generatedPlan
  ) as GeneratedPlan;
  const formData = useSelector(
    (state: RootState) => state.persisted.onboarding.formData
  );

  const handleSavePlan = async () => {
    try {
      // Save the generated plan
      const savedPlanResponse = await workoutService.saveOnboardingPlan({
        generatedPlan: {
          plan: {
            name: generatedPlan.plan.name,
            description: generatedPlan.plan.description,
            duration: generatedPlan.plan.duration,
            difficulty: generatedPlan.plan.difficulty,
          },
          weeks: generatedPlan.weeks,
          progressionPlan: generatedPlan.progressionPlan || "",
          alternatives: generatedPlan.alternatives || {},
        },
      });

      // Complete onboarding in user slice
      await dispatch(
        completeOnboarding({
          experienceLevel: formData.experienceLevel,
          fitnessGoals: formData.fitnessGoals,
          plan: savedPlanResponse.plan,
        })
      );

      // Complete onboarding in onboarding slice
      dispatch(completeOnboardingFlow());

      // Navigate to completion screen
      router.replace("/onboarding/complete");
    } catch (error) {
      console.error("Error saving plan:", error);
      // TODO: Show error toast
    }
  };

  const handleRegeneratePlan = () => {
    router.back(); // Go back to fitness profile to regenerate
  };

  if (!generatedPlan) {
    router.replace("/onboarding/fitness-profile");
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText style={styles.title}>{generatedPlan.plan.name}</ThemedText>
        <ThemedText style={styles.description}>
          {generatedPlan.plan.description}
        </ThemedText>

        <Card style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>Plan Details</ThemedText>
          <ThemedText>Duration: {generatedPlan.plan.duration}</ThemedText>
          <ThemedText>Difficulty: {generatedPlan.plan.difficulty}</ThemedText>
        </Card>

        {generatedPlan.weeks.map((week: Week, weekIndex: number) => (
          <Card key={weekIndex} style={styles.weekCard}>
            <ThemedText style={styles.weekTitle}>Week {week.week}</ThemedText>
            {week.days.map((day, dayIndex: number) => (
              <View key={dayIndex} style={styles.dayContainer}>
                <ThemedText style={styles.dayTitle}>{day.day}</ThemedText>
                {day.exercises.map((exercise, exerciseIndex: number) => (
                  <View key={exerciseIndex} style={styles.exerciseContainer}>
                    <ThemedText style={styles.exerciseName}>
                      {exercise.name}
                    </ThemedText>
                    <ThemedText>
                      {exercise.sets} sets × {exercise.reps}
                    </ThemedText>
                    <ThemedText>Rest: {exercise.rest}</ThemedText>
                  </View>
                ))}
              </View>
            ))}
          </Card>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Regenerate Plan"
          variant="secondary"
          onPress={handleRegeneratePlan}
          style={styles.button}
        />
        <Button
          title="Save Plan"
          onPress={handleSavePlan}
          style={styles.button}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  infoCard: {
    marginBottom: 24,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  weekCard: {
    marginBottom: 16,
    padding: 16,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  exerciseContainer: {
    marginLeft: 16,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
