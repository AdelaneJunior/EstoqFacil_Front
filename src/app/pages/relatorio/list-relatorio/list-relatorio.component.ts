import {Component, OnInit} from '@angular/core';
import {MovimentacaoControllerService} from "../../../api/services/movimentacao-controller.service";
import {MatTableDataSource} from "@angular/material/table";
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {MatDialog} from "@angular/material/dialog";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {RelatorioMovimentacaoDto} from "../../../api/models/relatorio-movimentacao-dto";

@Component({
  selector: 'app-list-relatorio',
  templateUrl: './list-relatorio.component.html',
  styleUrls: ['./list-relatorio.component.css']
})
export class ListRelatorioComponent implements OnInit {

  colunasMostrar: string[] =
    ['codigoProduto', 'nomeProduto','preco', 'quantidadeSaida', 'quantidadeEntrada','acao']
  relatorioListDataSource: MatTableDataSource<RelatorioMovimentacaoDto> = new MatTableDataSource<RelatorioMovimentacaoDto>()
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "relatorio", this.snackBar)
  qtdRegistros!:number
  admin!:boolean
  constructor(
    public movimentacaoController: MovimentacaoControllerService,
    private dialog: MatDialog,
    private securityService: SecurityService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
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

  private buscarDados() {
    this.movimentacaoController.movimentacaoControllerTodasMovimentacoesProdutosEntradaSaida()
      .subscribe(data => {
        this.relatorioListDataSource.data = data;
        console.log("data: ",this.relatorioListDataSource.data)
        console.log("data2: ", data)
      })
  }

  showResult($event: any[]) {
    this.relatorioListDataSource.data = $event;
  }
}
