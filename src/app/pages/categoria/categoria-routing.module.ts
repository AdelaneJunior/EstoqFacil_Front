import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeCategoriaComponent} from "./home-categoria/home-categoria.component";
import {ListCategoriaComponent} from "./list-categoria/list-categoria.component";
import {FormCategoriaComponent} from "./form-categoria/form-categoria.component";
import {SecurityGuard} from "../../arquitetura/security/security.guard";

export const categoriaRoutes: Routes = [
  {
    path: "categoria",
    component: HomeCategoriaComponent,
    children: [
      {
        path: "",
        component: ListCategoriaComponent,
        canActivate: [SecurityGuard],
        data: {security: {roles: ['ROLE_PRODUTO_INCLUIR', 'ROLE_PRODUTO_ALTERAR']}}
      },
      {
        path: "nova",
        component: FormCategoriaComponent
      }
    ]
  }
];
