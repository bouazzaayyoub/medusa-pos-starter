import { X } from '@/components/icons/x';
import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import React from 'react';
import {
  GestureResponderEvent,
  Modal,
  ModalProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface DialogProps extends ModalProps {
  title?: string;
  showCloseButton?: boolean;
  dismissOnOverlayPress?: boolean;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  onClose?: () => void;
  onOverlayPress?: (event: GestureResponderEvent) => void;
  onCloseIconPress?: (event: GestureResponderEvent) => void;
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  children,
  showCloseButton = true,
  dismissOnOverlayPress = true,
  className,
  containerClassName,
  contentClassName,
  headerClassName,
  animationType = 'fade',
  onClose,
  onOverlayPress,
  onCloseIconPress,
  ...modalProps
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const animatedKeyboard = useAnimatedKeyboard();

  const onRequestClose = React.useCallback<Exclude<ModalProps['onRequestClose'], undefined>>(
    (event) => {
      if (modalProps.onRequestClose) {
        return modalProps.onRequestClose(event);
      }

      onClose?.();
    },
    [modalProps, onClose],
  );

  const handleOverlayPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (dismissOnOverlayPress) {
        if (onOverlayPress) {
          return onOverlayPress(event);
        }

        onClose?.();
      }
    },
    [dismissOnOverlayPress, onOverlayPress, onClose],
  );

  const handleCloseIconPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (onCloseIconPress) {
        return onCloseIconPress(event);
      }

      onClose?.();
    },
    [onClose, onCloseIconPress],
  );

  const overlayWrapperStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: Math.max(animatedKeyboard.height.value, safeAreaInsets.bottom),
    };
  });

  return (
    <Modal
      transparent={true}
      statusBarTranslucent
      animationType={animationType}
      {...modalProps}
      onRequestClose={onRequestClose}
    >
      <Animated.View
        className={clx('flex-1 items-center justify-center bg-black/50', className)}
        style={[
          {
            paddingTop: safeAreaInsets.top,
            paddingRight: safeAreaInsets.right,
            paddingLeft: safeAreaInsets.left,
          },
          overlayWrapperStyle,
        ]}
      >
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <View className="max-h-full w-full items-center p-4">
          <View className={clx('max-h-full w-full overflow-hidden rounded-2xl bg-white p-4', containerClassName)}>
            {(title || showCloseButton) && (
              <View className={clx('mb-4 flex-row items-center justify-between gap-2', headerClassName)}>
                {title && <Text className="text-xl">{title}</Text>}
                {showCloseButton && (
                  <TouchableOpacity onPress={handleCloseIconPress} accessibilityLabel="Close dialog">
                    <X size={20} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View className={contentClassName}>{children}</View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};
