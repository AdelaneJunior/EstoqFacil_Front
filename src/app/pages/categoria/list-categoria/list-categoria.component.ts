import {Component, OnInit} from '@angular/core';
import {CategoriaControllerService} from "../../../api/services/categoria-controller.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoriaDto} from "../../../api/models/categoria-dto";
import {MatTableDataSource} from "@angular/material/table";
import {ConfirmationDialog,  ConfirmationDialogResult} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import { Router } from '@angular/router';
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-list-categoria',
  templateUrl: './list-categoria.component.html',
  styleUrls: ['./list-categoria.component.scss']
})
export class ListCategoriaComponent implements OnInit {
  colunasMostrar = ['codigo','nome', 'descricao','acao'];
  categoriaListaDataSource: MatTableDataSource<CategoriaDto> = new MatTableDataSource<CategoriaDto>();
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "categoria", this.snackBar);
  admin!: boolean;
  pageSlice!: CategoriaDto[];
  constructor(
    public categoriaService: CategoriaControllerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private securityService: SecurityService
  ){
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
  }

  onPageChange(event: PageEvent){
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.categoriaListaDataSource.data.length){
      endIndex = this.categoriaListaDataSource.data.length
    }
    this.pageSlice = this.categoriaListaDataSource.data.slice(startIndex, endIndex);
  }

  private buscarDados() {
    this.categoriaService.categoriaControllerListAll().subscribe(data => {
      this.categoriaListaDataSource.data = data;
      this.pageSlice = this.categoriaListaDataSource.data.slice(0,5);
      console.log(JSON.stringify(data));
    })
  }

  showResult($event: any[]) {
    this.categoriaListaDataSource.data = $event;
  }

  remover(categoriaDto: CategoriaDto) {
    console.log("Removido", categoriaDto.codigo);
    let codigoDaCategoria: number = categoriaDto.codigo || 0;
    this.categoriaService.categoriaControllerRemover({ id: codigoDaCategoria})
      .subscribe(
        retorno => {
          this.buscarDados();
            this.mensagens.showMensagemSimples("Excluído com sucesso!");
            console.log("Exclusão:", retorno);
        }, error => {
            this.mensagens.confirmarErro("Excluir", error.message)
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

}
