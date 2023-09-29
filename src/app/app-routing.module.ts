import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/home/home.component";
import {AutenticacaoRoutes} from "./arquitetura/autenticacao/autenticacao.routing";
import {produtoRoutes} from "./pages/produto/produto-routing.module";
import {categoriaRoutes} from "./pages/categoria/categoria-routing.module";
import {funcionarioRoutes} from "./pages/funcionario/funcionario-routing.module";
import {SecurityGuard} from "./arquitetura/security/security.guard";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      ...categoriaRoutes,
      ...produtoRoutes,
      ...funcionarioRoutes
    ],
    canActivate: [SecurityGuard],
    data: {security: {roles: ['ROLE_PRODUTO_INCLUIR', 'ROLE_PRODUTO_ALTERAR']}}
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
