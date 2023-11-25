import {Component, OnInit} from '@angular/core';
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
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-list-funcionario',
  templateUrl: './list-funcionario.component.html',
  styleUrls: ['./list-funcionario.component.scss']
})
export class ListFuncionarioComponent implements OnInit {
  colunasMostrar = ['cpf','nome', 'telefone','email','cargoNome','acao'];
  funcionarioListaDataSource: MatTableDataSource<FuncionarioDto> = new MatTableDataSource<FuncionarioDto>();
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "funcionario", this.snackBar)
  admin!: boolean;
  pageSlice!: FuncionarioDto[];
  qtdRegistros!: number;
  constructor(
    public funcionarioService: FuncionarioControllerService,
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
    this.funcionarioService.funcionarioControllerListAllPage({page: {page: event.pageIndex, size: event.pageSize, sort:["cpf"]}}).subscribe(data => {
      this.funcionarioListaDataSource.data = data.content;
      this.pageSlice = this.funcionarioListaDataSource.data;
    })
  }


  private buscarDados() {
    this.funcionarioService.funcionarioControllerListAllPage({page: {page: 0, size: 5, sort:["cpf"]}}).subscribe(data => {
      this.funcionarioListaDataSource.data = data.content;
      this.pageSlice = this.funcionarioListaDataSource.data;
      this.qtdRegistros = data.totalElements;
    })
  }

  showResult($event: any[]) {
    this.funcionarioListaDataSource.data = $event;
  }

  remover(funcionarioDto: FuncionarioDto) {
    console.log("Removido", funcionarioDto.cpf);
    this.funcionarioService.funcionarioControllerRemover({ id: funcionarioDto.cpf || ''})
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


  confirmarExcluir(funcionarioDto: FuncionarioDto) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Confirmar?',
        mensagem: `A exclusão de: ${funcionarioDto.nome} (ID: ${funcionarioDto.cpf})?`,
        textoBotoes: {
          ok: 'Confirmar',
          cancel: 'Cancelar',
        },
        dado: funcionarioDto
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: ConfirmationDialogResult) => {
      if (confirmed?.resultado) {
        this.remover(confirmed.dado);
      }
    });
  }

}
