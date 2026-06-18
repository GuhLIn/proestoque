import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { CATEGORIAS_MOCK, PRODUTOS_MOCK, type Produto } from "@/src/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListaProdutos() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter((p) => {
      const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase().trim());
      const categoriaOk = categoriaAtiva ? p.categoriaId === categoriaAtiva : true;
      return buscaOk && categoriaOk;
    });
  }, [PRODUTOS_MOCK, busca, categoriaAtiva]);

  const renderProduto = useCallback(({ item }: { item: Produto }) => {
    const emAlerta = item.quantidade < item.quantidadeMinima;
    const semEstoque = item.quantidade === 0;

    return (
      <View style={styles.item}>
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
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.titulo}>Produtos</Text>
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
              {CATEGORIAS_MOCK.map((cat) => (
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
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="cube-outline" size={48} color={Colors.neutral[400]} />
            <Text style={styles.vazioText}>Nenhum produto encontrado</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing[4], paddingBottom: Spacing[10] }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: Spacing[6], gap: Spacing[3], marginBottom: Spacing[2] },
  titulo: { fontSize: Typography.fontSize["2xl"], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  buscaContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing[3], gap: Spacing[2], height: 48 },
  buscaInput: { flex: 1, fontSize: Typography.fontSize.md, color: Colors.textPrimary },
  chips: { flexDirection: "row", gap: Spacing[2], flexWrap: "wrap" },
  chip: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderRadius: Radius.full, backgroundColor: Colors.neutral[100], borderWidth: 1, borderColor: Colors.border },
  chipAtivo: { backgroundColor: Colors.primary[600], borderColor: Colors.primary[600] },
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
});