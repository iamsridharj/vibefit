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
import { Colors } from "@/constants/Colors";
import { RootState } from "@/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/store/slices/authSlice";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    dispatch(loginStart());

    try {
      const { authService } = await import("@/services/api/authService");
      const { workoutService } = await import("@/services/api/workoutService");
      const response = await authService.login({ email, password });

      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
        })
      );

      try {
        // Check if user has an active plan
        const activePlan = await workoutService.getActivePlan();

        if (activePlan?.activePlan) {
          // User has an active plan, go to home
          router.replace("/(tabs)");
        } else {
          // No active plan, go to onboarding
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error("Error checking active plan:", error);
        // If there's an error fetching the active plan, default to onboarding
        router.replace("/onboarding");
      }
    } catch (err: any) {
      dispatch(loginFailure(err.message || "Invalid email or password"));
      Alert.alert(
        "Login Failed",
        err.message || "Please check your credentials and try again."
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
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
              Sign in to continue your fitness journey
            </Text>
          </View>

          <View style={styles.form}>
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
              placeholder="Enter your password"
              secureTextEntry
              leftIcon="lock-closed"
              error={passwordError}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text
                style={[styles.forgotPasswordText, { color: primaryColor }]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: textSecondaryColor }]}>
              Don't have an account?{" "}
              <Link
                href={"/(auth)/register" as any}
                style={[styles.link, { color: primaryColor }]}
              >
                Sign Up
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
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
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
    marginBottom: 32,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
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
  loginButton: {
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
