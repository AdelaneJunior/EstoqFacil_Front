import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCategoriaComponent } from './home-categoria/home-categoria.component';
import { FormCategoriaComponent } from './form-categoria/form-categoria.component';
import { ListCategoriaComponent } from './list-categoria/list-categoria.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink, RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatMenuModule} from "@angular/material/menu";
import {FlexModule} from "@angular/flex-layout";
import {SearchModule} from "../../arquitetura/search-module/search.module";
@NgModule({
  declarations: [
    HomeCategoriaComponent,
    FormCategoriaComponent,
    ListCategoriaComponent
  ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        RouterOutlet,
        ReactiveFormsModule,
        MatInputModule,
        MatTableModule,
        RouterLink,
        MatPaginatorModule,
        MatMenuModule,
        FlexModule,
        SearchModule
    ]
})
export class CategoriaModule { }
