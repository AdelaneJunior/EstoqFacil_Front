import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import {ProdutoControllerService} from "../../../api/services/produto-controller.service";
import {ProdutoDto} from "../../../api/models/produto-dto";
import {
  ConfirmationDialog,
  ConfirmationDialogResult
} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {EnvioMensagemComponent} from "../../../core/envio-mensagem/envio-mensagem.component";
@Component({
  selector: 'app-list-produto',
  templateUrl: './list-produto.component.html',
  styleUrls: ['./list-produto.component.scss']
})


export class ListProdutoComponent implements OnInit{

  colunasMostrar = ['check', 'codigo','imagem','categoriaId','nome', 'descricao','marca','quantidade','preco','acao'];
  produtoListaDataSource: MatTableDataSource<ProdutoDto> = new MatTableDataSource<ProdutoDto>();
  listProdutosEnviar: Array<ProdutoDto> = [];
  linhaSelecionada!: ProdutoDto ;
  constructor(
    public produtoService: ProdutoControllerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ){
  }

  ngOnInit(): void {
    this.buscarDados();
  }



  private buscarDados() {
    this.produtoService.produtoControllerListAll().subscribe(data => {
      this.produtoListaDataSource.data = data;
      console.log(JSON.stringify(data));
    })
  }

  remover(produtoDto: ProdutoDto) {
    console.log("Removido", produtoDto.codigo);
    let codigoDoProduto: number = produtoDto.codigo || 0;
    this.produtoService.produtoControllerRemover({ id: codigoDoProduto})
      .subscribe(
        retorno => {
          this.buscarDados();
          this.showMensagemSimples("Excluído com sucesso", 5000);
          console.log("Exclusão:", retorno);
        },
        error => {
          if (error.status === 404) {
            this.showMensagemSimples("Produto não existe mais");
          } else {
            this.showMensagemSimples("Erro ao excluir");
            console.log("Erro:", error);
          }
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
  showMensagemSimples( mensagem: string, duracao: number = 2000) {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: duracao,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }


  enviarproduto(ProdutoDto: ProdutoDto){
    const enviarMensagem= this.dialog.open(EnvioMensagemComponent, {
      data: {
        titulo: 'Enviar Produto Por E-mail',
        mensagem: `Digite o E-mail: `,
        dado: document.querySelectorAll('td [type="checkbox"]:checked')
      },
    });
    enviarMensagem.afterClosed().subscribe(() => {

    })
  }
  selecionarLinha(row: ProdutoDto) {
    // Verifica se a linha já está no array listProdutosEnviar
    const index = this.listProdutosEnviar.indexOf(row);

    if (index !== -1) {
      // Se a linha já está no array, a remova
      this.listProdutosEnviar.splice(index, 1);
    } else {
      // Se a linha não está no array, a adicione
      this.listProdutosEnviar.push(row);
    }

    console.log(this.listProdutosEnviar);
  }

}
