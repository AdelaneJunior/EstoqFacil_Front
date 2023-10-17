import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListProdutoComponent} from "./list-produto/list-produto.component";
import {HomeProdutoComponent} from "./home-produto/home-produto.component";
import {FormProdutoComponent} from "./form-produto/form-produto.component";
import {SecurityGuard} from "../../arquitetura/security/security.guard";

export const produtoRoutes: Routes = [
  {
    path: "produto",
    component: HomeProdutoComponent,
    children: [
      {
        path: "",
        component: ListProdutoComponent,
        canActivate: [SecurityGuard],
        data: {security: {roles: ['ROLE_PRODUTO_INCLUIR', 'ROLE_PRODUTO_ALTERAR']}}
      },
      {
        path: "novo",
        component: FormProdutoComponent
      },
      {
        path: ":id",
        component: FormProdutoComponent
      }
    ]
  }
];
