import React, { useEffect } from "react";
import {
  View,
  Text,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: "center" | "bottom" | "fullscreen" | "card";
  size?: "small" | "medium" | "large" | "auto";
  dismissOnBackdrop?: boolean;
  showCloseButton?: boolean;
  animationType?: "slide" | "fade" | "spring";
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  backdropColor?: string;
  backdropOpacity?: number;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  variant = "center",
  size = "medium",
  dismissOnBackdrop = true,
  showCloseButton = true,
  animationType = "spring",
  style,
  contentStyle,
  titleStyle,
  backdropColor,
  backdropOpacity = 0.5,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const backdropOpacityValue = useSharedValue(0);
  const modalTranslateY = useSharedValue(
    variant === "bottom" ? SCREEN_HEIGHT : 0
  );
  const modalScale = useSharedValue(0.8);
  const modalOpacity = useSharedValue(0);

  const finalBackdropColor = backdropColor || colors.overlay;

  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);

  const showModal = () => {
    backdropOpacityValue.value = withTiming(backdropOpacity, { duration: 200 });

    if (variant === "bottom") {
      modalTranslateY.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
      });
    } else if (variant === "center" || variant === "card") {
      if (animationType === "spring") {
        modalScale.value = withSpring(1, {
          damping: 15,
          stiffness: 150,
        });
      } else {
        modalScale.value = withTiming(1, { duration: 250 });
      }
      modalOpacity.value = withTiming(1, { duration: 200 });
    } else if (variant === "fullscreen") {
      modalOpacity.value = withTiming(1, { duration: 200 });
    }
  };

  const hideModal = () => {
    const duration = 200;
    backdropOpacityValue.value = withTiming(0, { duration });

    if (variant === "bottom") {
      modalTranslateY.value = withTiming(SCREEN_HEIGHT, { duration }, () => {
        runOnJS(onClose)();
      });
    } else if (variant === "center" || variant === "card") {
      modalScale.value = withTiming(0.8, { duration });
      modalOpacity.value = withTiming(0, { duration }, () => {
        runOnJS(onClose)();
      });
    } else if (variant === "fullscreen") {
      modalOpacity.value = withTiming(0, { duration }, () => {
        runOnJS(onClose)();
      });
    }
  };

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacityValue.value,
    };
  });

  const modalStyle = useAnimatedStyle(() => {
    const baseStyle: any = {};

    if (variant === "bottom") {
      baseStyle.transform = [{ translateY: modalTranslateY.value }];
    } else if (variant === "center" || variant === "card") {
      baseStyle.transform = [{ scale: modalScale.value }];
      baseStyle.opacity = modalOpacity.value;
    } else if (variant === "fullscreen") {
      baseStyle.opacity = modalOpacity.value;
    }

    return baseStyle;
  });

  const getModalContainerStyle = () => {
    const baseStyle = [styles.modalContainer];

    switch (variant) {
      case "bottom":
        return [...baseStyle, styles.bottomModal];
      case "center":
        return [...baseStyle, styles.centerModal];
      case "card":
        return [...baseStyle, styles.cardModal];
      case "fullscreen":
        return [...baseStyle, styles.fullscreenModal];
      default:
        return [...baseStyle, styles.centerModal];
    }
  };

  const getContentStyle = () => {
    const baseStyle = [
      styles.content,
      { backgroundColor: colors.surface },
      contentStyle,
    ];

    if (variant === "card") {
      baseStyle.push(styles.cardContent);
    } else if (variant === "bottom") {
      baseStyle.push(styles.bottomContent);
    } else if (variant === "fullscreen") {
      baseStyle.push(styles.fullscreenContent);
    }

    return baseStyle;
  };

  const handleBackdropPress = () => {
    if (dismissOnBackdrop) {
      hideModal();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              { backgroundColor: finalBackdropColor },
              backdropStyle,
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View style={[getModalContainerStyle(), modalStyle, style]}>
          <View style={getContentStyle()}>
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && (
                  <Text
                    style={[styles.title, { color: colors.text }, titleStyle]}
                  >
                    {title}
                  </Text>
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    style={[
                      styles.closeButton,
                      { backgroundColor: colors.surfaceSecondary },
                    ]}
                    onPress={hideModal}
                  >
                    <Ionicons name="close" size={20} color={colors.text} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.body}>{children}</View>
          </View>
        </Animated.View>
      </View>
    </RNModal>
  );
};

// Specialized modal components
export const ConfirmationModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getConfirmButtonColor = () => {
    switch (variant) {
      case "danger":
        return colors.error;
      case "warning":
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      variant="card"
      size="small"
    >
      <Text
        style={[styles.confirmationMessage, { color: colors.textSecondary }]}
      >
        {message}
      </Text>

      <View style={styles.confirmationButtons}>
        <TouchableOpacity
          style={[
            styles.confirmationButton,
            { backgroundColor: colors.surfaceSecondary },
          ]}
          onPress={onClose}
        >
          <Text style={[styles.confirmationButtonText, { color: colors.text }]}>
            {cancelText}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.confirmationButton,
            { backgroundColor: getConfirmButtonColor() },
          ]}
          onPress={() => {
            onConfirm();
            onClose();
          }}
        >
          <Text
            style={[
              styles.confirmationButtonText,
              { color: colors.textInverse },
            ]}
          >
            {confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export const LoadingModal: React.FC<{
  visible: boolean;
  message?: string;
}> = ({ visible, message = "Loading..." }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Modal
      visible={visible}
      onClose={() => {}}
      variant="center"
      size="small"
      dismissOnBackdrop={false}
      showCloseButton={false}
    >
      <View style={styles.loadingContent}>
        <View
          style={[styles.loadingSpinner, { backgroundColor: colors.primary }]}
        />
        <Text style={[styles.loadingMessage, { color: colors.text }]}>
          {message}
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "relative",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerModal: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardModal: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  bottomModal: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  fullscreenModal: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    borderRadius: 16,
    maxWidth: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  cardContent: {
    minWidth: 280,
    padding: 24,
  },
  bottomContent: {
    width: SCREEN_WIDTH,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  fullscreenContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderRadius: 0,
    padding: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  body: {
    flex: 1,
  },
  confirmationMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  confirmationButtons: {
    flexDirection: "row",
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmationButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContent: {
    alignItems: "center",
    padding: 32,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 16,
  },
  loadingMessage: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default Modal;
