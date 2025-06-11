import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { RootState } from "@/store";
import { useThemeColor } from "@/hooks/useThemeColor";

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
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/(auth)/login" as any);
      } else if (user && !user.dateOfBirth) {
        // User needs onboarding (simplified check)
        router.replace("/onboarding" as any);
      } else {
        // User is authenticated and has completed onboarding
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, user, loading]);

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
