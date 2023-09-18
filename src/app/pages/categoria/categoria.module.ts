import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCategoriaComponent } from './home-categoria/home-categoria.component';
import { FormCategoriaComponent } from './form-categoria/form-categoria.component';
import { ListCategoriaComponent } from './list-categoria/list-categoria.component';



@NgModule({
  declarations: [
    HomeCategoriaComponent,
    FormCategoriaComponent,
    ListCategoriaComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CategoriaModule { }
