import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";

import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {ProdutoControllerService} from "../../../api/services/produto-controller.service";
import {ProdutoDto} from "../../../api/models/produto-dto";
import {CategoriaControllerService} from "../../../api/services/categoria-controller.service";
import {CategoriaDto} from "../../../api/models/categoria-dto";
import {
  ConfirmationDialog,
  ConfirmationDialogResult
} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {UsuarioDto} from "../../../api/models/usuario-dto";
import {ImagemControllerService} from "../../../api/services/imagem-controller.service";
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {MessageService} from "../../../arquitetura/message/message.service";

@Component({
  selector: 'app-form-produto',
  templateUrl: './form-produto.component.html',
  styleUrls: ['./form-produto.component.scss']
})
export class FormProdutoComponent implements OnInit{
  formGroup!: FormGroup;
  public readonly ACAO_INCLUIR = "Cadastrar";
  public readonly ACAO_EDITAR = "Editar";
  acao: string = this.ACAO_INCLUIR;
  codigo!: number;
  categorias: CategoriaDto[] = [];
  imagemId!: number | undefined;
  imagem_path!: string | undefined;
  imagemIdAntigo!: number | undefined;
  selectedFile!: File;
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, 'produto', this.snackBar)
  flexDivAlinhar: string = 'row';
  admin!: boolean;
  innerWidth: number = window.innerWidth;

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
    private imagemService: ImagemControllerService,
    private messageService: MessageService
  ) {
    this._adapter.setLocale('pt-br');
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
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
        this.mensagens.confirmarErro('Carregar Categorias', error.message)
      }
    );
  }

  private createForm() {
    if(this.acao == "Editar"){
      this.produtoService.produtoControllerObterPorId({id: this.codigo as number}).
      subscribe(retorno =>
          this.formGroup = this.formBuilder.group({
            categoriaId: [retorno.categoriaId, Validators.required],
            codigoBarras: [retorno.categoriaId, Validators.required],
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
        codigoBarras: [null, Validators.required],
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
    this.erroImagem();
  }

  private realizarInclusao(){
    const prod : ProdutoDto = this.formGroup.value;
    prod.usuarioId = this.securityService.getUserId();
    console.log("Dados:", prod);
    this.produtoService.produtoControllerIncluir({body: prod})
      .subscribe( retorno =>{
        console.log("Retorno:",retorno);
        this.confirmarAcao(retorno, this.ACAO_INCLUIR);
        this.router.navigate(["/produto"]);
      }, erro =>{
        console.log("Erro:"+erro);
        this.mensagens.confirmarErro(this.ACAO_INCLUIR, erro.message)
      })
  }

  limparFormulario() {
    this.formGroup.reset(); // limpa os campos do formulario.
    this.formGroup.patchValue({
      usuarioId: this.securityService.getUserId()
    });
    this.imagemId = 0;
    this.imagemIdAntigo = 0;
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
          this.mensagens.confirmarErro(this.ACAO_EDITAR, error.message);
        }
      )
    }
  }

  confirmarAcao(produtoDto: ProdutoDto, acao: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Cadastro!',
        mensagem: `Ação de ${acao} dados: ${produtoDto.nome} (ID: ${produtoDto.codigo}) realizada com sucesso!`,
        textoBotoes: {
          ok: 'Confirmar',
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
        this.mensagens.confirmarErro(this.ACAO_EDITAR, erro.message);
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
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'TEM CERTEZA QUE DESEJA CANCELAR ?',
        textoBotoes: {
          ok: 'Sim',
          cancel: 'Não',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: ConfirmationDialogResult) => {
      if (confirmed?.resultado) {
        this.router.navigate(["/produto"]);
      }
    });
  }

  erroImagem(){
    if(!this.imagemId && !this.imagemIdAntigo)
      this.mensagens.confirmarErro(this.ACAO_INCLUIR, "Insira uma imagem para incluir!")
  }

  mudarAlinhar() {

    if(this.innerWidth < 1000)
    {
      return this.flexDivAlinhar = "column";
    }
    return this.flexDivAlinhar = "row";

  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.innerWidth = window.innerWidth;
  }

  protected readonly parseInt = parseInt;
}
