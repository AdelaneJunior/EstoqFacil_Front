import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ReactiveFormsModule} from "@angular/forms";
import {MatNativeDateModule} from "@angular/material/core";
import {ListProdutoComponent} from "./list-produto/list-produto.component";
import {HomeProdutoComponent} from "./home-produto/home-produto.component";
import {FormProdutoComponent} from "./form-produto/form-produto.component";
import {produtoRoutes} from "./produto-routing.module";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatMenuModule} from "@angular/material/menu";
import {FlexModule} from "@angular/flex-layout";

@NgModule({
  declarations: [
    ListProdutoComponent,
    HomeProdutoComponent,
    FormProdutoComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(produtoRoutes),
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatMenuModule,
        FlexModule
    ]
})
export class ProdutoModule { }
