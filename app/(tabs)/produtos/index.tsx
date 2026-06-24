import { ErrorView } from "@/src/components/ErrorView";
import { LoadingView } from "@/src/components/LoadingView";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { useProducts, type Produto } from "@/src/contexts/ProductsContext";
import { useCategorias } from "@/src/hooks/useCategorias";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListaProdutos() {
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const { categorias } = useCategorias();
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase().trim());
      const categoriaOk = categoriaAtiva ? p.categoriaId === categoriaAtiva : true;
      return buscaOk && categoriaOk;
    });
  }, [produtos, busca, categoriaAtiva]);

  const renderProduto = useCallback(({ item }: { item: Produto }) => {
    const emAlerta = item.quantidade < item.quantidadeMinima;
    const semEstoque = item.quantidade === 0;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/produtos/${item.id}`)}
        style={styles.item}
      >
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{item.nome}</Text>
          <Text style={styles.itemQtd}>{item.quantidade} {item.unidade}</Text>
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
      </TouchableOpacity>
    );
  }, []);

  if (isLoading && produtos.length === 0) {
    return <LoadingView mensagem="Buscando produtos..." />;
  }

  if (error && produtos.length === 0) {
    return <ErrorView mensagem={error} onRetry={carregarProdutos} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.buscaContainer}>
              <Ionicons name="search-outline" size={18} color={Colors.neutral[400]} />
              <TextInput
                style={styles.buscaInput}
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar produto..."
                placeholderTextColor={Colors.neutral[400]}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.chips}>
              <TouchableOpacity
                style={[styles.chip, !categoriaAtiva && styles.chipAtivo]}
                onPress={() => setCategoriaAtiva(null)}
              >
                <Text style={[styles.chipText, !categoriaAtiva && styles.chipTextoAtivo]}>Todos</Text>
              </TouchableOpacity>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, categoriaAtiva === cat.id && styles.chipAtivo]}
                  onPress={() => setCategoriaAtiva(p => p === cat.id ? null : cat.id)}
                >
                  <Text style={[styles.chipText, categoriaAtiva === cat.id && styles.chipTextoAtivo]}>
                    {cat.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[600]} />
        }
        ListFooterComponent={<View style={{ height: 80 }} />}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="cube-outline" size={48} color={Colors.neutral[400]} />
            <Text style={styles.vazioText}>Nenhum produto encontrado</Text>
            <TouchableOpacity onPress={() => router.push("/produtos/novo")}>
              <Text style={styles.vazioLink}>Cadastrar produto</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing[4] }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/produtos/novo")}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: Spacing[4], gap: Spacing[3], marginBottom: Spacing[2] },
  buscaContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing[3], gap: Spacing[2], height: 48 },
  buscaInput: { flex: 1, fontSize: Typography.fontSize.md, color: Colors.textPrimary },
  chips: { flexDirection: "row", gap: Spacing[2], flexWrap: "wrap" },
  chip: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderRadius: Radius.full, backgroundColor: Colors.neutral[100] },
  chipAtivo: { backgroundColor: Colors.primary[600] },
  chipText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  chipTextoAtivo: { color: Colors.white },
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: Spacing[4], backgroundColor: Colors.surface, borderRadius: Radius.lg, marginBottom: Spacing[2], borderWidth: 1, borderColor: Colors.border },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  itemQtd: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: Spacing[2], paddingVertical: 3, borderRadius: Radius.full },
  badgeNormal: { backgroundColor: Colors.success.bg },
  badgeAlerta: { backgroundColor: Colors.warning.bg },
  badgeSemEstoque: { backgroundColor: Colors.danger.bg },
  badgeText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  vazio: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: Spacing[3] },
  vazioText: { color: Colors.textSecondary, fontSize: Typography.fontSize.md },
  vazioLink: { color: Colors.primary[600], fontWeight: Typography.fontWeight.semibold, fontSize: Typography.fontSize.sm },
  fab: { position: "absolute", bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary[600], alignItems: "center", justifyContent: "center", elevation: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6 },
});