import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from '@angular/router';
import {ProdutoControllerService} from "../../../api/services/produto-controller.service";
import {ProdutoDto} from "../../../api/models/produto-dto";
import {
  ConfirmationDialog,
  ConfirmationDialogResult
} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {EnvioMensagemComponent} from "../../../core/envio-mensagem/envio-mensagem.component";
import {ImagemControllerService} from "../../../api/services/imagem-controller.service";

@Component({
  selector: 'app-list-produto',
  templateUrl: './list-produto.component.html',
  styleUrls: ['./list-produto.component.scss']
})


export class ListProdutoComponent implements OnInit {

  colunasMostrar = ['check', 'codigo', 'codigoBarras', 'imagem', 'categoriaId', 'nome', 'descricao', 'marca', 'quantidade', 'preco', 'acao'];
  produtoListaDataSource: MatTableDataSource<ProdutoDto> = new MatTableDataSource<ProdutoDto>();
  listProdutosEnviar: Array<ProdutoDto> = [];
  listProdutosAux: Array<ProdutoDto> = [];
  linhaSelecionada!: ProdutoDto;
  allChecked: boolean = false;

  constructor(
    public produtoService: ProdutoControllerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private imagemService: ImagemControllerService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.buscarDados();
  }

  selectAll(completed: boolean) {
    this.listProdutosEnviar = [];
    this.allChecked = completed;
    if (this.allChecked) {
      this.produtoService.produtoControllerListAll({}).subscribe(
        retorno => {
          this.listProdutosAux = retorno;
          this.listProdutosAux.forEach(produto => {
            this.selecionarLinha(produto);
          })
          console.log(this.listProdutosEnviar);
        }
      )
    }
  }

  private buscarDados() {
    this.produtoService.produtoControllerListAll().subscribe(data => {
      this.produtoListaDataSource.data = data;
      console.log(JSON.stringify(data));
    })
  }

  showResult($event: any[]) {
    this.produtoListaDataSource.data = $event;
  }

  remover(produtoDto: ProdutoDto) {
    console.log("Removido", produtoDto.codigo);
    let codigoDoProduto: number = produtoDto.codigo || 0;
    this.produtoService.produtoControllerRemover({id: codigoDoProduto})
      .subscribe(
        retorno => {
          this.imagemService.imagemControllerExcluirFoto({id: retorno.imagemId}).subscribe();
          this.buscarDados();
          if (retorno != null) {
            this.showMensagemSimples("Excluído com sucesso!", 5000);
            console.log("Exclusão:", retorno);
          }
          this.showMensagemSimples("Erro ao excluir, existe movimentação no produto!", 5000);
        }
      );
  }


  confirmarExcluir(produtoDto: ProdutoDto) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Confirmar?',
        mensagem: `A exclusão de: ${produtoDto.nome} (ID: ${produtoDto.codigo})?`,
        textoBotoes: {
          ok: 'Confirmar',
          cancel: 'Cancelar',
        },
        dado: produtoDto
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: ConfirmationDialogResult) => {
      if (confirmed?.resultado) {
        this.remover(confirmed.dado);
      }
    });
  }

  showMensagemSimples(mensagem: string, duracao: number = 2000) {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: duracao,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  enviarproduto() {
    const dialogEnviarMensagem = () => {
      return this.dialog.open(EnvioMensagemComponent, {
        data: {
          titulo: 'Enviar Produto Por E-mail',
          mensagem: `Selecione o cliente ou Digite o E-mail: `,
          dado: this.listProdutosEnviar
        },
      });
    }
    if (!this.listProdutosEnviar || this.listProdutosEnviar.length === 0) {
      this.showMensagemSimples("Selecione Produtos na checkBox da tabela para enviar!", 5000)
    } else {
      const enviarMensagem = dialogEnviarMensagem.call(this);
      enviarMensagem.afterClosed().subscribe(() => {
      })
    }
  }

  selecionarLinha(produto: ProdutoDto) {
    let removido = this.removeProdutoDaLista(produto);
    if (!removido) {
      this.listProdutosEnviar.push(produto);
    }
  }

  removeProdutoDaLista(produto: ProdutoDto) {
    let removido = false;
    this.listProdutosEnviar.forEach((item, index) => {
      if (item.codigo === produto.codigo) {
        this.listProdutosEnviar.splice(index, 1);
        removido = true;
      }
    });
    return removido;
  }
}
