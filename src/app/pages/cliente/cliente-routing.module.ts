import {Routes} from '@angular/router';
import {HomeClienteComponent} from "./home-cliente/home-cliente.component";
import {ListClienteComponent} from "./list-cliente/list-cliente.component";
import {FormClienteComponent} from "./form-cliente/form-cliente.component";
import {SecurityGuard} from "../../arquitetura/security/security.guard";

export const clienteRoutes: Routes = [
  {
    path: "cliente",
    component: HomeClienteComponent,
    children: [
      {
        path: "",
        component: ListClienteComponent,
        canActivate: [SecurityGuard],
        data: {security: {roles: ['ROLE_PRODUTO_INCLUIR', 'ROLE_PRODUTO_ALTERAR']}}
      },
      {
        path: "novo",
        component: FormClienteComponent
      },
      {
        path: ":id",
        component: FormClienteComponent
      }
    ]
  }
];
