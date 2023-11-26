import {Component, HostListener, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {
  ConfirmationDialog,
  ConfirmationDialogResult
} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {FuncionarioControllerService} from "../../../api/services/funcionario-controller.service";
import {FuncionarioDto} from "../../../api/models/funcionario-dto";
import {ClienteControllerService} from "../../../api/services/cliente-controller.service";
import {ClienteDto} from "../../../api/models/cliente-dto";
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-list-cliente',
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss']
})
export class ListClienteComponent implements OnInit {
  colunasMostrar = ['cpf','nome', 'telefone','email','acao'];
  clienteListaDataSource: MatTableDataSource<ClienteDto> = new MatTableDataSource<ClienteDto>();
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "cliente", this.snackBar);
  admin!: boolean;
  pageSlice!: ClienteDto[];
  qtdRegistros!: number;
  innerWidth: number = window.innerWidth;
  flexDivAlinhar: string = 'row';

  constructor(
    public clienteService: ClienteControllerService,
    private dialog: MatDialog,
    private securityService: SecurityService,
    private snackBar: MatSnackBar,
    private router: Router
  ){
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.buscarDados();
  }

  onPageChange(event: PageEvent){
    this.clienteService.clienteControllerListAllPage({page: {page: event.pageIndex, sort:["cpf"], size: event.pageSize}}).subscribe(data => {
      this.clienteListaDataSource.data = data.content;
      this.pageSlice = this.clienteListaDataSource.data;
    })
  }

  private buscarDados() {
    this.clienteService.clienteControllerListAllPage({page: {page: 0, sort:["cpf"], size: 5}}).subscribe(data => {
      this.clienteListaDataSource.data = data.content;
      this.pageSlice = this.clienteListaDataSource.data;
      this.qtdRegistros = data.totalElements;
    })
  }

  remover(clienteDto: ClienteDto) {
    console.log("Removido", clienteDto.cpf);
    let cpfCliente: string = clienteDto.cpf || '';
    this.clienteService.clienteControllerRemover({ id: cpfCliente})
      .subscribe(
        retorno => {
          this.buscarDados();
          this.mensagens.showMensagemSimples("Excluído com sucesso!");
          console.log("Exclusão:", retorno);
        },error => {
          this.mensagens.confirmarErro("Excluir", error.message)
        }
      );
  }


  confirmarExcluir(clienteDto: ClienteDto) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Confirmar?',
        mensagem: `A exclusão de: ${clienteDto.nome} (ID: ${clienteDto.cpf})?`,
        textoBotoes: {
          ok: 'Confirmar',
          cancel: 'Cancelar',
        },
        dado: clienteDto
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: ConfirmationDialogResult) => {
      if (confirmed?.resultado) {
        this.remover(confirmed.dado);
      }
    });
  }

  showResult($event: any[]) {
    this.clienteListaDataSource.data = $event;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.innerWidth = window.innerWidth;
  }

  mudarAlinhar() {

    if(this.innerWidth < 1500)
    {
      return this.flexDivAlinhar = "column";
    }
    return this.flexDivAlinhar = "row";

  }
}
