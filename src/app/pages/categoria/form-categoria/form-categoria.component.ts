import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";

import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoriaControllerService} from "../../../api/services/categoria-controller.service";
import {CategoriaDto} from "../../../api/models/categoria-dto";
import {
  ConfirmationDialog,
  ConfirmationDialogResult
} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {MensagensUniversais} from "../../../../MensagensUniversais";


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
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "categoria", this.snackBar)

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
    if(this.acao == this.ACAO_EDITAR){
      this.categoriaService.categoriaControllerObterPorId({id: this.codigo as number}).
      subscribe(retorno =>
          this.formGroup = this.formBuilder.group({
            nome: [retorno.nome, Validators.required],
            descricao: [retorno.nome, Validators.required],
            usuarioId: this.securityService.getUserId()
          }));
    }else if(this.acao == this.ACAO_INCLUIR){
      this.formGroup = this.formBuilder.group({
        nome: [null, Validators.required],
        descricao: [null, Validators.required],
        usuarioId: this.securityService.getUserId() // Obter o userId do serviço de autenticação
      })
    }
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  };

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
          this.confirmarAcao(retorno, this.ACAO_INCLUIR);
          this.router.navigate(["/categoria"]);
        }, erro => {
          console.log("Erro:" + erro);
          this.mensagens.confirmarErro(this.ACAO_INCLUIR, erro.message)
        });
    }
  }


  limparFormulario() {
    this.formGroup.reset(); // limpa os campos do formulario.
    this.formGroup.patchValue({
      usuarioId: this.securityService.getUserId()
    });
  }


  private prepararEdicao() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId){
      const codigo = parseInt(paramId);
      console.log("codigo",paramId);
      this.categoriaService.categoriaControllerObterPorId({id: codigo}).subscribe(
        retorno => {
          this.acao = this.ACAO_EDITAR;
          console.log("retorno", retorno);
          this.codigo = retorno.codigo || 0;
          this.formGroup.patchValue(retorno);
        },error => {
          console.log("erro", error);
          this.mensagens.confirmarErro(this.ACAO_EDITAR, error.message)
        }
      )
    }
  }

  confirmarAcao(categoriaDto: CategoriaDto, acao: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Ação de ${acao} dados: ${categoriaDto.nome} (ID: ${categoriaDto.codigo}) realizada com sucesso!`,
        textoBotoes: {
          ok: 'ok',
        },
      },
    });
  }

  private realizarEdicao(){
    console.log("Dados:", this.formGroup.value);
    this.categoriaService.categoriaControllerAlterar( {id: this.codigo as number, body: this.formGroup.value})
      .subscribe(retorno => {
        console.log("Retorno:", retorno);
        this.confirmarAcao(retorno, this.ACAO_EDITAR);
        this.router.navigate(["/categoria"]);
      }, erro => {
        console.log("Erro:", erro.error);
        this.mensagens.confirmarErro(this.ACAO_EDITAR, erro.message)
        //this.showError(erro.error, this.ACAO_EDITAR);
      })
  }

}
