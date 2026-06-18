import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { LogoProEstoque } from "@/src/components/LogoProEstoque";
import { Colors, Spacing } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    try {
      await login(email, senha);
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha inválidos.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <LogoProEstoque size="lg" />

        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
          returnKeyType="next"
        />

        <Input
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          isPassword
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <Button
          label="Entrar"
          onPress={handleLogin}
          loading={isLoading}
          fullWidth
        />

        <Button
          label="Criar conta"
          onPress={() => router.push("/(auth)/cadastro")}
          variant="ghost"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing[6], justifyContent: "center", gap: Spacing[2] },
});