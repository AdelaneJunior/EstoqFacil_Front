import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/home/home.component";
import {AutenticacaoRoutes} from "./arquitetura/autenticacao/autenticacao.routing";
import {produtoRoutes} from "./pages/produto/produto-routing.module";
import {categoriaRoutes} from "./pages/categoria/categoria-routing.module";
import {funcionarioRoutes} from "./pages/funcionario/funcionario-routing.module";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    children: [
      ...categoriaRoutes,
      ...produtoRoutes,
      ...funcionarioRoutes
    ]
  },
  {
    path: "acesso",
    children: [
      ...AutenticacaoRoutes
    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
