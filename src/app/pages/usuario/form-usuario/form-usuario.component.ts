import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmationDialog} from "../../../core/confirmation-dialog/confirmation-dialog.component";
import {FuncionarioControllerService} from "../../../api/services/funcionario-controller.service";
import {UsuarioDto} from "../../../api/models/usuario-dto";
import {FuncionarioDto} from "../../../api/models/funcionario-dto";
import {CategoriaDto} from "../../../api/models/categoria-dto";
import {UsuarioControllerService} from "../../../api/services/usuario-controller.service";
import {ClienteDto} from "../../../api/models/cliente-dto";
import {MensagensUniversais} from "../../../../MensagensUniversais";
import {SecurityService} from "../../../arquitetura/security/security.service";
import {Validacoes} from "../../../../Validacoes";
import {basename} from "@angular/compiler-cli";

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent implements OnInit{
  formGroup!: FormGroup;
  public readonly ACAO_INCLUIR = "Cadastrar";
  public readonly ACAO_EDITAR = "Editar";
  acao: string = this.ACAO_INCLUIR;
  codigo!: number;
  funcionarios: FuncionarioDto[] = [];
  usuario!: UsuarioDto;
  mensagens: MensagensUniversais = new MensagensUniversais(this.dialog, this.router, "usuario", this.snackBar)
  validacoes: Validacoes = new Validacoes();
  submitFormulario!: boolean;
  hide = true;
  admin!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private funcionarioService: FuncionarioControllerService,
    private usuarioService: UsuarioControllerService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private securityService: SecurityService,
  ) {
    this._adapter.setLocale('pt-br');
    this.createForm();
  }

  ngOnInit() {
    this._adapter.setLocale('pt-br');
    this.carregarFuncionarios();
    this.prepararEdicao();
  }

  carregarFuncionarios() {
    this.funcionarioService.funcionarioControllerListAll().subscribe(
      (funcionarios: FuncionarioDto[]) => {
        this.funcionarios = funcionarios;
      },
      (error) => {
        console.error('Erro ao carregar funcionario:', error);
        this.mensagens.confirmarErro("Carregar Funcionarios", error.message)
      }
    );
  }

  validarSenhas() {
    // Obtém os valores das senhas
    const senha = this.formGroup.get('senha')?.value;
    const confirmarSenha = this.formGroup.get('confirmarSenha')?.value;
    // Verifica se as senhas são iguais

    if (senha !== confirmarSenha && confirmarSenha && confirmarSenha !== '') {
      // Adiciona um erro personalizado ao formulário
      this.formGroup.get('confirmarSenha')?.setErrors({ 'naoConfere': true });
      // Retorna falso
      return false;
    }
    // Retorna verdadeiro
    return true;
  }


  private createForm() {
    if(this.acao == "Editar"){
      this.usuarioService.usuarioControllerObterPorId({id: this.codigo as number}).
      subscribe(retorno =>
          this.formGroup = this.formBuilder.group({
            funcionarioNome: [retorno.funcionarioNome, Validators.required],
            senha: [retorno.senha, [Validators.required,
                    Validators.minLength(6),
                    this.validacoes.validarCaracterEspecial,
                    this.validacoes.validarLetraMaiuscula,
                    this.validacoes.validarPeloMenosTresNumeros]],
            confirmarSenha: [null, Validators.required]
          }));
    }else{
      this.formGroup = this.formBuilder.group({
        funcionarioNome: [null, Validators.required],
        senha: [null, [Validators.required,
          Validators.minLength(6),
          this.validacoes.validarCaracterEspecial,
          this.validacoes.validarLetraMaiuscula,
          this.validacoes.validarPeloMenosTresNumeros]],
        confirmarSenha: [null, Validators.required]
      })
    }
  }

  onSubmit() {
    // Valida as senhas
    this.submitFormulario = true;
    if (!this.validarSenhas()) {
      return;
    }

    if (this.formGroup.valid) {
      if(!this.codigo){
        console.log("teste");
        this.realizarInclusao();
      }else{
        this.realizarEdicao();
      }
    } else {
      console.log(this.formGroup.value);
    }
  }

  private realizarInclusao(){
    let novoUsuario: UsuarioDto;
    novoUsuario = {};
    novoUsuario.funcionarioCpf = this.formGroup.get("funcionarioNome")?.value;
    novoUsuario.senha = this.formGroup.get("senha")?.value;
    console.log("Dados:",this.formGroup.value);
    this.usuarioService.usuarioControllerIncluir({body: novoUsuario})
      .subscribe( retorno =>{
        console.log("Retorno:",retorno);
        this.confirmarAcao(retorno,this.ACAO_INCLUIR);
        this.router.navigate(["/usuario"]);
      }, erro =>{
        console.log("Erro:"+erro);
        this.mensagens.confirmarErro(this.ACAO_INCLUIR, erro.message)
      })
  }


  limparFormulario() {
    this.formGroup.reset();
    this.formGroup.patchValue({
      usuarioId: this.securityService.getUserId()
    });
  }


  private prepararEdicao() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId){
      const codigo = parseInt(paramId);
      console.log("codigo",paramId);
      this.usuarioService.usuarioControllerObterPorId({id: codigo}).subscribe(
        retorno => {
          this.acao = this.ACAO_EDITAR;
          console.log("retorno", retorno);
          this.codigo = retorno.codigo || 0;
          this.formGroup.patchValue(retorno);
        },error => {
          this.mensagens.confirmarErro(this.ACAO_EDITAR, error.message)
          console.log("erro", error);
        }
      )
    }
  }

  confirmarAcao(usuarioDto: UsuarioDto, acao: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Cadastro!',
        mensagem: `Ação de ${acao} dados: ${usuarioDto.funcionarioNome} (ID: ${usuarioDto.codigo}) realizada com sucesso!`,
        textoBotoes: {
          ok: 'Confirmar',
        },
      },
    });
  }

  private realizarEdicao(){
    console.log("Dados:", this.formGroup.value);
    this.usuarioService.usuarioControllerObterPorId({id: this.codigo}).subscribe(retorno =>{
      this.usuario = retorno;
      this.usuario.senha = this.formGroup.get('senha')?.value;
      this.usuarioService.usuarioControllerAlterar( {id: this.codigo as number, body: this.usuario})
        .subscribe(retorno => {
          console.log("Retorno:", retorno);
          this.confirmarAcao(retorno, this.ACAO_EDITAR);
          this.router.navigate(["/usuario"]);
        }, erro => {
          console.log("Erro:", erro.error);
          this.mensagens.confirmarErro(this.ACAO_EDITAR, erro.message)
        })
    });
  }

  getErrorClass(controlName: string): { [key: string]: any } | null {
    const control = this.formGroup.get(controlName);

    if (this.submitFormulario && control && control.errors){
      const qdErros = Object.keys(control.errors).length;

      return {
        'margin-top': 17 * qdErros + 'px'
      };
    }

    if (!this.submitFormulario && control && control.errors && control.touched){
      const qdErros = Object.keys(control.errors).length;

      return {
        'margin-top': 17 * qdErros + 'px'
      };
    }
    this.submitFormulario = false;
    return {};
  }




}
