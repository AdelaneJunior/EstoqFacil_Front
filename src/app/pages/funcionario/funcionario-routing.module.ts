import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeFuncionarioComponent} from "./home-funcionario/home-funcionario.component";
import {ListFuncionarioComponent} from "./list-funcionario/list-funcionario.component";
import {FormFuncionarioComponent} from "./form-funcionario/form-funcionario.component";

export const funcionarioRoutes: Routes = [
  {
    path: "funcionario",
    component: HomeFuncionarioComponent,
    children: [
      {
        path: "",
        component: ListFuncionarioComponent
      },
      {
        path: "novo",
        component: FormFuncionarioComponent
      }
    ]
  }
];
