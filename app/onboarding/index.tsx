import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function OnboardingWelcomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const handleGetStarted = () => {
    router.push("/onboarding/personal-info");
  };

  const features = [
    {
      icon: "fitness-outline",
      title: "AI-Powered Workouts",
      description:
        "Get personalized workout plans created by advanced AI based on your goals and fitness level.",
    },
    {
      icon: "analytics-outline",
      title: "Progress Tracking",
      description:
        "Monitor your fitness journey with detailed analytics and insights into your performance.",
    },
    {
      icon: "people-outline",
      title: "Social Features",
      description:
        "Connect with friends, share achievements, and participate in fitness challenges together.",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View
            style={[styles.logoContainer, { backgroundColor: primaryColor }]}
          >
            <Ionicons name="fitness" size={50} color="white" />
          </View>
          <Text style={[styles.title, { color: textColor }]}>
            Welcome to VibeFits
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            Your personal AI fitness companion. Transform your fitness journey
            with intelligent workouts, progress tracking, and social motivation.
          </Text>
        </View>

        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: `${primaryColor}20` },
                ]}
              >
                <Ionicons
                  name={feature.icon as any}
                  size={32}
                  color={primaryColor}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: textColor }]}>
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    { color: textSecondaryColor },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottom}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            style={styles.getStartedButton}
          />

          <Text style={[styles.timeEstimate, { color: textSecondaryColor }]}>
            Takes about 2-3 minutes to set up your profile
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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
    flex: 1,
    paddingVertical: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottom: {
    paddingTop: 20,
  },
  getStartedButton: {
    marginBottom: 16,
  },
  timeEstimate: {
    fontSize: 14,
    textAlign: "center",
  },
});
