import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRelatorioComponent} from './home-relatorio/home-relatorio.component';
import {RouterModule, RouterOutlet} from "@angular/router";
import {ListRelatorioComponent} from './list-relatorio/list-relatorio.component';
import {relatorioRoutes} from "./relatorio-routing.module";
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {SearchModule} from "../../arquitetura/search-module/search.module";
import { ProdlistRelatorioComponent } from './prodlist-relatorio/prodlist-relatorio.component';


@NgModule({
  declarations: [
    HomeRelatorioComponent,
    ListRelatorioComponent,
    ProdlistRelatorioComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(relatorioRoutes),
    FlexModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    SearchModule,
  ]
})
export class RelatorioModule {
}
