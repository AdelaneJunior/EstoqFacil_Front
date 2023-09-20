import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListProdutoComponent} from "./list-produto/list-produto.component";
import {HomeProdutoComponent} from "./home-produto/home-produto.component";
import {FormProdutoComponent} from "./form-produto/form-produto.component";

export const produtoRoutes: Routes = [
  {
    path: "produto",
    component: HomeProdutoComponent,
    children: [
      {
        path: "",
        component: ListProdutoComponent
      },
      {
        path: "novo",
        component: FormProdutoComponent
      }
    ]
  }
];
