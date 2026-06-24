import { Colors } from "@/src/constants/theme";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingView({ mensagem = "Carregando..." }: { mensagem?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary[600]} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  texto: { color: Colors.textSecondary, fontSize: 14 },
});