/* tslint:disable */
/* eslint-disable */
import { CargoPermissaoDto } from './cargo-permissao-dto';
export interface CargoDto {
  codigo?: number;
  nome?: string;
  permissoes?: Array<CargoPermissaoDto>;
}
