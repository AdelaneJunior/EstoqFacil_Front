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
  innerWidth: number = window.innerWidth;
  flexDivAlinhar: string = 'row';

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
    this.innerWidth = window.innerWidth;
    this.buscarDados();
  }

  showResult($event: any[]) {
    this.usuarioListaDataSource.data = $event;
  }

  private buscarDados() {
    this.usuarioService.usuarioControllerListAllPage({page:{page:0, size:5, sort:["codigo"]}}).subscribe(data => {
      this.usuarioListaDataSource.data = data.content;
      this.pageSlice = this.usuarioListaDataSource.data;
      this.qtdRegistros = data.totalElements;
    })
  }

  onPageChange(event: PageEvent){
    this.usuarioService.usuarioControllerListAllPage({page:{page:event.pageIndex, size:event.pageSize, sort:["codigo"]}}).subscribe(data => {
      this.usuarioListaDataSource.data = data.content;
      this.pageSlice = this.usuarioListaDataSource.data;
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
