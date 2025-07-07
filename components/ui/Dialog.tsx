import { X } from '@/components/icons/x';
import { clx } from '@/utils/clx';
import React from 'react';
import { Modal, ModalProps, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

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
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  showCloseButton = true,
  dismissOnOverlayPress = true,
  containerClassName = '',
  contentClassName = '',
  headerClassName = '',
  overlayTint = 'bg-black/50',
  ...modalProps
}) => {
  const handleOverlayPress = () => {
    if (dismissOnOverlayPress) {
      onClose();
    }
  };

  return (
    <Modal visible={open} transparent={true} onRequestClose={onClose} statusBarTranslucent {...modalProps}>
      <View className={clx('flex-1 px-4 justify-center items-center', overlayTint)}>
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <View className={clx('bg-white rounded-2xl p-4 w-full max-h-full', containerClassName)}>
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
      </View>
    </Modal>
  );
};
