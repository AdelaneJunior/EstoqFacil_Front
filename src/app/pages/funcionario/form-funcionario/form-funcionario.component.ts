import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmationDialog} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {FuncionarioControllerService} from "../../../api/services/funcionario-controller.service";
import {FuncionarioDto} from "../../../api/models/funcionario-dto";
import {CargoControllerService} from "../../../api/services/cargo-controller.service";
import {CargoDto} from "../../../api/models/cargo-dto";
import {ClienteDto} from "../../../api/models/cliente-dto";
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {Validacoes} from "../../../../Validacoes";

@Component({
  selector: 'app-form-funcionario',
  templateUrl: './form-funcionario.component.html',
  styleUrls: ['./form-funcionario.component.scss']
})
export class FormFuncionarioComponent implements OnInit{
  formGroup!: FormGroup;
  public readonly ACAO_INCLUIR = "Cadastrar";
  public readonly ACAO_EDITAR = "Editar";
  acao: string = this.ACAO_INCLUIR;
  codigo!: string;
  cargos: CargoDto[] = [];
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "funcionario", this.snackBar)
  validacoes: Validacoes = new Validacoes();
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
  flexDivAlinhar: string = 'row';
  admin!: boolean

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private funcionarioService: FuncionarioControllerService,
    private cargoService: CargoControllerService,
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
    this.createForm();
    this._adapter.setLocale('pt-br');
    this.carregarCargos();
    this.prepararEdicao();
  }

  carregarCargos() {
    this.cargoService.cargoControllerListAll().subscribe(
      (cargos: CargoDto[]) => {
        this.cargos = cargos;
      },
      (error) => {
        console.error('Erro ao carregar cargos:', error);
        this.mensagens.confirmarErro("Carregar Cargos", error.message);
      }
    );
  }

  private createForm() {
    if(this.acao == "Editar"){
      this.funcionarioService.funcionarioControllerObterPorId({id: this.codigo}).
      subscribe(retorno =>
          this.formGroup = this.formBuilder.group({
            nome: [retorno.nome, Validators.required],
            cpf: [retorno.cpf, [Validators.required, this.validacoes.validarCpf]],
            nascimento: [retorno.nascimento, Validators.required],
            telefone: [retorno.telefone, [Validators.required, this.validacoes.validarTelefone]],
            email: [retorno.email, [Validators.required, this.validacoes.validarEmail]],
            cargoId: [retorno.cargoId, Validators.required]
          }));
    }else{
      this.formGroup = this.formBuilder.group({
        nome: [null, Validators.required],
        cpf: [null, [Validators.required, this.validacoes.validarCpf]],
        nascimento: [null, Validators.required],
        telefone: [null, [Validators.required, this.validacoes.validarTelefone]],
        email: [null, [Validators.required, this.validacoes.validarEmail]],
        cargoId: [null, Validators.required]
      })
    }
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    if (this.formGroup.valid) {
      if(!this.codigo){
        this.realizarInclusao();
      }else{
        this.realizarEdicao();
      }
    }
  }

  private realizarInclusao(){
    console.log("Dados:",this.formGroup.value);
    this.funcionarioService.funcionarioControllerIncluir({body: this.formGroup.value})
      .subscribe( retorno =>{
        console.log("Retorno:",retorno);
        this.confirmarAcao(retorno, this.ACAO_INCLUIR);
        this.router.navigate(["/funcionario"]);
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
      console.log("cpf",paramId);
      this.funcionarioService.funcionarioControllerObterPorId({id: codigo}).subscribe(
        retorno => {
          this.acao = this.ACAO_EDITAR;
          console.log("retorno", retorno);
          this.codigo = retorno.cpf || "";
          this.formGroup.patchValue(retorno);
        },error => {
          this.mensagens.confirmarErro(this.ACAO_EDITAR, error.message)
          console.log("erro", error);
        }
      )
    }
  }

  confirmarAcao(funcionarioDto: FuncionarioDto, acao: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Ação de ${acao} dados: ${funcionarioDto.nome} (ID: ${funcionarioDto.cpf}) realizada com sucesso!`,
        textoBotoes: {
          ok: 'OK',
        },
      },
    });
  }

  private realizarEdicao(){
    console.log("Dados:", this.formGroup.value);
    const funcionario: FuncionarioDto = this.formGroup.value;
    this.funcionarioService.funcionarioControllerAlterar( {id: this.codigo, body: funcionario})
      .subscribe(retorno => {
        console.log("Retorno:", retorno);
        this.confirmarAcao(retorno, this.ACAO_EDITAR);
        this.router.navigate(["/funcionario"]);
      }, erro => {
        console.log("Erro:", erro.error);
        this.mensagens.confirmarErro(this.ACAO_EDITAR, erro.message)
        //this.showError(erro.error, this.ACAO_EDITAR);
      })
  }

  mudarAlinhar() {

    if(innerWidth < 1500)
    {
      return this.flexDivAlinhar = "column";
    }
    return this.flexDivAlinhar = "row";

  }

}
