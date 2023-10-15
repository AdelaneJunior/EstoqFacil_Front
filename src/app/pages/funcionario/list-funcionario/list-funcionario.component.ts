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

  remover(funcionarioDto: FuncionarioDto) {
    console.log("Removido", funcionarioDto.codigo);
    let codigoDoFuncionario: number = funcionarioDto.codigo || 0;
    this.funcionarioService.funcionarioControllerRemover({ id: codigoDoFuncionario})
      .subscribe(
        retorno => {
          this.buscarDados();
          this.showMensagemSimples("Excluído com sucesso", 5000);
          console.log("Exclusão:", retorno);
        },
        error => {
          if (error.status === 404) {
            this.showMensagemSimples("Funcionario não existe mais");
          } else {
            this.showMensagemSimples("Erro ao excluir");
            console.log("Erro:", error);
          }
        }
      );
  }


  confirmarExcluir(funcionarioDto: FuncionarioDto) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Confirmar?',
        mensagem: `A exclusão de: ${funcionarioDto.nome} (ID: ${funcionarioDto.codigo})?`,
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
