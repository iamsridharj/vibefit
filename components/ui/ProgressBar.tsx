import React, { useEffect } from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "rounded" | "sharp" | "pill";
  gradient?: boolean;
  label?: string;
  duration?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor,
  fillColor,
  showPercentage = false,
  animated = true,
  style,
  textStyle,
  variant = "rounded",
  gradient = false,
  label,
  duration = 500,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const progressValue = useSharedValue(0);
  const finalProgress = Math.max(0, Math.min(100, progress));

  const finalBackgroundColor = backgroundColor || colors.surfaceSecondary;
  const finalFillColor = fillColor || colors.primary;

  useEffect(() => {
    if (animated) {
      progressValue.value = withSpring(finalProgress, {
        damping: 15,
        stiffness: 100,
        mass: 1,
      });
    } else {
      progressValue.value = finalProgress;
    }
  }, [finalProgress, animated]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    const progressWidth = (progressValue.value / 100) * 100 + "%";

    let progressColor = finalFillColor;
    if (gradient) {
      progressColor = interpolateColor(
        progressValue.value,
        [0, 50, 100],
        [colors.warning, colors.accent, colors.success]
      );
    }

    return {
      width: progressWidth as any,
      backgroundColor: progressColor,
    };
  });

  const getBorderRadius = () => {
    switch (variant) {
      case "rounded":
        return height / 2;
      case "pill":
        return height;
      case "sharp":
        return 0;
      default:
        return height / 2;
    }
  };

  const borderRadius = getBorderRadius();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }, textStyle]}>
            {label}
          </Text>
          {showPercentage && (
            <Text
              style={[
                styles.percentage,
                { color: colors.textSecondary },
                textStyle,
              ]}
            >
              {Math.round(finalProgress)}%
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.progressBar,
          {
            height,
            backgroundColor: finalBackgroundColor,
            borderRadius,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              height,
              borderRadius,
            },
            animatedProgressStyle,
          ]}
        />
      </View>

      {!label && showPercentage && (
        <Text
          style={[
            styles.standalonePercentage,
            { color: colors.textSecondary },
            textStyle,
          ]}
        >
          {Math.round(finalProgress)}%
        </Text>
      )}
    </View>
  );
};

// Specialized components for specific use cases
export const WorkoutProgressBar: React.FC<{
  currentSet: number;
  totalSets: number;
  style?: ViewStyle;
}> = ({ currentSet, totalSets, style }) => {
  const progress = (currentSet / totalSets) * 100;
  return (
    <ProgressBar
      progress={progress}
      label={`Set ${currentSet} of ${totalSets}`}
      showPercentage={false}
      height={12}
      variant="rounded"
      style={style}
    />
  );
};

export const RestTimerBar: React.FC<{
  timeRemaining: number;
  totalTime: number;
  style?: ViewStyle;
}> = ({ timeRemaining, totalTime, style }) => {
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  return (
    <ProgressBar
      progress={progress}
      height={6}
      variant="pill"
      fillColor="#FF6B6B"
      animated={false}
      style={style}
    />
  );
};

export const CalorieProgressBar: React.FC<{
  current: number;
  goal: number;
  style?: ViewStyle;
}> = ({ current, goal, style }) => {
  const progress = (current / goal) * 100;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ProgressBar
      progress={progress}
      label="Calories Burned"
      showPercentage={false}
      height={10}
      variant="rounded"
      gradient={true}
      style={StyleSheet.flatten([{ marginVertical: 8 }, style])}
      textStyle={{ fontSize: 12, fontWeight: "600" }}
    />
  );
};

export const StrengthProgressBar: React.FC<{
  currentWeight: number;
  personalRecord: number;
  style?: ViewStyle;
}> = ({ currentWeight, personalRecord, style }) => {
  const progress = (currentWeight / personalRecord) * 100;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getProgressColor = () => {
    if (progress >= 100) return colors.success;
    if (progress >= 80) return colors.warning;
    return colors.primary;
  };

  return (
    <ProgressBar
      progress={progress}
      label={`${currentWeight}kg / ${personalRecord}kg PR`}
      showPercentage={false}
      height={8}
      fillColor={getProgressColor()}
      variant="rounded"
      style={style}
      textStyle={{ fontSize: 11, fontWeight: "500" }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  percentage: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressBar: {
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  standalonePercentage: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
});

export default ProgressBar;
