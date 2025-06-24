import { getProvincesForCountry, hasProvinces } from '@/constants/provinces';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SelectField } from './SelectField';

interface ProvinceFieldProps {
  name: string;
  countryFieldName: string;
  placeholder?: string;
  className?: string;
}

export function ProvinceField({
  name,
  countryFieldName,
  placeholder = 'Province/state (optional)',
  className = '',
}: ProvinceFieldProps) {
  const { control } = useFormContext();
  const countryCode = useWatch({ control, name: countryFieldName });

  if (!countryCode || !hasProvinces(countryCode)) {
    return null;
  }

  const provinces = getProvincesForCountry(countryCode);
  const provinceOptions = provinces.map((province) => ({
    label: province.name,
    value: province.code,
  }));

  if (provinceOptions.length === 0) {
    return null;
  }

  return (
    <SelectField
      name={name}
      placeholder={placeholder}
      options={provinceOptions}
      searchable={true}
      className={className}
    />
  );
}

export default ProvinceField;
