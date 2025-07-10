import { ChevronDown } from '@/components/icons/chevron-down';
import { Dialog } from '@/components/ui/Dialog';
import { clx } from '@/utils/clx';
import React, { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import DatePicker, { useDefaultStyles } from 'react-native-ui-datepicker';

interface DateRangeFieldProps {
  name: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  errorClassName?: string;
  modalClassName?: string;
  minDate?: Date;
  maxDate?: Date;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export const DateRangeField = ({
  name,
  className,
  buttonClassName,
  errorClassName,
  modalClassName,
  placeholder = 'Select date range',
  minDate = new Date(),
  maxDate,
}: DateRangeFieldProps) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const defaultStyles = useDefaultStyles();

  const [isVisible, setIsVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    startDate: value?.startDate || null,
    endDate: value?.endDate || null,
  });

  useEffect(() => {
    setSelectedRange({
      startDate: value?.startDate || null,
      endDate: value?.endDate || null,
    });
  }, [value]);

  const formatDateRange = (range: DateRange): string => {
    if (!range.startDate && !range.endDate) return '';

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    if (range.startDate && range.endDate) {
      return `${formatDate(range.startDate)} - ${formatDate(range.endDate)}`;
    } else if (range.startDate) {
      return `${formatDate(range.startDate)} - Select end date`;
    } else if (range.endDate) {
      return `Select start date - ${formatDate(range.endDate)}`;
    }

    return '';
  };

  const handleDateChange = (params: any) => {
    let newRange: DateRange;

    if (params.startDate && params.endDate) {
      newRange = {
        startDate: new Date(params.startDate),
        endDate: new Date(params.endDate),
      };
    } else if (params.startDate) {
      newRange = {
        ...selectedRange,
        startDate: new Date(params.startDate),
      };
    } else if (params.endDate) {
      newRange = {
        ...selectedRange,
        endDate: new Date(params.endDate),
      };
    } else if (params.range) {
      newRange = {
        startDate: params.range.startDate ? new Date(params.range.startDate) : null,
        endDate: params.range.endDate ? new Date(params.range.endDate) : null,
      };
    } else {
      return;
    }

    setSelectedRange(newRange);
    onChange(newRange);
  };

  const displayValue = formatDateRange(value || { startDate: null, endDate: null });

  return (
    <View className={className}>
      <TouchableOpacity
        className={clx(
          'bg-white rounded-full gap-2 p-3 justify-center border border-border flex-row items-center',
          error && 'border-red',
          buttonClassName,
        )}
        onPress={() => {
          setSelectedRange({
            startDate: value?.startDate || null,
            endDate: value?.endDate || null,
          });
          setIsVisible(true);
        }}
      >
        <Text className={displayValue ? 'flex-1 flex-wrap' : 'text-lg'}>{displayValue || placeholder}</Text>
        <ChevronDown size={24} className="mt-1" />
      </TouchableOpacity>

      {error && <Text className={clx('text-red text-sm mt-1', errorClassName)}>{error.message}</Text>}

      <Dialog
        open={isVisible}
        onClose={() => setIsVisible(false)}
        showCloseButton={false}
        animationType="slide"
        pinDown
      >
        <DatePicker
          mode="range"
          startDate={selectedRange.startDate}
          endDate={selectedRange.endDate}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          styles={{ ...defaultStyles, today: { backgroundColor: '#B1E4F2' } }}
        />
      </Dialog>
    </View>
  );
};
