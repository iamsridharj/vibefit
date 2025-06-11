import React from "react";
import { View, StyleSheet, ViewStyle, ViewProps } from "react-native";
import { Colors, spacing, borderRadius } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "small" | "medium" | "large";
  margin?: "none" | "small" | "medium" | "large";
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "medium",
  margin = "none",
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case "outlined":
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          backgroundColor: colors.surface,
        };
    }
  };

  const getPaddingStyles = (): ViewStyle => {
    switch (padding) {
      case "none":
        return {};
      case "small":
        return { padding: spacing.sm };
      case "medium":
        return { padding: spacing.md };
      case "large":
        return { padding: spacing.lg };
      default:
        return { padding: spacing.md };
    }
  };

  const getMarginStyles = (): ViewStyle => {
    switch (margin) {
      case "none":
        return {};
      case "small":
        return { margin: spacing.sm };
      case "medium":
        return { margin: spacing.md };
      case "large":
        return { margin: spacing.lg };
      default:
        return {};
    }
  };

  const combinedStyles = [
    styles.card,
    getVariantStyles(),
    getPaddingStyles(),
    getMarginStyles(),
    style,
  ] as ViewStyle[];

  return (
    <View style={combinedStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
});
