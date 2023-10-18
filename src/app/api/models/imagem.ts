/* tslint:disable */
/* eslint-disable */
import { IEntidadeObject } from './i-entidade-object';
export interface Imagem {
  blob?: Array<string>;
  compositePkEntidadeObject?: number;
  foreignEntitiesMaps?: {
[key: string]: IEntidadeObject;
};
  id?: number;
  idHash?: string;
  new?: boolean;
  tabelaNome?: string;
}
