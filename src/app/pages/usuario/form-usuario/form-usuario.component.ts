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

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent implements OnInit{
  formGroup!: FormGroup;
  public readonly ACAO_INCLUIR = "Cadastro";
  public readonly ACAO_EDITAR = "Editar";
  acao: string = this.ACAO_INCLUIR;
  codigo!: number;
  funcionarios: FuncionarioDto[] = [];
  usuario!: UsuarioDto;

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private funcionarioService: FuncionarioControllerService,
    private usuarioService: UsuarioControllerService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
      }
    );
  }

  validarSenhas() {
    // Obtém os valores das senhas
    const senha = this.formGroup.get('senha')?.value;
    const confirmarSenha = this.formGroup.get('confirmarSenha')?.value;
    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
      // Adiciona um erro personalizado ao formulário
      this.formGroup.get('confirmarSenha')?.setErrors({
        igual: {
          message: 'As senhas não são iguais. Por favor, verifique e tente novamente.',
        },
      });
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
            senha: [retorno.senha, Validators.required, Validators.minLength(6)],
            confirmarSenha: [null, Validators.required]
          }));
    }else{
      this.formGroup = this.formBuilder.group({
        funcionarioNome: [null, Validators.required],
        senha: [null, [Validators.required, Validators.minLength(6)]],
        confirmarSenha: [null, Validators.required]
      })
    }
  }



  onSubmit() {
    // Valida as senhas
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
    this.usuarioService.usuarioControllerIncluir({usuarioDTO: novoUsuario})
      .subscribe( retorno =>{
        console.log("Retorno:",retorno);
        this.confirmarInclusao(retorno);
        this.router.navigate(["/usuario"]);
      }, erro =>{
        console.log("Erro:"+erro);
        alert("Erro ao incluir!");
      })
  }


  confirmarInclusao(usuarioDto: UsuarioDto){
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Inclusão de: (ID: ${usuarioDto.codigo}) realiza com sucesso!`,
        textoBotoes: {
          ok: 'ok',
        },
      },
    });
  }


  limparFormulario() {
    this.formGroup.reset(); // limpa os campos do formulario.
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
          console.log("erro", error);
        }
      )
    }
  }

  confirmarAcao(usuarioDto: UsuarioDto, acao: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Ação de ${acao} dados: ${usuarioDto.funcionarioNome} (ID: ${usuarioDto.codigo}) realizada com sucesso!`,
        textoBotoes: {
          ok: 'ok',
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
        })
    });
  }
}
