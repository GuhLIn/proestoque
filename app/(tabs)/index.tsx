import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderRadius, colors, shadows, spacing, typography } from '../../src/constants/theme';
import { PRODUTOS_MOCK, RESUMO_MOCK, type Produto } from '../../src/data/mockData';

const CARDS_RESUMO = [
  { id: '1', label: 'Produtos', valor: RESUMO_MOCK.totalProdutos, icone: '📦', cor: colors.primaryLight },
  { id: '2', label: 'Alertas', valor: RESUMO_MOCK.alertas, icone: '⚠️', cor: '#fff3cd' },
  { id: '3', label: 'Categorias', valor: RESUMO_MOCK.categorias, icone: '🗂️', cor: '#d1fae5' },
  { id: '4', label: 'Em Estoque', valor: `R$ ${RESUMO_MOCK.valorEstoque.toFixed(0)}`, icone: '💰', cor: '#d1fae5' },
];

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

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const produtosCriticos = PRODUTOS_MOCK.filter(p => p.status !== 'normal');

  const ListHeader = () => (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacao}>Olá, João 👋</Text>
          <Text style={styles.subtitulo}>Visão geral do estoque</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
      </View>

      <View style={styles.cardsGrid}>
        {CARDS_RESUMO.map(card => (
          <View key={card.id} style={[styles.card, { backgroundColor: card.cor }]}>
            <Text style={styles.cardIcone}>{card.icone}</Text>
            <Text style={styles.cardValor}>{card.valor}</Text>
            <Text style={styles.cardLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      {produtosCriticos.length > 0 && (
        <View style={styles.alertaBox}>
          <Text style={styles.alertaTitulo}>⚠️ Estoque crítico ({produtosCriticos.length})</Text>
          {produtosCriticos.slice(0, 3).map(p => (
            <View key={p.id} style={styles.alertaItem}>
              <Text style={styles.alertaNome}>{p.nome}</Text>
              <Text style={styles.alertaQtd}>{p.quantidade}/{p.estoqueMinimo}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.secaoTitulo}>Produtos recentes</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={PRODUTOS_MOCK}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ProdutoItem item={item} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
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
  container: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  saudacao: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
  },
  subtitulo: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: typography.fontWeightBold,
    fontSize: typography.fontSizeLg,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    width: '47%',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  cardIcone: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  cardValor: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
  },
  cardLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  alertaBox: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: '#fff3cd',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  alertaTitulo: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: '#92400e',
    marginBottom: spacing.sm,
  },
  alertaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  alertaNome: {
    fontSize: typography.fontSizeSm,
    color: colors.text,
  },
  alertaQtd: {
    fontSize: typography.fontSizeSm,
    color: '#ef4444',
    fontWeight: typography.fontWeightBold,
  },
  secaoTitulo: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
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
});