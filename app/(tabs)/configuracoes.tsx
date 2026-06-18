import { Button } from "@/src/components/Button";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Configuracoes() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Configurações</Text>

        <View style={styles.perfilCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetra}>
              {user?.nome?.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>
          <View>
            <Text style={styles.nome}>{user?.nome}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <Button
          label="Sair da conta"
          onPress={handleLogout}
          variant="danger"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.background },
  container:   { flex: 1, padding: Spacing[6] },
  titulo:      { fontSize: Typography.fontSize["2xl"], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing[6] },
  perfilCard:  { flexDirection: "row", alignItems: "center", gap: Spacing[4], padding: Spacing[4], backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  avatar:      { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary[600], alignItems: "center", justifyContent: "center" },
  avatarLetra: { color: Colors.white, fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold },
  nome:        { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  email:       { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
});