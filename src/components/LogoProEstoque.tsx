import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type LogoSize = "sm" | "md" | "lg";

interface LogoProEstoqueProps {
  size?: LogoSize;
}

const sizeMap = {
  sm: { icon: 24, container: 44, text: Typography.fontSize.md,  sub: Typography.fontSize.xs },
  md: { icon: 32, container: 60, text: Typography.fontSize.lg,  sub: Typography.fontSize.sm },
  lg: { icon: 40, container: 76, text: Typography.fontSize["2xl"], sub: Typography.fontSize.md },
};

export function LogoProEstoque({ size = "md" }: LogoProEstoqueProps) {
  const s = sizeMap[size];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.iconContainer, { width: s.container, height: s.container, borderRadius: Radius.xl }]}>
        <Ionicons name="cube-outline" size={s.icon} color={Colors.white} />
      </View>
      <Text style={[styles.title, { fontSize: s.text }]}>ProEstoque</Text>
      <Text style={[styles.subtitle, { fontSize: s.sub }]}>Bem-vindo de volta</Text>
    </View>
  );
}

export default LogoProEstoque;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: Spacing[8],
  },
  iconContainer: {
    backgroundColor: Colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[3],
  },
  title: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  subtitle: {
    color: Colors.textSecondary,
  },
});