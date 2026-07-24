import { View, Pressable, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface HardShadowBoxProps {
  children: ReactNode;
  offset?: number;
  shadowColor?: string;
  borderColor?: string;
  radius?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * Fakes the mockup's flat, non-blurred offset shadow (`box-shadow: 4px 4px 0 #171718`),
 * which React Native's native shadow/elevation system can't produce directly.
 * A solid-color view sits behind the content, offset by a fixed amount; on press,
 * the content slides toward it, shrinking the visible gap.
 */
export default function HardShadowBox({
  children,
  offset = theme.shadow.md,
  shadowColor = theme.colors.ink,
  borderColor = theme.colors.ink,
  radius = 0,
  onPress,
  style,
  contentStyle,
}: HardShadowBoxProps) {
  const renderContent = (pressed: boolean) => (
    <View style={{ position: 'relative' }}>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: shadowColor,
            borderRadius: radius,
            transform: [{ translateX: offset }, { translateY: offset }],
          },
        ]}
      />
      <View
        style={[
          {
            borderWidth: theme.borderWidth,
            borderColor,
            borderRadius: radius,
            transform: pressed ? [{ translateX: offset - 2 }, { translateY: offset - 2 }] : undefined,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={style}>
        {({ pressed }) => renderContent(pressed)}
      </Pressable>
    );
  }

  return <View style={style}>{renderContent(false)}</View>;
}
