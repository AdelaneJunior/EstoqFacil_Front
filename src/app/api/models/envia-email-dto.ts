/* tslint:disable */
/* eslint-disable */
import { ProdutoDto } from './produto-dto';
export interface EnviaEmailDto {
  email?: string;
  listaProdutos?: Array<ProdutoDto>;
}
