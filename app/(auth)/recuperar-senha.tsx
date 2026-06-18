import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleEnviar() {
    setEnviado(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary[600]} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-open-outline" size={40} color={Colors.white} />
          </View>

          <Text style={styles.titulo}>Recuperar senha</Text>
          <Text style={styles.descricao}>
            Informe seu e-mail e enviaremos um link de recuperação
          </Text>

          {!enviado ? (
            <>
              <Input
                label="E-mail"
                leftIcon="mail-outline"
                placeholder="seu@email.com"
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
                <Ionicons name="mail-outline" size={36} color={Colors.success.text} style={{ marginBottom: Spacing[2] }} />
                <Text style={styles.successTitulo}>E-mail enviado!</Text>
                <Text style={styles.successTexto}>Verifique sua caixa de entrada</Text>
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
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  backButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: Spacing[4], paddingTop: Spacing[4], gap: Spacing[1] },
  backText: { color: Colors.primary[600], fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.medium },
  container: { flex: 1, paddingHorizontal: Spacing[6], paddingTop: Spacing[6], alignItems: "center" },
  iconContainer: { width: 76, height: 76, borderRadius: Radius.xl, backgroundColor: Colors.primary[600], alignItems: "center", justifyContent: "center", marginBottom: Spacing[4] },
  titulo: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing[2] },
  descricao: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, textAlign: "center", marginBottom: Spacing[6] },
  successBox: { width: "100%", backgroundColor: Colors.success.bg, borderRadius: Radius.lg, padding: Spacing[6], alignItems: "center", marginBottom: Spacing[4], borderWidth: 1, borderColor: Colors.success.border },
  successTitulo: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold, color: Colors.success.text, marginBottom: Spacing[1] },
  successTexto: { fontSize: Typography.fontSize.sm, color: Colors.success.text },
});