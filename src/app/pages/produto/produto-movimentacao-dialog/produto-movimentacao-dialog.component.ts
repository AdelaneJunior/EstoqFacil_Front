import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MovimentacaoControllerService} from "../../../api/services/movimentacao-controller.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {AcaoEnum} from "../../../enums/acao.enum";
import {MovimentacaoDto} from "../../../api/models/movimentacao-dto";
import {ConfirmationDialog} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {ProdutoDto} from "../../../api/models/produto-dto";
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-produto-movimentacao-dialog',
  templateUrl: './produto-movimentacao-dialog.component.html',
  styleUrls: ['./produto-movimentacao-dialog.component.scss']
})
export class ProdutoMovimentacaoDialogComponent implements OnInit {
  nomeProduto!: string;
  formGroup!: FormGroup;
  acoesEnum = AcaoEnum;
  produto: ProdutoDto;
  acaoMov!: string;
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "produto", this.snackBar);
  produtoCusto!: number;
  produtoPreco!: number;

  public constructor(
    private formBuilder: FormBuilder,
    public movimentacaoService: MovimentacaoControllerService,
    private dialogRef: MatDialogRef<ProdutoMovimentacaoDialogComponent>,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private securityService: SecurityService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.produto = data.produto;
    this.produtoCusto = this.produto.custo || 0;
    this.produtoPreco = this.produto.preco || 0;
    this.nomeProduto = this.produto.nome || "";
  }


  ngOnInit(): void {
    this.createForm();
    console.log(this.produto);
  }

  fechar(): void {
    this.dialogRef.close();
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  };

  atualizaAcao() {
    this.acaoMov = this.formGroup.value.acao;
    if (this.acaoMov == 'VENDA') {
      this.formGroup.controls['custo'].disable();
      this.formGroup.controls['preco'].enable();
    } else if (this.acaoMov == 'DEVOLUCAO_DO_CLIENTE' || this.acaoMov == 'DEVOLUCAO_AO_FORNECEDOR' || this.acaoMov == 'PRODUTO_QUEBRADO') {
      this.formGroup.controls['custo'].disable();
      this.formGroup.controls['preco'].disable();
    } else {
      this.formGroup.controls['custo'].enable();
      this.formGroup.controls['preco'].enable();
    }
    console.log(this.acaoMov)
  }

  onSubmit() {
    this.formGroup.controls['custo'].enable();
    this.formGroup.controls['preco'].enable();
    if (this.formGroup.valid) {
      this.realizarInclusao();
      this.fechar();
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      quantidade: [null, Validators.required],
      preco: [this.produtoPreco, Validators.required],
      custo: [this.produtoCusto, Validators.required],
      acao: [null, Validators.required],
      observacao: [null, Validators.required],
    })
    this.formGroup.controls['custo'].disable();
    this.formGroup.controls['preco'].disable();
  }


  private realizarInclusao() {
    const movimentacao: MovimentacaoDto = this.formGroup.value;
    movimentacao.produtoId = this.produto.codigo;
    movimentacao.usuarioId = this.securityService.getUserId();
    console.log(movimentacao);
    this.movimentacaoService.movimentacaoControllerIncluir({body: movimentacao})
      .subscribe(retorno => {
        console.log("Retorno:", retorno);
        this.confirmarAcao(retorno, retorno.produtoNome);
      }, erro => {
        this.mensagens.confirmarErro("incluir movimentação", erro.message);
      })
  }

  confirmarAcao(movimentacaoDto: MovimentacaoDto, nome: String) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Cadastro!!',
        mensagem: `Ação de ${movimentacaoDto.acao} dados: ${nome} (ID: ${movimentacaoDto.codigo}) realizada com sucesso!`,
        textoBotoes: {
          ok: 'Confirmar',
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

  confirmarErro(acao: String) {
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
