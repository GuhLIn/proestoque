export type StatusEstoque = 'normal' | 'baixo' | 'sem_estoque';

export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  estoqueMinimo: number;
  preco: number;
  status: StatusEstoque;
};

export const CATEGORIAS = ['Todos', 'Bebidas', 'Alimentos', 'Limpeza', 'Papelaria'];

export const PRODUTOS_MOCK: Produto[] = [
  { id: '1', nome: 'Café Especial 250g', categoria: 'Bebidas', quantidade: 4, unidade: 'un', estoqueMinimo: 10, preco: 25.9, status: 'baixo' },
  { id: '2', nome: 'Água Mineral 500ml', categoria: 'Bebidas', quantidade: 48, unidade: 'un', estoqueMinimo: 20, preco: 2.5, status: 'normal' },
  { id: '3', nome: 'Suco de Laranja', categoria: 'Bebidas', quantidade: 6, unidade: 'un', estoqueMinimo: 12, preco: 8.9, status: 'baixo' },
  { id: '4', nome: 'Arroz Branco 5kg', categoria: 'Alimentos', quantidade: 15, unidade: 'cx', estoqueMinimo: 10, preco: 32.9, status: 'normal' },
  { id: '5', nome: 'Feijão Carioca', categoria: 'Alimentos', quantidade: 3, unidade: 'un', estoqueMinimo: 8, preco: 12.5, status: 'baixo' },
  { id: '6', nome: 'Sabão em Pó 3kg', categoria: 'Limpeza', quantidade: 0, unidade: 'cx', estoqueMinimo: 4, preco: 28.9, status: 'sem_estoque' },
  { id: '7', nome: 'Detergente 500ml', categoria: 'Limpeza', quantidade: 22, unidade: 'un', estoqueMinimo: 10, preco: 3.5, status: 'normal' },
  { id: '8', nome: 'Caneta Esferográfica', categoria: 'Papelaria', quantidade: 1, unidade: 'cx', estoqueMinimo: 20, preco: 15.9, status: 'baixo' },
  { id: '9', nome: 'Papel A4', categoria: 'Papelaria', quantidade: 8, unidade: 'resma', estoqueMinimo: 5, preco: 45.0, status: 'normal' },
  { id: '10', nome: 'Macarrão 500g', categoria: 'Alimentos', quantidade: 0, unidade: 'un', estoqueMinimo: 10, preco: 5.9, status: 'sem_estoque' },
];

export const RESUMO_MOCK = {
  totalProdutos: PRODUTOS_MOCK.length,
  alertas: PRODUTOS_MOCK.filter(p => p.status !== 'normal').length,
  categorias: [...new Set(PRODUTOS_MOCK.map(p => p.categoria))].length,
  valorEstoque: PRODUTOS_MOCK.reduce((acc, p) => acc + p.preco * p.quantidade, 0),
};