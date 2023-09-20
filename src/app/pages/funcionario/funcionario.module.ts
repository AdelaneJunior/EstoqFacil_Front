import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFuncionarioComponent } from './home-funcionario/home-funcionario.component';
import { ListFuncionarioComponent } from './list-funcionario/list-funcionario.component';
import { FormFuncionarioComponent } from './form-funcionario/form-funcionario.component';



@NgModule({
  declarations: [
    HomeFuncionarioComponent,
    ListFuncionarioComponent,
    FormFuncionarioComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FuncionarioModule { }
