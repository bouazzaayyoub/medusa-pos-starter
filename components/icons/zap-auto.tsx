import { Zap } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface ZapAutoProps {
  size?: number;
  color?: string;
}

export function ZapAuto({ size = 24, color = 'white' }: ZapAutoProps) {
  return (
    <View style={{ position: 'relative', width: size, height: size }}>
      <Zap size={size} color={color} />
      <View
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          backgroundColor: color,
          borderRadius: 6,
          width: 12,
          height: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'black',
            fontSize: 8,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 10,
          }}
        >
          A
        </Text>
      </View>
    </View>
  );
}
