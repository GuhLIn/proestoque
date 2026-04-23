import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { borderRadius, colors, spacing, typography } from '../../src/constants/theme';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  function handleEnviar() {
    setEnviado(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-open-outline" size={40} color={colors.white} />
          </View>

          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.description}>
            Informe seu e-mail e enviaremos um link de recuperação
          </Text>

          {!enviado ? (
            <>
              <Input
                label="E-mail"
                icon="mail-outline"
                placeholder="joao@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Button label="Enviar" onPress={handleEnviar} fullWidth />
            </>
          ) : (
            <>
              <View style={styles.successBox}>
                <Ionicons name="mail-outline" size={36} color={colors.textMuted} style={{ marginBottom: spacing.sm }} />
                <Text style={styles.successTitle}>E-mail enviado!</Text>
                <Text style={styles.successText}>Verifique sua caixa de entrada</Text>
              </View>
              <Button
                label="Voltar ao Login"
                onPress={() => router.back()}
                variant="outline"
                fullWidth
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  backText: {
    color: colors.primary,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightMedium,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  successBox: {
    width: '100%',
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  successText: {
    fontSize: typography.fontSizeSm,
    color: colors.success,
  },
});