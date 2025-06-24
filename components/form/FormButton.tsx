import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useCustomFormContext } from './Form';

interface FormButtonProps {
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

export function FormButton({
  children = 'Submit',
  disabled = false,
  loading = false,
  className = '',
  textClassName = '',
}: FormButtonProps) {
  const { formState } = useFormContext();
  const { handleSubmit } = useCustomFormContext();

  const isDisabled = disabled || loading || !formState.isValid;

  return (
    <TouchableOpacity
      className={`
        bg-black rounded-xl items-center justify-center flex-row p-5
        disabled:bg-gray-100 disabled:text-gray-400
        ${className}
      `}
      onPress={handleSubmit}
      disabled={isDisabled}
    >
      {loading && (
        <ActivityIndicator size="small" color="#2563EB" className="mr-2" />
      )}
      <Text
        className={`
          text-white text-xl
          ${textClassName}
        `}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export default FormButton;
