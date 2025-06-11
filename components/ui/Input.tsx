import React, { useState, forwardRef } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  spacing,
  typography,
  borderRadius,
  dimensions,
} from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: "default" | "outlined" | "filled";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      variant = "outlined",
      size = "medium",
      disabled = false,
      required = false,
      containerStyle,
      inputStyle,
      labelStyle,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(
      !secureTextEntry
    );

    const getVariantStyles = (): ViewStyle => {
      switch (variant) {
        case "filled":
          return {
            backgroundColor: colors.surfaceSecondary,
            borderWidth: 0,
            borderBottomWidth: 2,
            borderBottomColor: isFocused ? colors.primary : colors.border,
          };
        case "outlined":
          return {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary
              : colors.border,
          };
        default:
          return {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary
              : colors.border,
          };
      }
    };

    const getSizeStyles = (): { container: ViewStyle; input: TextStyle } => {
      switch (size) {
        case "small":
          return {
            container: { height: 40 },
            input: { fontSize: typography.fontSizes.sm },
          };
        case "large":
          return {
            container: { height: 56 },
            input: { fontSize: typography.fontSizes.lg },
          };
        default:
          return {
            container: { height: dimensions.inputHeight },
            input: { fontSize: typography.fontSizes.md },
          };
      }
    };

    const sizeStyles = getSizeStyles();
    const variantStyles = getVariantStyles();

    const handleFocus = (e: any) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const renderRightIcon = () => {
      if (secureTextEntry) {
        return (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? "Hide password" : "Show password"
            }
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        );
      }

      if (rightIcon) {
        return (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconContainer}
            accessibilityRole="button"
          >
            <Ionicons name={rightIcon} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        );
      }

      return null;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.text }, labelStyle]}>
            {label}
            {required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        )}

        <View
          style={[
            styles.inputContainer,
            sizeStyles.container,
            variantStyles,
            disabled && styles.disabled,
          ]}
        >
          {leftIcon && (
            <View style={styles.iconContainer}>
              <Ionicons
                name={leftIcon}
                size={20}
                color={colors.textSecondary}
              />
            </View>
          )}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              sizeStyles.input,
              { color: colors.text },
              leftIcon && styles.inputWithLeftIcon,
              (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
              inputStyle,
            ]}
            placeholderTextColor={colors.textTertiary}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityLabel={label}
            accessibilityHint={helperText}
            {...props}
          />

          {renderRightIcon()}
        </View>

        {(error || helperText) && (
          <Text
            style={[
              styles.helperText,
              { color: error ? colors.error : colors.textSecondary },
            ]}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontWeight: typography.fontWeights.regular,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.md,
  },
  inputWithLeftIcon: {
    marginLeft: spacing.sm,
  },
  inputWithRightIcon: {
    marginRight: spacing.sm,
  },
  iconContainer: {
    padding: spacing.xs,
  },
  disabled: {
    opacity: 0.6,
  },
  helperText: {
    fontSize: typography.fontSizes.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
