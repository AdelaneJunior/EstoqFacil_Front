import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from "@angular/material/menu";
import {HomeClienteComponent} from "./home-cliente/home-cliente.component";
import {FormClienteComponent} from "./form-cliente/form-cliente.component";
import {ListClienteComponent} from "./list-cliente/list-cliente.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {SearchModule} from "../../arquitetura/search-module/search.module";
import {FlexModule} from "@angular/flex-layout";
import {NgxMaskDirective} from "ngx-mask";


@NgModule({
  declarations: [
    HomeClienteComponent,
    FormClienteComponent,
    ListClienteComponent
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
        MatDatepickerModule,
        SearchModule,
        FlexModule,
        NgxMaskDirective
    ]
})
export class ClienteModule { }
