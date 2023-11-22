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

@Component({
  selector: 'app-list-funcionario',
  templateUrl: './list-funcionario.component.html',
  styleUrls: ['./list-funcionario.component.scss']
})
export class ListFuncionarioComponent implements OnInit {
  colunasMostrar = ['cpf','nome', 'telefone','email','cargoNome','acao'];
  funcionarioListaDataSource: MatTableDataSource<FuncionarioDto> = new MatTableDataSource<FuncionarioDto>();

  constructor(
    public funcionarioService: FuncionarioControllerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ){
  }

  ngOnInit(): void {
    this.buscarDados();
  }



  private buscarDados() {
    this.funcionarioService.funcionarioControllerListAll().subscribe(data => {
      this.funcionarioListaDataSource.data = data;
      console.log(JSON.stringify(data));
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
          this.buscarDados();
          if(retorno != null) {
            this.showMensagemSimples("Excluído com sucesso!", 5000);
            console.log("Exclusão:", retorno);
          }
          this.showMensagemSimples("Erro ao excluir, funcionário improtante!", 5000);
          console.log("Exclusão:", retorno);
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
  showMensagemSimples( mensagem: string, duracao: number = 2000) {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: duracao,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
