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
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {PageEvent} from "@angular/material/paginator";

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
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "produto", this.snackBar);
  admin!: boolean
  pageSlice!: ProdutoDto[];
  constructor(
    public produtoService: ProdutoControllerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private imagemService: ImagemControllerService,
    private router: Router,
    private securityService: SecurityService
  ) {
  }

  ngOnInit(): void {
    if (this.securityService.credential.accessToken == "") {
      this.router.navigate(['/acesso']);
    } else {
      if (this.securityService.isValid()) {
        this.admin = this.securityService.hasRoles(['ROLE_ADMIN'])
      }
      if (!this.securityService.isValid())
        this.router.navigate(['/acesso']);
    }
    this.buscarDados();
    this.pageSlice = this.produtoListaDataSource.data.slice(0,5);
  }

  onPageChange(event: PageEvent){
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.produtoListaDataSource.data.length){
      endIndex = this.produtoListaDataSource.data.length
    }
    this.pageSlice = this.produtoListaDataSource.data.slice(startIndex, endIndex);
  }

  selectAll(completed: boolean) {
    this.listProdutosEnviar = [];
    this.allChecked = completed;
    if (this.allChecked) {
      this.listProdutosAux = this.produtoListaDataSource.data;
      this.listProdutosAux.forEach(produto => {
        this.selecionarLinha(produto);
      })
    }
  }

  private buscarDados() {
    this.produtoService.produtoControllerListAll().subscribe(data => {
      this.produtoListaDataSource.data = data;
      this.pageSlice = this.produtoListaDataSource.data.slice(0, 5);
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
            this.mensagens.showMensagemSimples("Excluído com sucesso!");
            console.log("Exclusão:", retorno);
          }, error => {
          this.mensagens.confirmarErro("Excluir", error.message);
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
      this.mensagens.showMensagemSimples("Selecione Produtos na checkBox da tabela para enviar!")
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
