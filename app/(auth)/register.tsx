import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RootState } from "@/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/store/slices/authSlice";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const dispatch = useDispatch();
  const { loading, error } = useSelector(
    (state: RootState) =>
      state.persisted.auth || { loading: false, error: null }
  );

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;

    // Name validation
    if (!firstName.trim() || !lastName.trim()) {
      setNameError("Both first and last names are required");
      isValid = false;
    } else {
      setNameError("");
    }

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError(
        "Password must contain uppercase, lowercase, and number"
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    dispatch(loginStart());

    try {
      const { authService } = await import("@/services/api/authService");

      const response = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
        })
      );

      // After registration, always go to onboarding
      router.replace("/onboarding");
    } catch (err: any) {
      dispatch(
        loginFailure(err.message || "Registration failed. Please try again.")
      );
      Alert.alert(
        "Registration Failed",
        err.message || "Please try again later."
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View
              style={[styles.logoContainer, { backgroundColor: primaryColor }]}
            >
              <Ionicons name="fitness" size={40} color="white" />
            </View>
            <Text style={[styles.title, { color: textColor }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
              Join VibeFit and start your fitness journey today
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Input
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  autoCapitalize="words"
                  leftIcon="person"
                  error={nameError && !firstName.trim() ? "Required" : ""}
                />
              </View>
              <View style={styles.nameField}>
                <Input
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  autoCapitalize="words"
                  leftIcon="person"
                  error={nameError && !lastName.trim() ? "Required" : ""}
                />
              </View>
            </View>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="mail"
              error={emailError}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              leftIcon="lock-closed"
              error={passwordError}
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              leftIcon="lock-closed"
              error={confirmPasswordError}
            />

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
            />

            <Text style={[styles.termsText, { color: textSecondaryColor }]}>
              By creating an account, you agree to our{" "}
              <TouchableOpacity>
                <Text style={[styles.link, { color: primaryColor }]}>
                  Terms of Service
                </Text>
              </TouchableOpacity>{" "}
              and{" "}
              <TouchableOpacity>
                <Text style={[styles.link, { color: primaryColor }]}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: textSecondaryColor }]}>
              Already have an account?{" "}
              <Link
                href={"/(auth)/login" as any}
                style={[styles.link, { color: primaryColor }]}
              >
                Sign In
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },
  registerButton: {
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontWeight: "600",
  },
});
