import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeCategoriaComponent} from "./home-categoria/home-categoria.component";
import {ListCategoriaComponent} from "./list-categoria/list-categoria.component";
import {FormCategoriaComponent} from "./form-categoria/form-categoria.component";

export const categoriaRoutes: Routes = [
  {
    path: "categoria",
    component: HomeCategoriaComponent,
    children: [
      {
        path: "",
        component: ListCategoriaComponent
      },
      {
        path: "nova",
        component: FormCategoriaComponent
      }
    ]
  }
];
