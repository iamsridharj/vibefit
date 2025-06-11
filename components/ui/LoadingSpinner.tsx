import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  style?: ViewStyle;
  variant?: "circular" | "dots" | "pulse";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color,
  style,
  variant = "circular",
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const finalColor = color || colors.primary;

  const getSizeValue = () => {
    switch (size) {
      case "small":
        return 20;
      case "medium":
        return 32;
      case "large":
        return 48;
      default:
        return 32;
    }
  };

  const sizeValue = getSizeValue();

  if (variant === "circular") {
    return (
      <CircularSpinner size={sizeValue} color={finalColor} style={style} />
    );
  } else if (variant === "dots") {
    return <DotsSpinner size={sizeValue} color={finalColor} style={style} />;
  } else {
    return <PulseSpinner size={sizeValue} color={finalColor} style={style} />;
  }
};

const CircularSpinner: React.FC<{
  size: number;
  color: string;
  style?: ViewStyle;
}> = ({ size, color, style }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[animatedStyle]}>
        <View
          style={[
            styles.circularSpinner,
            {
              width: size,
              height: size,
              borderColor: color,
              borderTopColor: "transparent",
              borderWidth: size * 0.1,
              borderRadius: size / 2,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const DotsSpinner: React.FC<{
  size: number;
  color: string;
  style?: ViewStyle;
}> = ({ size, color, style }) => {
  const dotSize = size * 0.2;
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const duration = 600;
    const delay = 200;

    const animateDot = (
      value: Animated.SharedValue<number>,
      delayMs: number
    ) => {
      value.value = withRepeat(
        withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    };

    setTimeout(() => animateDot(dot1, 0), 0);
    setTimeout(() => animateDot(dot2, delay), delay);
    setTimeout(() => animateDot(dot3, delay * 2), delay * 2);
  }, []);

  const createDotStyle = (value: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => {
      const scale = interpolate(value.value, [0, 1], [0.5, 1]);
      const opacity = interpolate(value.value, [0, 1], [0.3, 1]);
      return {
        transform: [{ scale }],
        opacity,
      };
    });

  const dot1Style = createDotStyle(dot1);
  const dot2Style = createDotStyle(dot2);
  const dot3Style = createDotStyle(dot3);

  return (
    <View style={[styles.container, styles.dotsContainer, style]}>
      <Animated.View
        style={[
          styles.dot,
          { width: dotSize, height: dotSize, backgroundColor: color },
          dot1Style,
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { width: dotSize, height: dotSize, backgroundColor: color },
          dot2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { width: dotSize, height: dotSize, backgroundColor: color },
          dot3Style,
        ]}
      />
    </View>
  );
};

const PulseSpinner: React.FC<{
  size: number;
  color: string;
  style?: ViewStyle;
}> = ({ size, color, style }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.2, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0.3, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.pulseSpinner,
          {
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: size / 2,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  circularSpinner: {
    // Styles are applied dynamically
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    borderRadius: 999,
  },
  pulseSpinner: {
    // Styles are applied dynamically
  },
});

export default LoadingSpinner;
