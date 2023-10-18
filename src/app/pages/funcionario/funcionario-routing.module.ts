import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeFuncionarioComponent} from "./home-funcionario/home-funcionario.component";
import {ListFuncionarioComponent} from "./list-funcionario/list-funcionario.component";
import {FormFuncionarioComponent} from "./form-funcionario/form-funcionario.component";
import {SecurityGuard} from "../../arquitetura/security/security.guard";
import {FormProdutoComponent} from "../produto/form-produto/form-produto.component";

export const funcionarioRoutes: Routes = [
  {
    path: "funcionario",
    component: HomeFuncionarioComponent,
    children: [
      {
        path: "",
        component: ListFuncionarioComponent,
        canActivate: [SecurityGuard],
        data: {security: {roles: ['ROLE_PRODUTO_INCLUIR', 'ROLE_PRODUTO_ALTERAR']}}
      },
      {
        path: "novo",
        component: FormFuncionarioComponent
      },
      {
        path: ":id",
        component: FormFuncionarioComponent
      }
    ]
  }
];
