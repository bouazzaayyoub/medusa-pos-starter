import { Zap } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface ZapAutoProps {
  size?: number;
  color?: string;
}

export function ZapAuto({ size = 24, color = 'white' }: ZapAutoProps) {
  return (
    <View className="relative" style={{ width: size, height: size }}>
      <Zap size={size} color={color} />
      <View
        className="absolute bottom-[-2px] right-[-2px] rounded-md w-3 h-3 justify-center items-center"
        style={{
          backgroundColor: color,
        }}
      >
        <Text className="text-black text-[8px] font-bold text-center leading-[10px]">
          A
        </Text>
      </View>
    </View>
  );
}
