import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MovimentacaoControllerService} from "../../../api/services/movimentacao-controller.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {AcaoEnum} from "../../../enums/acao.enum";
import {MovimentacaoDto} from "../../../api/models/movimentacao-dto";
import {ConfirmationDialog} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {ProdutoDto} from "../../../api/models/produto-dto";
import {ProdutoControllerService} from "../../../api/services/produto-controller.service";

@Component({
  selector: 'app-produto-movimentacao-dialog',
  templateUrl: './produto-movimentacao-dialog.component.html',
  styleUrls: ['./produto-movimentacao-dialog.component.scss']
})
export class ProdutoMovimentacaoDialogComponent implements OnInit{
  nomeProduto!: string;
  formGroup!: FormGroup;
  produtoCodigo: number;
  acoesEnum = AcaoEnum;
  produto!: ProdutoDto;

  public constructor(
    private formBuilder: FormBuilder,
    public movimentacaoService: MovimentacaoControllerService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProdutoMovimentacaoDialogComponent>,
    private dialog: MatDialog,
    public produtoService: ProdutoControllerService,
    private securityService: SecurityService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.produtoCodigo = data.codigo;
    this.buscaProduto();
  }


  ngOnInit(): void {
    this.createForm();
  }

  fechar(): void {
    this.dialogRef.close();
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  };

  onSubmit(){
    if(this.formGroup.valid){
      this.realizarInclusao();
      this.fechar();
    }
  }

  buscaProduto(){
    this.produtoService.produtoControllerObterPorId({id: this.produtoCodigo}).subscribe(
      retorno => {
        this.produto = retorno;
        this.nomeProduto = retorno.nome;
      },error => {
        console.log("erro", error);
        this.confirmarErro("Buscar de produto");
      }
    )
  }


  createForm() {
    this.formGroup = this.formBuilder.group({
      quantidade: [null, Validators.required],
      preco: [null, Validators.required],
      custo: [null, Validators.required],
      acao: [null, Validators.required],
      observacao: [null, Validators.required],
    })
  }


  private realizarInclusao() {
    const movimentacao : MovimentacaoDto = this.formGroup.value;
    movimentacao.produtoId = this.produtoCodigo;
    movimentacao.usuarioId = this.securityService.getUserId();
    console.log(movimentacao);
    this.movimentacaoService.movimentacaoControllerIncluir({body: movimentacao})
      .subscribe(retorno => {
        console.log("Retorno:",retorno);
        this.confirmarAcao(retorno);
      }, erro => {
        console.log("Erro:" + erro);
      })
  }

  confirmarAcao(movimentacaoDto: MovimentacaoDto) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Ação de ${movimentacaoDto.acao} dados: ${movimentacaoDto.produtoNome} (ID: ${movimentacaoDto.codigo}) realizada com sucesso!`,
        textoBotoes: {
          ok: 'ok',
        },
      },
    });
  }

  limparFormulario() {
    this.formGroup.reset(); // limpa os campos do formulario.
    this.formGroup.patchValue({
      usuarioId: this.securityService.getUserId()
    });
  }

confirmarErro(acao: String){
  const dialogRef = this.dialog.open(ConfirmationDialog, {
    data: {
      titulo: 'ERRO!!!',
      mensagem: `Erro ao ${acao} \n !`,
      textoBotoes: {
        ok: 'Ok',
      },
    },
  });
}
}
