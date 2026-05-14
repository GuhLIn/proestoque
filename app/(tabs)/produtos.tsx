import React, { useMemo, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typography } from '../../src/constants/theme';
import { CATEGORIAS, PRODUTOS_MOCK, type Produto } from '../../src/data/mockData';

function getBadgeStyle(status: string) {
  if (status === 'baixo') return { bg: '#fff3cd', text: '#92400e', label: 'Baixo' };
  if (status === 'sem_estoque') return { bg: '#fee2e2', text: '#991b1b', label: 'Sem estoque' };
  return { bg: '#d1fae5', text: '#065f46', label: 'Normal' };
}

function ProdutoItem({ item }: { item: Produto }) {
  const badge = getBadgeStyle(item.status);
  return (
    <View style={styles.produtoItem}>
      <View style={styles.produtoIcone}>
        <Text style={{ fontSize: 20 }}>📦</Text>
      </View>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoQtd}>{item.quantidade} {item.unidade}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
      </View>
    </View>
  );
}

export default function Produtos() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');

  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter(p => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = categoriaSelecionada === 'Todos' || p.categoria === categoriaSelecionada;
      return matchBusca && matchCategoria;
    });
  }, [busca, categoriaSelecionada]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Produtos</Text>
      </View>

      <View style={styles.buscaContainer}>
        <Text style={styles.buscaIcone}>🔍</Text>
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar produto..."
          placeholderTextColor={colors.textMuted}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.chipsContainer}>
        {CATEGORIAS.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategoriaSelecionada(cat)}
            style={[
              styles.chip,
              categoriaSelecionada === cat && styles.chipAtivo,
            ]}
          >
            <Text style={[
              styles.chipText,
              categoriaSelecionada === cat && styles.chipTextAtivo,
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ProdutoItem item={item} />}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioIcone}>🔍</Text>
            <Text style={styles.vazioTexto}>Nenhum produto encontrado</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  titulo: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  buscaIcone: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  buscaInput: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.text,
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  chipTextAtivo: {
    color: colors.white,
  },
  lista: {
    paddingBottom: spacing.xl,
  },
  produtoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  produtoIcone: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
  },
  produtoQtd: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightMedium,
  },
  vazio: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  vazioIcone: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  vazioTexto: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
  },
});