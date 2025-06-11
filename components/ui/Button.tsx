import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import {
  Colors,
  spacing,
  typography,
  borderRadius,
  dimensions,
} from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case "primary":
        return {
          container: {
            backgroundColor: colors.primary,
            borderWidth: 0,
          },
          text: {
            color: colors.textInverse,
          },
        };
      case "secondary":
        return {
          container: {
            backgroundColor: colors.secondary,
            borderWidth: 0,
          },
          text: {
            color: colors.textInverse,
          },
        };
      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: colors.primary,
          },
          text: {
            color: colors.primary,
          },
        };
      case "ghost":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 0,
          },
          text: {
            color: colors.primary,
          },
        };
      case "danger":
        return {
          container: {
            backgroundColor: colors.error,
            borderWidth: 0,
          },
          text: {
            color: colors.textInverse,
          },
        };
      default:
        return {
          container: {
            backgroundColor: colors.primary,
            borderWidth: 0,
          },
          text: {
            color: colors.textInverse,
          },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case "small":
        return {
          container: {
            height: 36,
            paddingHorizontal: spacing.md,
          },
          text: {
            fontSize: typography.fontSizes.sm,
          },
        };
      case "medium":
        return {
          container: {
            height: dimensions.buttonHeight,
            paddingHorizontal: spacing.lg,
          },
          text: {
            fontSize: typography.fontSizes.md,
          },
        };
      case "large":
        return {
          container: {
            height: 56,
            paddingHorizontal: spacing.xl,
          },
          text: {
            fontSize: typography.fontSizes.lg,
          },
        };
      default:
        return {
          container: {
            height: dimensions.buttonHeight,
            paddingHorizontal: spacing.lg,
          },
          text: {
            fontSize: typography.fontSizes.md,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const containerStyles = [
    styles.container,
    variantStyles.container,
    sizeStyles.container,
    fullWidth && styles.fullWidth,
    disabled && {
      opacity: 0.6,
      backgroundColor: colors.border,
    },
    style,
  ].filter(Boolean) as ViewStyle[];

  const textStyles = [
    styles.text,
    variantStyles.text,
    sizeStyles.text,
    disabled && { color: colors.textSecondary },
    textStyle,
  ].filter(Boolean) as TextStyle[];

  const handlePress = (event: any) => {
    if (!disabled && !loading && onPress) {
      onPress(event);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? colors.primary
              : colors.textInverse
          }
        />
      );
    }

    if (icon) {
      return (
        <React.Fragment>
          {iconPosition === "left" && icon}
          <Text
            style={[
              ...textStyles,
              icon ? { marginHorizontal: spacing.xs } : {},
            ]}
          >
            {title}
          </Text>
          {iconPosition === "right" && icon}
        </React.Fragment>
      );
    }

    return <Text style={textStyles}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={title}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    minHeight: dimensions.buttonHeight,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontWeight: typography.fontWeights.medium,
    textAlign: "center",
  },
});
