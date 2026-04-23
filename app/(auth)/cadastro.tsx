import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [errors, setErrors] = useState({ confirmarSenha: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'confirmarSenha' || field === 'senha') {
      setErrors({ confirmarSenha: '' });
    }
  }

  function handleCriarConta() {
    if (form.senha !== form.confirmarSenha) {
      setErrors({ confirmarSenha: 'As senhas não coincidem' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 2000);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <LogoProEstoque size="md" />

        <Text style={styles.title}>Criar conta</Text>

        <Input
          label="Nome completo"
          icon="person-outline"
          placeholder="João Silva"
          value={form.nome}
          onChangeText={(v) => handleChange('nome', v)}
        />

        <Input
          label="E-mail"
          icon="mail-outline"
          placeholder="joao@email.com"
          value={form.email}
          onChangeText={(v) => handleChange('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Senha"
          icon="lock-closed-outline"
          placeholder="••••••"
          value={form.senha}
          onChangeText={(v) => handleChange('senha', v)}
          isPassword
        />

        <Input
          label="Confirmar senha"
          icon="lock-closed-outline"
          placeholder="••••"
          value={form.confirmarSenha}
          onChangeText={(v) => handleChange('confirmarSenha', v)}
          isPassword
          error={errors.confirmarSenha}
        />

        <View style={styles.buttonWrapper}>
          <Button
            label="Criar Conta"
            onPress={handleCriarConta}
            fullWidth
            loading={loading}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>Já tenho conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: spacing.sm,
  },
  loginLink: {
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
  loginLinkText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizeSm,
  },
});