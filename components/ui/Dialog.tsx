import { X } from '@/components/icons/x';
import { clx } from '@/utils/clx';
import React from 'react';
import { Modal, ModalProps, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export interface DialogProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  dismissOnOverlayPress?: boolean;
  containerClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  overlayTint?: string;
  pinDown?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  showCloseButton = true,
  dismissOnOverlayPress = true,
  containerClassName,
  contentClassName,
  headerClassName,
  overlayTint = 'bg-black/50',
  pinDown = false,
  ...modalProps
}) => {
  const handleOverlayPress = () => {
    if (dismissOnOverlayPress) {
      onClose();
    }
  };

  return (
    <Modal visible={open} transparent onRequestClose={onClose} statusBarTranslucent {...modalProps}>
      <SafeAreaView
        className={clx('flex-1 items-center', pinDown ? 'justify-end' : 'justify-center py-safe px-4', overlayTint)}
      >
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <View
          className={clx(
            'bg-white rounded-4xl px-4 w-full overflow-hidden',
            pinDown ? 'pb-safe pt-4 max-h-[90%]' : 'max-h-full py-4',
            containerClassName,
          )}
        >
          {(title || showCloseButton) && (
            <View className={clx('flex-row mb-4 justify-between gap-2 items-center', headerClassName)}>
              {title && <Text className="text-base">{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} accessibilityLabel="Close dialog">
                  <X size={20} />
                </TouchableOpacity>
              )}
            </View>
          )}

          <View className={contentClassName}>{children}</View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
