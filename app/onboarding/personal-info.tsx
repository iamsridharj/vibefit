import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PersonalInfoScreen() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const validateForm = () => {
    if (!dateOfBirth.trim()) {
      Alert.alert("Validation Error", "Please enter your date of birth");
      return false;
    }
    if (!gender) {
      Alert.alert("Validation Error", "Please select your gender");
      return false;
    }
    if (!height.trim() || isNaN(Number(height))) {
      Alert.alert("Validation Error", "Please enter a valid height in cm");
      return false;
    }
    if (!weight.trim() || isNaN(Number(weight))) {
      Alert.alert("Validation Error", "Please enter a valid weight in kg");
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Save data to store or pass to next screen
      router.push("/onboarding/fitness-profile");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Personal Info
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: primaryColor, width: "33%" },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: textSecondaryColor }]}>
          Step 1 of 3
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor }]}>
            Tell us about yourself
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            This information helps us personalize your fitness experience
          </Text>

          <View style={styles.form}>
            <Input
              label="Date of Birth"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="DD/MM/YYYY"
              leftIcon="calendar"
            />

            <View style={styles.genderSection}>
              <Text style={[styles.label, { color: textColor }]}>Gender</Text>
              <View style={styles.genderOptions}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      {
                        backgroundColor:
                          gender === option.value ? primaryColor : surfaceColor,
                        borderColor:
                          gender === option.value ? primaryColor : borderColor,
                      },
                    ]}
                    onPress={() => setGender(option.value as any)}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        {
                          color: gender === option.value ? "white" : textColor,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.measurementsRow}>
              <View style={styles.measurementField}>
                <Input
                  label="Height (cm)"
                  value={height}
                  onChangeText={setHeight}
                  placeholder="170"
                  keyboardType="numeric"
                  leftIcon="resize"
                />
              </View>
              <View style={styles.measurementField}>
                <Input
                  label="Weight (kg)"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="70"
                  keyboardType="numeric"
                  leftIcon="fitness"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  form: {
    gap: 24,
  },
  genderSection: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  genderOptions: {
    flexDirection: "row",
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  genderOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  measurementsRow: {
    flexDirection: "row",
    gap: 16,
  },
  measurementField: {
    flex: 1,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
});
