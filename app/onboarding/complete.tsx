import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function OnboardingCompleteScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <LinearGradient
          colors={["#4CAF50", "#45B649"]}
          style={styles.successIcon}
        >
          <Ionicons name="checkmark" size={48} color="white" />
        </LinearGradient>

        <Text style={[styles.title, { color: textColor }]}>
          You're All Set!
        </Text>
        <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
          Your personalized workout plan is ready. Let's start your fitness
          journey!
        </Text>

        <Button
          title="Go to Dashboard"
          onPress={() => router.replace("/(tabs)")}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    minWidth: 200,
  },
});
