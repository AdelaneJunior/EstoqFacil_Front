/* tslint:disable */
/* eslint-disable */
export interface MovimentacaoDto {
  acao?: 'VENDA' | 'COMPRA' | 'DEVOLUCAO_DO_CLIENTE' | 'DEVOLUCAO_AO_FORNECEDOR' | 'PRODUTO_QUEBRADO';
  codigo?: number;
  custo?: number;
  data?: string;
  observacao?: string;
  preco?: number;
  produtoCategoriaNome?: string;
  produtoId?: number;
  produtoNome?: string;
  quantidade?: number;
  tipo?: string;
  usuarioId?: number;
  usuarioNome?: string;
}
