import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";

import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoriaControllerService} from "../../../api/services/categoria-controller.service";
import {CategoriaDto} from "../../../api/models/categoria-dto";
import {ConfirmationDialog} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {SecurityService} from "../../../arquitetura/security/security.service";


@Component({
  selector: 'app-form-categoria',
  templateUrl: './form-categoria.component.html',
  styleUrls: ['./form-categoria.component.scss']
})
export class FormCategoriaComponent implements OnInit{
  formGroup!: FormGroup;
  public readonly ACAO_INCLUIR = "Cadastro";
  public readonly ACAO_EDITAR = "Editar";
  acao: string = this.ACAO_INCLUIR;
  codigo!: number;

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private categoriaService: CategoriaControllerService,
    private securityService: SecurityService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this._adapter.setLocale('pt-br');
  }

  ngOnInit() {
    this.createForm();
    this._adapter.setLocale('pt-br');
    this.prepararEdicao();
  }



  private createForm() {
    if(this.acao == "Editar"){/*
      this.produtoService.produtoControllerObterPorId({id: this.codigo as number}).
      subscribe(retorno =>
          this.formGroup = this.formBuilder.group({
            titulo: [retorno.titulo, Validators.required],
            autor: [retorno.autor, Validators.required],
            editora: [retorno.editora, Validators.required],
            anoPublicacao: [retorno.anoPublicacao, Validators.required],
            genero: [retorno.genero, Validators.required],
            numeroDePaginas: [retorno.numeroDePaginas, Validators.required]
          }));*/
    }else{
      this.formGroup = this.formBuilder.group({
        nome: [null, Validators.required],
        descricao: [null, Validators.required],
        usuarioId: this.securityService.getUserId() // Obter o userId do serviço de autenticação
      })
    }
  }



  onSubmit() {
    if (this.formGroup.valid) {
      if(!this.codigo){
        this.realizarInclusao();
      }else{
        this.realizarEdicao();
      }
    }

  }

  private realizarInclusao() {
    if (this.formGroup.valid) {
      const dadosFormulario : CategoriaDto =  {
        ...this.formGroup.value
      };

      console.log("Dados:", dadosFormulario);

      this.categoriaService.categoriaControllerIncluir({ body: dadosFormulario }) // Usar dadosFormulario em vez de this.formGroup.value
        .subscribe(retorno => {
          console.log("Retorno:", retorno);
          this.confirmarInclusao(retorno);
          this.router.navigate(["/categoria"]);
        }, erro => {
          console.log("Erro:" + erro);
          alert("Erro ao incluir!");
        });
    }
  }

  private realizarEdicao(){}

  confirmarInclusao(categoriaDto: CategoriaDto){
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Inclusão de: ${categoriaDto.nome} (ID: ${categoriaDto.codigo}) realiza com sucesso!`,
        textoBotoes: {
          ok: 'ok',
        },
      },
    });
  }


  limparFormulario() {
    this.formGroup.reset(); // limpa os campos do formulario.
  }


  private prepararEdicao() {

  }
}
