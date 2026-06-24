import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { LogoProEstoque } from "@/src/components/LogoProEstoque";
import { Colors, Spacing, Typography } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FormFields = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export default function Cadastro() {
  const { registrar } = useAuth();
  const [form, setForm] = useState<FormFields>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormFields> = {};
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!form.email.includes("@") || !form.email.includes(".")) newErrors.email = "Informe um e-mail válido";
    if (form.senha.length < 6) newErrors.senha = "A senha deve ter pelo menos 6 caracteres";
    if (form.senha !== form.confirmarSenha) newErrors.confirmarSenha = "As senhas não coincidem";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCadastro = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registrar(form.nome, form.email, form.senha);
      // NavigationGuard redireciona automaticamente para /(tabs)
    } catch (error: any) {
      console.log("ERRO COMPLETO:", error.message, error.response?.data, error.code);
      Alert.alert("Erro ao criar conta", error.message ?? "Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <LogoProEstoque size="md" />

        <Input
          label="Nome completo"
          value={form.nome}
          onChangeText={(v) => updateField("nome", v)}
          error={errors.nome}
          leftIcon="person-outline"
          autoCapitalize="words"
          returnKeyType="next"
        />
        <Input
          label="E-mail"
          value={form.email}
          onChangeText={(v) => updateField("email", v)}
          error={errors.email}
          leftIcon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />
        <Input
          label="Senha"
          value={form.senha}
          onChangeText={(v) => updateField("senha", v)}
          error={errors.senha}
          leftIcon="lock-closed-outline"
          isPassword
          returnKeyType="next"
        />
        <Input
          label="Confirmar senha"
          value={form.confirmarSenha}
          onChangeText={(v) => updateField("confirmarSenha", v)}
          error={errors.confirmarSenha}
          leftIcon="lock-closed-outline"
          isPassword
          returnKeyType="done"
          onSubmitEditing={handleCadastro}
        />

        <Button label="Criar Conta" onPress={handleCadastro} loading={loading} fullWidth />

        <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>Já tenho conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: Spacing[6] },
  loginLink: { alignSelf: "center", marginTop: Spacing[4] },
  loginLinkText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
});