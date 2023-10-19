import {Component, OnInit} from '@angular/core';
import {CategoriaControllerService} from "../../../api/services/categoria-controller.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoriaDto} from "../../../api/models/categoria-dto";
import {MatTableDataSource} from "@angular/material/table";
import {ConfirmationDialog,  ConfirmationDialogResult} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-categoria',
  templateUrl: './list-categoria.component.html',
  styleUrls: ['./list-categoria.component.scss']
})
export class ListCategoriaComponent implements OnInit {
  colunasMostrar = ['codigo','nome', 'descricao','acao'];
  categoriaListaDataSource: MatTableDataSource<CategoriaDto> = new MatTableDataSource<CategoriaDto>();

  constructor(
    public categoriaService: CategoriaControllerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ){
  }

  ngOnInit(): void {
    this.buscarDados();
  }



  private buscarDados() {
    this.categoriaService.categoriaControllerListAll().subscribe(data => {
      this.categoriaListaDataSource.data = data;
      console.log(JSON.stringify(data));
    })
  }

  remover(categoriaDto: CategoriaDto) {
    console.log("Removido", categoriaDto.codigo);
    let codigoDaCategoria: number = categoriaDto.codigo || 0;
    this.categoriaService.categoriaControllerRemover({ id: codigoDaCategoria})
      .subscribe(
        retorno => {
          this.buscarDados();
          if(retorno != null) {
            this.showMensagemSimples("Excluído com sucesso!", 5000);
            console.log("Exclusão:", retorno);
          }
          this.showMensagemSimples("Erro ao excluir, categoria em utilização!", 5000);
          console.log("Exclusão:", retorno);
        }
      );
  }


  confirmarExcluir(categoriaDto: CategoriaDto) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Confirmar?',
        mensagem: `A exclusão de: ${categoriaDto.nome} (ID: ${categoriaDto.codigo})?`,
        textoBotoes: {
          ok: 'Confirmar',
          cancel: 'Cancelar',
        },
        dado: categoriaDto
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

}
