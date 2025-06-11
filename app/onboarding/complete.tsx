import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function OnboardingCompleteScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const successColor = useThemeColor({}, "success");

  const handleGetStarted = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.successIcon, { backgroundColor: successColor }]}>
            <Ionicons name="checkmark" size={60} color="white" />
          </View>
          <Text style={[styles.title, { color: textColor }]}>
            You're All Set!
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            Welcome to VibeFits! Your personalized fitness journey starts now.
            We've created a custom plan based on your goals and preferences.
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: `${primaryColor}20` },
              ]}
            >
              <Ionicons name="fitness-outline" size={24} color={primaryColor} />
            </View>
            <Text style={[styles.featureText, { color: textColor }]}>
              AI-generated workout plans tailored for you
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: `${primaryColor}20` },
              ]}
            >
              <Ionicons
                name="analytics-outline"
                size={24}
                color={primaryColor}
              />
            </View>
            <Text style={[styles.featureText, { color: textColor }]}>
              Track your progress with detailed insights
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: `${primaryColor}20` },
              ]}
            >
              <Ionicons name="people-outline" size={24} color={primaryColor} />
            </View>
            <Text style={[styles.featureText, { color: textColor }]}>
              Connect with friends and join challenges
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Start Your Fitness Journey"
            onPress={handleGetStarted}
            style={styles.startButton}
          />

          <Text style={[styles.encouragement, { color: textSecondaryColor }]}>
            Ready to transform your fitness? Let's begin! 🏃‍♂️
          </Text>
        </View>
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
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  features: {
    paddingVertical: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    paddingBottom: 20,
  },
  startButton: {
    marginBottom: 16,
  },
  encouragement: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
