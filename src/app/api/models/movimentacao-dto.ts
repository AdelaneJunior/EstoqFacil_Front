/* tslint:disable */
/* eslint-disable */
export interface MovimentacaoDto {
  acao?: 'VENDA' | 'COMPRA' | 'DEVOLUCAO_DO_CLIENTE' | 'DEVOLUCAO_AO_FORNECEDOR' | 'PRODUTO_QUEBRADO';
  codigo?: number;
  data?: string;
  observacao?: string;
  produtoId?: number;
  quantidade?: number;
  usuarioId?: number;
}
