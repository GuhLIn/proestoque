import { ErrorView } from "@/src/components/ErrorView";
import { LoadingView } from "@/src/components/LoadingView";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { useProducts, type Produto } from "@/src/contexts/ProductsContext";
import { formatarPreco } from "@/src/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getSaudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const alertas = useMemo(
    () => produtos.filter(p => p.quantidade < p.quantidadeMinima),
    [produtos]
  );

  const valorTotalEstoque = useMemo(
    () => produtos.reduce((acc, p) => acc + p.quantidade * p.preco, 0),
    [produtos]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  const cardsResumo = useMemo(() => [
    { id: "total",      titulo: "Produtos",   valor: produtos.length,               icone: "cube-outline" as const },
    { id: "alertas",    titulo: "Alertas",    valor: alertas.length,                icone: "alert-circle-outline" as const },
    { id: "valor",      titulo: "Em Estoque", valor: formatarPreco(valorTotalEstoque), icone: "cash-outline" as const },
  ], [produtos.length, alertas.length, valorTotalEstoque]);

  if (isLoading && produtos.length === 0) {
    return <LoadingView mensagem="Carregando dashboard..." />;
  }

  if (error && produtos.length === 0) {
    return <ErrorView mensagem={error} onRetry={carregarProdutos} />;
  }

  const DashboardHeader = () => (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacao}>{getSaudacao()}, {user?.nome?.split(" ")[0]} 👋</Text>
          <Text style={styles.subtitulo}>Visão geral do estoque</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.nome?.charAt(0).toUpperCase() ?? "?"}
          </Text>
        </View>
      </View>

      <View style={styles.cardsGrid}>
        {cardsResumo.map((card) => (
          <View key={card.id} style={styles.card}>
            <Ionicons name={card.icone} size={20} color={Colors.primary[600]} />
            <Text style={styles.cardValor}>{card.valor}</Text>
            <Text style={styles.cardTitulo}>{card.titulo}</Text>
          </View>
        ))}
      </View>

      {alertas.length > 0 && (
        <View style={styles.alertaBox}>
          <Text style={styles.alertaTitulo}>⚠️ Estoque crítico ({alertas.length})</Text>
          {alertas.slice(0, 3).map((produto) => (
            <View key={produto.id} style={styles.alertaItem}>
              <Text style={styles.alertaNome}>{produto.nome}</Text>
              <Text style={styles.alertaQtd}>
                {produto.quantidade} / {produto.quantidadeMinima} {produto.unidade}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.secaoTitulo}>Produtos recentes</Text>
    </View>
  );

  const renderProduto = ({ item }: { item: Produto }) => {
    const emAlerta = item.quantidade < item.quantidadeMinima;
    const semEstoque = item.quantidade === 0;

    return (
      <View style={styles.produtoItem}>
        <Ionicons
          name={(item.categoria?.icone ?? "cube-outline") as any}
          size={20}
          color={item.categoria?.cor ?? Colors.primary[600]}
        />
        <View style={styles.produtoInfo}>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text style={styles.produtoQtd}>{item.quantidade} {item.unidade}</Text>
        </View>
        <View style={[
          styles.badge,
          semEstoque ? styles.badgeSemEstoque :
          emAlerta ? styles.badgeAlerta : styles.badgeNormal
        ]}>
          <Text style={styles.badgeText}>
            {semEstoque ? "Sem estoque" : emAlerta ? "Baixo" : "Normal"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList<Produto>
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={DashboardHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[600]} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing[8] }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: Spacing[4], paddingTop: Spacing[6] },
  saudacao: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  subtitulo: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary[600], alignItems: "center", justifyContent: "center" },
  avatarText: { color: Colors.white, fontWeight: Typography.fontWeight.bold, fontSize: Typography.fontSize.lg },
  cardsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: Spacing[4], gap: Spacing[3], marginBottom: Spacing[4] },
  card: { width: "47%", backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.border },
  cardValor: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, marginTop: Spacing[1] },
  cardTitulo: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  alertaBox: { marginHorizontal: Spacing[4], marginBottom: Spacing[4], backgroundColor: Colors.warning.bg, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.warning.border },
  alertaTitulo: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.bold, color: Colors.warning.text, marginBottom: Spacing[2] },
  alertaItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing[1] },
  alertaNome: { fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  alertaQtd: { fontSize: Typography.fontSize.sm, color: Colors.danger.text, fontWeight: Typography.fontWeight.bold },
  secaoTitulo: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, paddingHorizontal: Spacing[4], marginBottom: Spacing[2] },
  produtoItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: Spacing[4], paddingVertical: Spacing[3], borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing[3] },
  produtoInfo: { flex: 1 },
  produtoNome: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  produtoQtd: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: Spacing[2], paddingVertical: 3, borderRadius: Radius.full },
  badgeNormal: { backgroundColor: Colors.success.bg },
  badgeAlerta: { backgroundColor: Colors.warning.bg },
  badgeSemEstoque: { backgroundColor: Colors.danger.bg },
  badgeText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
});