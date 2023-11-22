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

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss']
})
export class ListUsuarioComponent implements OnInit {
  colunasMostrar = ['codigo','funcionarioNome', 'funcionarioEmail','funcionarioCpf','funcionarioCargo','acao'];
  usuarioListaDataSource: MatTableDataSource<UsuarioDto> = new MatTableDataSource<UsuarioDto>();

  constructor(
    public funcionarioService: FuncionarioControllerService,
    public usuarioService: UsuarioControllerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ){
  }

  ngOnInit(): void {
    this.buscarDados();
  }

  showResult($event: any[]) {
    this.usuarioListaDataSource.data = $event;
  }

  private buscarDados() {
    this.usuarioService.usuarioControllerListAll().subscribe(data => {
      this.usuarioListaDataSource.data = data;
      console.log(JSON.stringify(data));
    })
  }

  remover(usuarioDto: UsuarioDto) {
    console.log("Removido", usuarioDto.codigo);
    this.funcionarioService.funcionarioControllerRemover({ id: usuarioDto.funcionarioCpf || ''})
      .subscribe(
        retorno => {
          this.buscarDados();
          if(retorno != null) {
            this.showMensagemSimples("Excluído com sucesso!", 5000);
            console.log("Exclusão:", retorno);
          }
          this.showMensagemSimples("Erro ao excluir, usuário com atividade!", 5000);
          console.log("Exclusão:", retorno);
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
  showMensagemSimples( mensagem: string, duracao: number = 2000) {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: duracao,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
