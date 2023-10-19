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
import {SecurityService} from "../../../arquitetura/security/security.service";
import {UsuarioDto} from "../../../api/models/usuario-dto";
import {ImagemControllerService} from "../../../api/services/imagem-controller.service";

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
  imagemId!: number | undefined;
  imagem_path!: string | undefined;
  imagemIdAntigo!: number | undefined;
  selectedFile!: File;

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    public produtoService: ProdutoControllerService,
    private categoriaService: CategoriaControllerService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private securityService: SecurityService,
    private imagemService: ImagemControllerService
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
    if(this.acao == "Editar"){
      this.produtoService.produtoControllerObterPorId({id: this.codigo as number}).
      subscribe(retorno =>
          this.formGroup = this.formBuilder.group({
            categoriaId: [retorno.categoriaId, Validators.required],
            nome: [retorno.nome, Validators.required],
            marca: [retorno.marca, Validators.required],
            descricao: [retorno.descricao, Validators.required],
            quantidade: [retorno.quantidade, Validators.required],
            preco: [retorno.preco, Validators.required],
            custo: [retorno.custo, Validators.required],
            imagemId: [retorno.imagemId, Validators.required],
            usuarioId: [this.securityService.getUserId()]
          }));
    }else{
      this.formGroup = this.formBuilder.group({
        categoriaId: [null, Validators.required],
        nome: [null, Validators.required],
        marca: [null, Validators.required],
        descricao: [null, Validators.required],
        quantidade: [null, Validators.required],
        preco: [null, Validators.required],
        custo: [null, Validators.required],
        imagemId:[null, Validators.required],
        usuarioId:[this.securityService.getUserId()]
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
    const prod : ProdutoDto = this.formGroup.value;
    prod.usuarioId = this.securityService.getUserId();
    console.log("Dados:", prod);
    this.produtoService.produtoControllerIncluir({body: prod})
      .subscribe( retorno =>{
        console.log("Retorno:",retorno);
        this.confirmarInclusao(retorno);
        this.router.navigate(["/produto"]);
      }, erro =>{
        console.log("Erro:"+erro);
        alert("Erro ao incluir!");
      })
  }


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
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId){
      const codigo = parseInt(paramId);
      console.log("codigo",paramId);
      this.produtoService.produtoControllerObterPorId({id: codigo}).subscribe(
        retorno => {
          this.acao = this.ACAO_EDITAR;
          console.log("retorno", retorno);
          this.codigo = retorno.codigo || 0;
          this.imagemId = retorno.imagemId;
          this.imagemIdAntigo = retorno.imagemId;
          this.formGroup.patchValue(retorno);
        },error => {
          console.log("erro", error);
        }
      )
    }
  }

  confirmarAcao(produtoDto: ProdutoDto, acao: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Ação de ${acao} dados: ${produtoDto.nome} (ID: ${produtoDto.codigo}) realizada com sucesso!`,
        textoBotoes: {
          ok: 'ok',
        },
      },
    });
  }

  private realizarEdicao(){
    console.log("Dados:", this.formGroup.value);
    const produto: ProdutoDto = this.formGroup.value;
    this.produtoService.produtoControllerAlterar( {id: this.codigo as number, body: produto})
      .subscribe(retorno => {
        if(this.imagemIdAntigo && retorno.imagemId != this.imagemIdAntigo){
          this.imagemService.imagemControllerExcluirFoto({id: this.imagemIdAntigo}).subscribe();
        }
        console.log("Retorno:", retorno);
        this.confirmarAcao(retorno, this.ACAO_EDITAR);
        this.router.navigate(["/produto"]);
      }, erro => {
        console.log("Erro:", erro.error);
        //this.showError(erro.error, this.ACAO_EDITAR);
      })
  }

  onFileChanged(event: Event) {
    if(event){
      // @ts-ignore
      this.selectedFile = <File>event.target.files[0];
      // @ts-ignore
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imagem_path = event.target.result;
        }
      }
      this.imagemService.imagemControllerUploadImagem({body: {imagemASalvar: this.selectedFile}}).subscribe(
        retorno => {
          this.imagemId = retorno.id;
          this.formGroup.patchValue({imagemId: this.imagemId});
          console.log(this.formGroup.value);
        }
      );
    }
  }

  cancelar(){
    if(this.imagemIdAntigo){
      if(this.imagemId && this.imagemIdAntigo != this.imagemId){
        this.imagemService.imagemControllerExcluirFoto({id: this.imagemId}).subscribe();
      }
    } else if (this.imagemId){
      this.imagemService.imagemControllerExcluirFoto({id: this.imagemId}).subscribe();
    }
    this.router.navigateByUrl('/produto');
  }

}
