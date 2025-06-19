import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppDispatch } from "@/store";
import { RootState } from "@/store";
import { RegisterRequest } from "@/types/api";

export default function PersonalInfoScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const dispatch = useAppDispatch();

  // Get existing user data from auth state
  const user = useSelector((state: RootState) => state.persisted.auth.user);

  const [formData, setFormData] = useState<Partial<RegisterRequest>>({
    dateOfBirth: "",
    gender: "prefer_not_to_say",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      // Basic date validation (YYYY-MM-DD format)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dateOfBirth)) {
        newErrors.dateOfBirth = "Invalid date format (use YYYY-MM-DD)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      router.push({
        pathname: "/onboarding/fitness-profile",
        params: { personalInfo: JSON.stringify({ ...user, ...formData }) },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            Additional Information
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            Help us personalize your fitness experience
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChangeText={(text) =>
              setFormData({ ...formData, dateOfBirth: text })
            }
            placeholder="YYYY-MM-DD"
            error={errors.dateOfBirth}
          />

          <View style={styles.genderSelector}>
            <Text style={[styles.label, { color: textColor }]}>Gender</Text>
            {["male", "female", "other", "prefer_not_to_say"].map((option) => (
              <Button
                key={option}
                title={option
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                onPress={() =>
                  setFormData({ ...formData, gender: option as any })
                }
                variant={formData.gender === option ? "primary" : "outline"}
                style={styles.genderButton}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button title="Next" onPress={handleNext} style={styles.nextButton} />
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
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    width: "100%",
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  genderSelector: {
    marginTop: 16,
  },
  genderButton: {
    marginBottom: 8,
  },
  footer: {
    marginTop: "auto",
  },
  nextButton: {
    marginTop: 16,
  },
});
