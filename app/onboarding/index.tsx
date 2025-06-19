import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ColorValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

const { width } = Dimensions.get("window");

interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: [ColorValue, ColorValue];
}

export default function OnboardingWelcomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const handleGetStarted = () => {
    router.push("/onboarding/personal-info");
  };

  const features: Feature[] = [
    {
      icon: "fitness",
      title: "Smart Workouts",
      description: "AI-powered plans that adapt to your progress",
      gradient: ["#FF6B6B", "#FF8E8E"],
    },
    {
      icon: "trending-up",
      title: "Track Progress",
      description: "Monitor your fitness journey with detailed insights",
      gradient: ["#4ECDC4", "#6EE7E7"],
    },
    {
      icon: "people",
      title: "Community",
      description: "Join a supportive fitness community",
      gradient: ["#45B7D1", "#6CB8FF"],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[primaryColor, `${primaryColor}80`]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="fitness" size={80} color="white" />
            <Text style={styles.heroTitle}>VibeFit</Text>
            <Text style={styles.heroSubtitle}>Your AI Fitness Partner</Text>
          </LinearGradient>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {features.map((feature, index) => (
            <LinearGradient
              key={index}
              colors={feature.gradient}
              style={styles.featureCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={32} color="white" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* Get Started Section */}
        <View style={styles.getStarted}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            style={styles.getStartedButton}
          />
          <Text style={[styles.timeEstimate, { color: textSecondaryColor }]}>
            Quick 2-min setup • No credit card required
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
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  heroGradient: {
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "white",
    opacity: 0.9,
    marginTop: 8,
  },
  features: {
    padding: 24,
    gap: 16,
  },
  featureCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  getStarted: {
    padding: 24,
    paddingTop: 0,
  },
  getStartedButton: {
    marginBottom: 16,
  },
  timeEstimate: {
    fontSize: 14,
    textAlign: "center",
  },
});
