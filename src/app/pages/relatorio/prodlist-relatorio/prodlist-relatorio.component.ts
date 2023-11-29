import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {MovimentacaoControllerService} from "../../../api/services/movimentacao-controller.service";
import {MatDialog} from "@angular/material/dialog";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {MovimentacaoDto} from "../../../api/models/movimentacao-dto";
import {ProdutoDto} from "../../../api/models/produto-dto";
import {
  ProdutoMovimentacaoDialogComponent
} from "../../produto/produto-movimentacao-dialog/produto-movimentacao-dialog.component";
import {ProdutoControllerService} from "../../../api/services/produto-controller.service";

@Component({
  selector: 'app-prodlist-relatorio',
  templateUrl: './prodlist-relatorio.component.html',
  styleUrls: ['./prodlist-relatorio.component.css']
})
export class ProdlistRelatorioComponent implements OnInit {

  colunasMostrar: string[] =
    ['usuarioNome', 'observacao', 'acaoMovimento', 'quantidade', 'precoVenda', 'custoAquisicao', 'data']
  movimentacaoListDataSource: MatTableDataSource<MovimentacaoDto> = new MatTableDataSource<MovimentacaoDto>()
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "relatorio", this.snackBar)
  qtdRegistros!: number
  pageSlice!: MovimentacaoDto[];
  admin!: boolean
  produtoNome!: string
  codigo!: number
  produtoCodigo!: number;
  produto!: ProdutoDto;
  paginaAnterior!: string;

  constructor(
    public movimentacaoController: MovimentacaoControllerService,
    private dialog: MatDialog,
    private securityService: SecurityService,
    private snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute,
    private produtoService: ProdutoControllerService
  ) {
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('codigo');
    this.paginaAnterior = this.route.snapshot.paramMap.get('pagina') || "relatorio";
    console.log(paramId)
    this.buscarDados()
  }

  buscarDados() {
    const paramId = this.route.snapshot.paramMap.get('codigo');
    if (paramId) {
      const codigo = parseInt(paramId);
      this.codigo = codigo;
      this.produtoService.produtoControllerObterPorId({id: codigo}).subscribe(data => {
        this.produto = data;
      })
      this.produtoCodigo = codigo;
      this.movimentacaoController.movimentacaoControllerTodasMovimentacoesDeProdutoPorCodigo({codigoProduto: codigo})
        .subscribe(data => {
          this.movimentacaoListDataSource.data = data;
          this.pageSlice = this.movimentacaoListDataSource.data

          // @ts-ignore
          this.produtoNome = this.pageSlice.at(0).produtoNome || ''
        })
    }
  }

  openDialog(codigo: number): void {
    this.produtoService.produtoControllerObterPorId({id: codigo}).subscribe(data =>{
        this.produto = data;
    })
    const dialogRef = this.dialog.open(ProdutoMovimentacaoDialogComponent,
      {
        data:
          {
            produto: this.produto
          }
      });
  }
}
