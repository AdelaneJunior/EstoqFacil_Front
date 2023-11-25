import {Routes} from '@angular/router';
import {HomeUsuarioComponent} from "./home-usuario/home-usuario.component";
import {ListUsuarioComponent} from "./list-usuario/list-usuario.component";
import {FormUsuarioComponent} from "./form-usuario/form-usuario.component";
import {SecurityGuard} from "../../arquitetura/security/security.guard";

export const usuarioRoutes: Routes = [
  {
    path: "usuario",
    component: HomeUsuarioComponent,
    children: [
      {
        path: "",
        component: ListUsuarioComponent,
        canActivate: [SecurityGuard],
        data: {security: {roles: ['ROLE_PRODUTO_INCLUIR', 'ROLE_PRODUTO_ALTERAR']}}
      },
      {
        path: "novo",
        component: FormUsuarioComponent
      },
      {
        path: ":id",
        component: FormUsuarioComponent
      }
    ]
  }
];
