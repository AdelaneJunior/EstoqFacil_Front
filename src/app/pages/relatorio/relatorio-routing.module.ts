import {Routes} from '@angular/router';
import {HomeRelatorioComponent} from "./home-relatorio/home-relatorio.component";
import {SecurityGuard} from "../../arquitetura/security/security.guard";
import {ListRelatorioComponent} from "./list-relatorio/list-relatorio.component";
import {ProdlistRelatorioComponent} from "./prodlist-relatorio/prodlist-relatorio.component";

export const relatorioRoutes: Routes = [
  {
    path: "relatorio",
    component: HomeRelatorioComponent,
    children: [
      {
      path: "",
      component: ListRelatorioComponent,
      canActivate: [SecurityGuard],
      data: {security: {roles: ['ROLE_PRODUTO_INCLUIR', 'ROLE_PRODUTO_ALTERAR']}}
    },
      {
        path:":codigo/:pagina",
        component: ProdlistRelatorioComponent
      }
    ]
  }
]
