import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";

import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {ProdutoControllerService} from "../../../api/services/produto-controller.service";
import {ProdutoDto} from "../../../api/models/produto-dto";
import {CategoriaControllerService} from "../../../api/services/categoria-controller.service";
import {CategoriaDto} from "../../../api/models/categoria-dto";
import {ConfirmationDialog} from "../../../core/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-form-produto',
  templateUrl: './form-produto.component.html',
  styleUrls: ['./form-produto.component.scss']
})
export class FormProdutoComponent implements OnInit{
  formGroup!: FormGroup;
  public readonly ACAO_INCLUIR = "Incluir";
  public readonly ACAO_EDITAR = "Editar";
  acao: string = this.ACAO_INCLUIR;
  codigo!: number;
  categorias: CategoriaDto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    public produtoService: ProdutoControllerService,
    private categoriaService: CategoriaControllerService,
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
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.categoriaService.categoriaControllerListAll().subscribe(
      (categorias: CategoriaDto[]) => {
        this.categorias = categorias;
      },
      (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    );
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
        categoria: [null, Validators.required],
        nome: [null, Validators.required],
        descricao: [null, Validators.required],
        quantidade: [null, Validators.required],
        preco: [null, Validators.required]
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

  private realizarInclusao(){
    console.log("Dados:",this.formGroup.value);
    this.produtoService.produtoControllerIncluir({body: this.formGroup.value})
      .subscribe( retorno =>{
        console.log("Retorno:",retorno);
        this.confirmarInclusao(retorno);
      }, erro =>{
        console.log("Erro:"+erro);
        alert("Erro ao incluir!");
      })
  }

  private realizarEdicao(){}

  confirmarInclusao(produtoDto: ProdutoDto){
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Inclusão de: ${produtoDto.nome} (ID: ${produtoDto.codigo}) realiza com sucesso!`,
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
