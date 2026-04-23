import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, typography } from '../constants/theme';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProEstoqueProps {
  size?: LogoSize;
}

const sizeMap = {
  sm: { icon: 24, container: 44, text: typography.fontSizeMd, sub: typography.fontSizeXs },
  md: { icon: 32, container: 60, text: typography.fontSizeLg, sub: typography.fontSizeSm },
  lg: { icon: 40, container: 76, text: typography.fontSizeXl, sub: typography.fontSizeMd },
};

export function LogoProEstoque({ size = 'md' }: LogoProEstoqueProps) {
  const s = sizeMap[size];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.iconContainer, { width: s.container, height: s.container, borderRadius: borderRadius.lg }]}>
        <Ionicons name="cube-outline" size={s.icon} color={colors.white} />
      </View>
      <Text style={[styles.title, { fontSize: s.text }]}>ProEstoque</Text>
      <Text style={[styles.subtitle, { fontSize: s.sub }]}>Bem-vindo de volta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
  },
});