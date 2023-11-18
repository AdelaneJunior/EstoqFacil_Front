/* tslint:disable */
/* eslint-disable */
import { ProdutoDto } from './produto-dto';
export interface EnviaEmailDto {
  desconto?: number;
  email?: string;
  listaProdutos?: Array<ProdutoDto>;
  promocao?: boolean;
}
