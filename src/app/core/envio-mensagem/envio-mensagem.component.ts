import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmationDialog} from "../confirmation-dialog/confirmation-dialog.component";
import {FormBuilder} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ProdutoControllerService} from "../../api/services/produto-controller.service";
import {ProdutoDto} from "../../api/models/produto-dto";
import {MessageResponse} from "../../api/models/message-response";
import {Router} from "@angular/router";
import {EnviaEmailDto} from "../../api/models/envia-email-dto";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClienteControllerService} from "../../api/services/cliente-controller.service";
import {ClienteDto} from "../../api/models/cliente-dto";
import {MensagensUniversais} from "../../../MensagensUniversais";

@Component({
  selector: 'app-envio-mensagem',
  templateUrl: './envio-mensagem.component.html',
  styleUrls: ['./envio-mensagem.component.scss']
})
export class EnvioMensagemComponent {

  titulo = "Titulo: Confirmar?";
  mensagem: string = "Enviar produto para: "
  private produtos?: ProdutoDto[];
  enviaEmailDTO!: EnviaEmailDto
  clientes: ClienteDto[] = []
  clienteParaEnvio!: ClienteDto
  emailCliente!: string
  emailClientePreenchido: boolean = false;
  promocao: boolean = false
  desconto!: number
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "produto", this.snackBar);



  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public produtoControllerService: ProdutoControllerService,
    private clienteControllerService: ClienteControllerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data: ConfirmationDialogData,
    private dialogRef: MatDialogRef<ConfirmationDialog, ConfirmationDialogResult>) {
    if (data) {
      this.titulo = data?.titulo || this.titulo
      this.mensagem = data.mensagem || this.mensagem;
      this.produtos = data.dado;
    }
    this.buscaClientes()
  }

  onSubmit() {
    this.montaEnviaEmailDTO();

    this.produtoControllerService.produtoControllerEnviaEmailComPdf({body: this.enviaEmailDTO}).subscribe(link => {
      this.dialogRef.close();
      this.mensagens.showMensagemSimples("E-mail sendo enviado consulte a página inicial!")
    }, (erro:any) => {
      console.log("Erro", erro)
      this.mensagens.confirmarErro("Enviar produto", erro.message);
    })


  }

  private montaEnviaEmailDTO() {
    console.log(this.emailCliente)
    console.log(this.promocao)
    console.log(this.desconto)
    this.enviaEmailDTO ={
      email: this.emailCliente,
      listaProdutos:this.produtos,
      promocao:this.promocao,
      desconto: this.desconto,
    }
    console.log(this.enviaEmailDTO.email)
  }

  atualizar() {
    this.dialogRef.close({
      resultado: true,
      dado: this.data?.dado
    });
  }

  get showCancelButton(): boolean {
    return !!this.data;
  }

  private buscaClientes() {
    this.clienteControllerService.clienteControllerListAll().subscribe(retorno => {
      this.clientes = retorno;
    })
  }

  atualizaClienteEmail() {
    if(this.clienteParaEnvio) {
      if (this.clienteParaEnvio.email) {
        this.emailCliente = this.clienteParaEnvio.email
        this.emailClientePreenchido = true;
      }
    }else {
      this.emailCliente = ''
      this.emailClientePreenchido = false
    }

  }

}

export interface ConfirmationDialogData {
  titulo?: string;
  mensagem?: string;
  dado?: any
}

export interface ConfirmationDialogResult {
  resultado: boolean;
  dado?: any;
}
