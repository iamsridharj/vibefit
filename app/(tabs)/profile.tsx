import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Switch,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Colors, spacing, typography, borderRadius } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [progressUpdates, setProgressUpdates] = useState(true);
  const [socialUpdates, setSocialUpdates] = useState(false);

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@email.com",
    memberSince: "January 2024",
    totalWorkouts: 124,
    currentStreak: 7,
    achievements: 12,
    level: "Intermediate",
    avatar: null,
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Logout functionality is under development");
  };

  const renderUserHeader = () => (
    <Card variant="elevated" style={styles.userHeader}>
      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.textInverse }]}>
            {userData.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {userData.name}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {userData.email}
          </Text>
          <Text style={[styles.memberSince, { color: colors.textTertiary }]}>
            Member since {userData.memberSince}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Profile editing feature is under development"
            )
          }
        >
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Card variant="elevated" style={styles.statCard}>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {userData.totalWorkouts}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total Workouts
          </Text>
        </View>
      </Card>

      <Card variant="elevated" style={styles.statCard}>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {userData.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Day Streak
          </Text>
        </View>
      </Card>

      <Card variant="elevated" style={styles.statCard}>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {userData.achievements}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Achievements
          </Text>
        </View>
      </Card>
    </View>
  );

  const renderMenuSection = (
    title: string,
    items: Array<{
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      onPress: () => void;
      rightElement?: React.ReactNode;
      danger?: boolean;
    }>
  ) => (
    <View style={styles.menuSection}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <Card variant="outlined" style={styles.menuCard}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < items.length - 1 && styles.menuItemBorder,
              { borderBottomColor: colors.border },
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name={item.icon}
                size={20}
                color={item.danger ? colors.error : colors.textSecondary}
              />
              <Text
                style={[
                  styles.menuItemText,
                  { color: item.danger ? colors.error : colors.text },
                ]}
              >
                {item.label}
              </Text>
            </View>
            {item.rightElement || (
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.textTertiary}
              />
            )}
          </TouchableOpacity>
        ))}
      </Card>
    </View>
  );

  const accountItems = [
    {
      icon: "person-outline" as const,
      label: "Personal Information",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Personal info feature is under development"
        ),
    },
    {
      icon: "shield-outline" as const,
      label: "Privacy & Security",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Privacy settings feature is under development"
        ),
    },
    {
      icon: "card-outline" as const,
      label: "Subscription",
      onPress: () =>
        Alert.alert("Coming Soon", "Subscription feature is under development"),
    },
    {
      icon: "download-outline" as const,
      label: "Export Data",
      onPress: () =>
        Alert.alert("Coming Soon", "Data export feature is under development"),
    },
  ];

  const workoutItems = [
    {
      icon: "settings-outline" as const,
      label: "Workout Preferences",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Workout preferences feature is under development"
        ),
    },
    {
      icon: "barbell-outline" as const,
      label: "Equipment",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Equipment settings feature is under development"
        ),
    },
    {
      icon: "trophy-outline" as const,
      label: "Goals",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Goals settings feature is under development"
        ),
    },
    {
      icon: "medal-outline" as const,
      label: "Achievements",
      onPress: () =>
        Alert.alert("Coming Soon", "Achievements feature is under development"),
    },
  ];

  const notificationItems = [
    {
      icon: "notifications-outline" as const,
      label: "Push Notifications",
      onPress: () => {},
      rightElement: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={
            notificationsEnabled ? colors.primary : colors.textTertiary
          }
        />
      ),
    },
    {
      icon: "alarm-outline" as const,
      label: "Workout Reminders",
      onPress: () => {},
      rightElement: (
        <Switch
          value={workoutReminders}
          onValueChange={setWorkoutReminders}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={workoutReminders ? colors.primary : colors.textTertiary}
        />
      ),
    },
    {
      icon: "trending-up-outline" as const,
      label: "Progress Updates",
      onPress: () => {},
      rightElement: (
        <Switch
          value={progressUpdates}
          onValueChange={setProgressUpdates}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={progressUpdates ? colors.primary : colors.textTertiary}
        />
      ),
    },
    {
      icon: "people-outline" as const,
      label: "Social Updates",
      onPress: () => {},
      rightElement: (
        <Switch
          value={socialUpdates}
          onValueChange={setSocialUpdates}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={socialUpdates ? colors.primary : colors.textTertiary}
        />
      ),
    },
  ];

  const supportItems = [
    {
      icon: "help-circle-outline" as const,
      label: "Help & Support",
      onPress: () =>
        Alert.alert("Coming Soon", "Support feature is under development"),
    },
    {
      icon: "information-circle-outline" as const,
      label: "About",
      onPress: () =>
        Alert.alert("Coming Soon", "About feature is under development"),
    },
    {
      icon: "star-outline" as const,
      label: "Rate App",
      onPress: () => {},
    },
    {
      icon: "chatbubble-outline" as const,
      label: "Feedback",
      onPress: () =>
        Alert.alert("Coming Soon", "Feedback feature is under development"),
    },
  ];

  const dangerItems = [
    {
      icon: "log-out-outline" as const,
      label: "Logout",
      onPress: handleLogout,
      danger: true,
    },
    {
      icon: "trash-outline" as const,
      label: "Delete Account",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Delete account feature is under development"
        ),
      danger: true,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Profile</ThemedText>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Settings feature is under development"
              )
            }
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Header */}
        {renderUserHeader()}

        {/* Stats */}
        {renderStats()}

        {/* Account Section */}
        {renderMenuSection("Account", accountItems)}

        {/* Workout Section */}
        {renderMenuSection("Workout", workoutItems)}

        {/* Notifications Section */}
        {renderMenuSection("Notifications", notificationItems)}

        {/* Support Section */}
        {renderMenuSection("Support", supportItems)}

        {/* Danger Zone */}
        {renderMenuSection("Account Actions", dangerItems)}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            Vibefit v1.0.0
          </Text>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  userHeader: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.fontSizes.md,
    marginBottom: spacing.xs,
  },
  memberSince: {
    fontSize: typography.fontSizes.sm,
  },
  editButton: {
    padding: spacing.sm,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    padding: spacing.md,
  },
  statContent: {
    alignItems: "center",
  },
  statValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    textAlign: "center",
  },
  menuSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuCard: {
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    fontSize: typography.fontSizes.md,
    marginLeft: spacing.md,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  versionText: {
    fontSize: typography.fontSizes.sm,
  },
});
