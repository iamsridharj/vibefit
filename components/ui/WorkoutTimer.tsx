import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ProgressBar } from "./ProgressBar";

type TimerMode = "workout" | "rest" | "prepare";

interface WorkoutTimerProps {
  mode: TimerMode;
  initialSeconds?: number;
  autoStart?: boolean;
  onTimeComplete?: () => void;
  onModeChange?: (mode: TimerMode) => void;
  style?: ViewStyle;
  showProgressBar?: boolean;
  sound?: boolean;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  mode,
  initialSeconds = 0,
  autoStart = false,
  onTimeComplete,
  onModeChange,
  style,
  showProgressBar = true,
  sound = true,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Animation for timer pulses
  const animateTimer = useCallback(() => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  }, []);

  // Warning animation for low time
  const warningAnimation = useCallback(() => {
    opacity.value = withRepeat(withTiming(0.5, { duration: 500 }), -1, true);
  }, []);

  const stopWarningAnimation = useCallback(() => {
    opacity.value = withTiming(1, { duration: 200 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    setSeconds(initialSeconds);
    setTotalSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = mode === "workout" ? prev + 1 : prev - 1;

          if (mode !== "workout" && newSeconds <= 0) {
            setIsRunning(false);
            onTimeComplete?.();
            return 0;
          }

          // Animate every second
          animateTimer();

          // Warning animation for rest timer when < 10 seconds
          if (mode === "rest" && newSeconds <= 10 && newSeconds > 0) {
            warningAnimation();
          } else {
            stopWarningAnimation();
          }

          return newSeconds;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopWarningAnimation();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isRunning,
    mode,
    onTimeComplete,
    animateTimer,
    warningAnimation,
    stopWarningAnimation,
  ]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggle = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  const getTimerColor = () => {
    switch (mode) {
      case "workout":
        return colors.success;
      case "rest":
        if (seconds <= 10) return colors.error;
        return colors.warning;
      case "prepare":
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  const getTimerIcon = () => {
    switch (mode) {
      case "workout":
        return "fitness-outline";
      case "rest":
        return "pause-circle-outline";
      case "prepare":
        return "play-circle-outline";
      default:
        return "time-outline";
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case "workout":
        return "Workout Time";
      case "rest":
        return "Rest Time";
      case "prepare":
        return "Get Ready";
      default:
        return "Timer";
    }
  };

  const progress =
    mode === "workout" ? 0 : ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.modeIndicator}>
          <Ionicons
            name={getTimerIcon() as any}
            size={20}
            color={getTimerColor()}
          />
          <Text style={[styles.modeLabel, { color: colors.text }]}>
            {getModeLabel()}
          </Text>
        </View>
      </View>

      <Animated.View style={[styles.timerContainer, animatedStyle]}>
        <Text style={[styles.timer, { color: getTimerColor() }]}>
          {formatTime(seconds)}
        </Text>
      </Animated.View>

      {showProgressBar && mode !== "workout" && totalSeconds > 0 && (
        <ProgressBar
          progress={progress}
          height={6}
          fillColor={getTimerColor()}
          variant="pill"
          style={styles.progressBar}
        />
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: colors.surfaceSecondary },
          ]}
          onPress={reset}
        >
          <Ionicons name="refresh-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: getTimerColor() }]}
          onPress={toggle}
        >
          <Ionicons
            name={isRunning ? "pause" : "play"}
            size={32}
            color={colors.textInverse}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: colors.surfaceSecondary },
          ]}
          onPress={() => setSeconds((s) => s + (mode === "workout" ? -60 : 60))}
        >
          <Ionicons
            name={mode === "workout" ? "remove-outline" : "add-outline"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Specialized timer components
export const RestTimer: React.FC<{
  restTimeSeconds: number;
  onRestComplete?: () => void;
  autoStart?: boolean;
  style?: ViewStyle;
}> = ({ restTimeSeconds, onRestComplete, autoStart = true, style }) => {
  return (
    <WorkoutTimer
      mode="rest"
      initialSeconds={restTimeSeconds}
      autoStart={autoStart}
      onTimeComplete={onRestComplete}
      style={style}
    />
  );
};

export const PrepareTimer: React.FC<{
  prepareTimeSeconds?: number;
  onPrepareComplete?: () => void;
  autoStart?: boolean;
  style?: ViewStyle;
}> = ({
  prepareTimeSeconds = 10,
  onPrepareComplete,
  autoStart = true,
  style,
}) => {
  return (
    <WorkoutTimer
      mode="prepare"
      initialSeconds={prepareTimeSeconds}
      autoStart={autoStart}
      onTimeComplete={onPrepareComplete}
      style={style}
    />
  );
};

export const WorkoutSessionTimer: React.FC<{
  isActive: boolean;
  onTimeUpdate?: (seconds: number) => void;
  style?: ViewStyle;
}> = ({ isActive, onTimeUpdate, style }) => {
  return (
    <WorkoutTimer
      mode="workout"
      initialSeconds={0}
      autoStart={isActive}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  modeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  timer: {
    fontSize: 48,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  progressBar: {
    width: "100%",
    marginVertical: 16,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WorkoutTimer;
