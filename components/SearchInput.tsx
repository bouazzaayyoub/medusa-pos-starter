import { Search } from '@/components/icons/search';
import { clx } from '@/utils/clx';
import { TextInput, View } from 'react-native';

export const SearchInput: React.FC<{
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder = 'Search...', className }) => {
  return (
    <View className={clx('relative', className)}>
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-[50%] text-gray-300" />
      <TextInput
        className="rounded-full pb-3 pt-2 pr-4 pl-10 text-base border placeholder:text-gray-300 border-gray-200"
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};
