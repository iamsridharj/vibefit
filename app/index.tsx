import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { RootState } from "@/store";
import { useThemeColor } from "@/hooks/useThemeColor";
import { workoutService } from "@/services/api/workoutService";

export default function IndexScreen() {
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) =>
      state.persisted.auth || {
        isAuthenticated: false,
        user: null,
        loading: true,
      }
  );
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primary");

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!loading) {
        // Step 1: Check Authentication
        if (!isAuthenticated) {
          router.replace("/(auth)/login" as any);
          return;
        }

        try {
          // Step 2: Check Active Plan
          const activePlan = await workoutService.getActivePlan();

          if (activePlan?.activePlan) {
            // User has an active plan, go to home
            router.replace("/(tabs)" as any);
          } else {
            // No active plan, go to onboarding
            router.replace("/onboarding" as any);
          }
        } catch (error) {
          console.error("Error checking active plan:", error);
          // If there's an error fetching the active plan, default to onboarding
          router.replace("/onboarding" as any);
        }
      }
    };

    checkUserStatus();
  }, [isAuthenticated, loading]);

  // Show loading screen while determining navigation
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
      }}
    >
      <ActivityIndicator size="large" color={primaryColor} />
    </View>
  );
}
