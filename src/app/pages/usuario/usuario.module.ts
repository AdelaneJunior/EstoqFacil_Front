import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeUsuarioComponent} from "./home-usuario/home-usuario.component";
import {FormUsuarioComponent} from "./form-usuario/form-usuario.component";
import {ListUsuarioComponent} from "./list-usuario/list-usuario.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatMenuModule} from "@angular/material/menu";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";



@NgModule({
  declarations: [
    HomeUsuarioComponent,
    FormUsuarioComponent,
    ListUsuarioComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule
  ]
})
export class UsuarioModule { }
