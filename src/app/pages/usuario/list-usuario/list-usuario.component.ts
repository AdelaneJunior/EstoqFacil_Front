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
import {UsuarioDto} from "../../../api/models/usuario-dto";
import {UsuarioControllerService} from "../../../api/services/usuario-controller.service";
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss']
})
export class ListUsuarioComponent implements OnInit {
  colunasMostrar = ['codigo','funcionarioNome', 'funcionarioEmail','funcionarioCpf','funcionarioCargo','acao'];
  usuarioListaDataSource: MatTableDataSource<UsuarioDto> = new MatTableDataSource<UsuarioDto>();
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "usuario", this.snackBar);
  admin!: boolean;
  pageSlice!: UsuarioDto[];
  qtdRegistros!: number;

  constructor(
    public funcionarioService: FuncionarioControllerService,
    public usuarioService: UsuarioControllerService,
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

  showResult($event: any[]) {
    this.usuarioListaDataSource.data = $event;
  }

  private buscarDados() {
    this.usuarioService.usuarioControllerListUsuariosWithPagination({offset: 0, pageSize: 5}).subscribe(data => {
      this.usuarioListaDataSource.data = data;
      this.pageSlice = this.usuarioListaDataSource.data
    })
    this.usuarioService.usuarioControllerCount().subscribe(data =>{
      this.qtdRegistros = data;
    })
  }

  onPageChange(event: PageEvent){
    this.usuarioService.usuarioControllerListUsuariosWithPagination({offset: event.pageIndex, pageSize: event.pageSize}).subscribe(data => {
      this.usuarioListaDataSource.data = data;
      this.pageSlice = this.usuarioListaDataSource.data
      console.log(JSON.stringify(data));
    })
  }

  remover(usuarioDto: UsuarioDto) {
    console.log("Removido", usuarioDto.codigo);
    this.funcionarioService.funcionarioControllerRemover({ id: usuarioDto.funcionarioCpf || ''})
      .subscribe(
        retorno => {
          this.buscarDados();
            this.mensagens.showMensagemSimples("Excluído com sucesso!", 5000);
            console.log("Exclusão:", retorno);

        }, error => {
          this.mensagens.confirmarErro("Remover", error.message)
          console.log("Exclusão:", error);
        }
      );
  }


  confirmarExcluir(usuarioDto: UsuarioDto) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Confirmar?',
        mensagem: `A exclusão do Usuario: ${usuarioDto.funcionarioNome} (ID: ${usuarioDto.codigo})?`,
        textoBotoes: {
          ok: 'Confirmar',
          cancel: 'Cancelar',
        },
        dado: usuarioDto
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: ConfirmationDialogResult) => {
      if (confirmed?.resultado) {
        this.remover(confirmed.dado);
      }
    });
  }

}
