import { X } from '@/components/icons/x';
import { clx } from '@/utils/clx';
import React from 'react';
import {
  GestureResponderEvent,
  Modal,
  ModalProps,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

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
  onClose,
  onOverlayPress,
  onCloseIconPress,
  ...modalProps
}) => {
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

  return (
    <Modal transparent={true} statusBarTranslucent {...modalProps} onRequestClose={onRequestClose}>
      <SafeAreaView className={clx('flex-1 justify-center items-center bg-black/50', className)}>
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <View className="p-4 w-full max-h-full">
          <View className={clx('bg-white rounded-2xl p-4 w-full overflow-hidden max-h-full', containerClassName)}>
            {(title || showCloseButton) && (
              <View className={clx('flex-row mb-4 justify-between gap-2 items-center', headerClassName)}>
                {title && <Text className="text-base">{title}</Text>}
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
      </SafeAreaView>
    </Modal>
  );
};
