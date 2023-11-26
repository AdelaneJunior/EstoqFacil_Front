import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmationDialog} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {FuncionarioControllerService} from "../../../api/services/funcionario-controller.service";
import {FuncionarioDto} from "../../../api/models/funcionario-dto";
import {ClienteControllerService} from "../../../api/services/cliente-controller.service";
import {ClienteDto} from "../../../api/models/cliente-dto";
import {CategoriaDto} from "../../../api/models/categoria-dto";
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {Validacoes} from "../../../../Validacoes";
import {SecurityService} from "../../../arquitetura/security/security.service";

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss']
})
export class FormClienteComponent implements OnInit{
  formGroup!: FormGroup;
  public readonly ACAO_INCLUIR = "Cadastrar";
  public readonly ACAO_EDITAR = "Editar";
  acao: string = this.ACAO_INCLUIR;
  codigo!: string;
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "cliente", this.snackBar)
  validacoes: Validacoes = new Validacoes();
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
  flexDivAlinhar: string = 'row';
  admin!: boolean;
  innerWidth: number = window.innerWidth;
  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private clienteService: ClienteControllerService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private securityService: SecurityService,
  ) {
    this._adapter.setLocale('pt-br');
  }

  ngOnInit() {
    if (this.securityService.credential.accessToken == "") {
      this.router.navigate(['/acesso']);
    } else {
      if (this.securityService.isValid()) {
        this.admin = this.securityService.hasRoles(['ROLE_ADMIN'])
      }
      if (!this.securityService.isValid())
        this.router.navigate(['/acesso']);
    }
    this.innerWidth = window.innerWidth;
    this.createForm();
    this._adapter.setLocale('pt-br');
    this.prepararEdicao();
  }

  private createForm() {
    if(this.acao == "Editar"){
      this.clienteService.clienteControllerObterPorId({id: this.codigo}).
      subscribe(retorno =>
          this.formGroup = this.formBuilder.group({
            nome: [retorno.nome, Validators.required],
            cpf: [retorno.cpf, [Validators.required, this.validacoes.validarCpf]],
            nascimento: [retorno.nascimento, Validators.required],
            telefone: [retorno.telefone, [Validators.required, this.validacoes.validarTelefone]],
            email: [retorno.email, [Validators.required, this.validacoes.validarEmail]],
          }));
    }else{
      this.formGroup = this.formBuilder.group({
        nome: [null, Validators.required],
        cpf: [null, [Validators.required, this.validacoes.validarCpf]],
        nascimento: [null, Validators.required],
        telefone: [null, [Validators.required, this.validacoes.validarTelefone]],
        email: [null, [Validators.required, this.validacoes.validarEmail]],
      })
    }
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  };


  onSubmit() {
    console.log('Formulário submetido');
    if (this.formGroup.valid) {
      if(!this.codigo){
        this.realizarInclusao();
      }else{
        this.realizarEdicao();
      }
    }

  }

  private realizarInclusao(){
    const clienteDto: ClienteDto = {
      nome: this.formGroup.value.nome,
      cpf: this.formGroup.value.cpf,
      nascimento: this.formGroup.value.nascimento,
      telefone: this.formGroup.value.telefone,
      email: this.formGroup.value.email
    };
    console.log("Dados:",this.formGroup.value);
    this.clienteService.clienteControllerIncluir({body: clienteDto})
      .subscribe( retorno =>{
        console.log("Retorno:",retorno);
        this.confirmarAcao(retorno, this.ACAO_INCLUIR);
        this.router.navigate(["/cliente"]);
      }, erro =>{
        console.log("Erro:"+erro);
        this.mensagens.confirmarErro(this.ACAO_INCLUIR, erro.message)
      })
  }


  limparFormulario() {
    this.formGroup.reset(); // limpa os campos do formulario.
    this.formGroup.patchValue({
      usuarioId: this.securityService.getUserId()
    });
  }


  private prepararEdicao() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId){
      const codigo = paramId;
      console.log("codigo",paramId);
      this.clienteService.clienteControllerObterPorId({id: codigo}).subscribe(
        retorno => {
          this.acao = this.ACAO_EDITAR;
          console.log("retorno", retorno);
          this.codigo = retorno.cpf || "";
          this.formGroup.patchValue(retorno);
        },error => {
          console.log("erro", error);
          this.mensagens.confirmarErro(this.ACAO_EDITAR, error.message)
        }
      )
    }
  }

  confirmarAcao(clienteDto: ClienteDto, acao: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Ação de ${acao} dados: ${clienteDto.nome} (ID: ${clienteDto.cpf}) realizada com sucesso!`,
        textoBotoes: {
          ok: 'ok',
        },
      },
    });
  }

  private realizarEdicao(){
    console.log("Dados:", this.formGroup.value);
    const cliente: ClienteDto = this.formGroup.value;
    this.clienteService.clienteControllerAlterar( {id: this.codigo, body: cliente})
      .subscribe(retorno => {
        console.log("Retorno:", retorno);
        this.confirmarAcao(retorno, this.ACAO_EDITAR);
        this.router.navigate(["/cliente"]);
      }, erro => {
        console.log("Erro:", erro.error);
        this.mensagens.confirmarErro(this.ACAO_EDITAR, erro.message)
        //this.showError(erro.error, this.ACAO_EDITAR);
      })
  }

  mudarAlinhar() {

    if(innerWidth < 1000)
    {
      return this.flexDivAlinhar = "column";
    }
    return this.flexDivAlinhar = "row";

  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.innerWidth = window.innerWidth;
  }
}
