import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typography } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';

const MENU_ITEMS = [
  { id: '1', icone: 'notifications-outline', label: 'Notificações' },
  { id: '2', icone: 'color-palette-outline', label: 'Aparência' },
  { id: '3', icone: 'help-circle-outline', label: 'Ajuda' },
];

export default function Configuracoes() {
  const { user, logout } = useAuth();
  const primeiraLetra = user?.nome?.charAt(0).toUpperCase() ?? 'U';

  function handleLogout() {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Configurações</Text>

        <View style={styles.perfilCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{primeiraLetra}</Text>
          </View>
          <View style={styles.perfilInfo}>
            <Text style={styles.perfilNome}>{user?.nome}</Text>
            <Text style={styles.perfilEmail}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
            >
              <Ionicons name={item.icone as any} size={22} color={colors.primary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  titulo: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  perfilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontWeight: typography.fontWeightBold,
    fontSize: typography.fontSizeXl,
  },
  perfilInfo: {
    flex: 1,
  },
  perfilNome: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
  },
  perfilEmail: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.text,
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: typography.fontWeightBold,
    fontSize: typography.fontSizeMd,
  },
});