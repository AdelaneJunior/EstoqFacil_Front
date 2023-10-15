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
  }

  ngOnInit() {
    this.createForm();
    this._adapter.setLocale('pt-br');
    this.carregarFuncionarios();
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

  confirmarSenhaValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const senha = control.get('senha');
    const confirmarSenha = control.get('confirmarSenha');

    if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
      return { senhasDiferentes: true };
    }

    return null;
  }


  private createForm() {
    if(this.acao == "Editar"){/*
      this.produtoService.produtoControllerObterPorId({id: this.codigo as number}).
      subscribe(retorno =>
          this.formGroup = this.formBuilder.group({
            titulo: [retorno.titulo, Validators.required],
            autor: [retorno.autor, Validators.required],
            editora: [retorno.editora, Validators.required],
            anoPublicacao: [retorno.anoPublicacao, Validators.required],
            genero: [retorno.genero, Validators.required],
            numeroDePaginas: [retorno.numeroDePaginas, Validators.required]
          }));*/
    }else{
      this.formGroup = this.formBuilder.group({
        funcionarioCodigo: [null, Validators.required],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', Validators.required],
      }, {
        validators: this.confirmarSenhaValidator
      })
    }
  }



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
    let novoUsuario: UsuarioDto;
    novoUsuario = {};
    novoUsuario.funcionarioCodigo = this.formGroup.get("funcionarioCodigo")?.value;
    novoUsuario.senha = this.formGroup.get("senha")?.value;
    console.log("Dados:",this.formGroup.value);
    this.usuarioService.usuarioControllerIncluir({usuarioDTO: novoUsuario})
      .subscribe( retorno =>{
        console.log("Retorno:",retorno);
        this.confirmarInclusao(retorno);
        this.router.navigate(["/funcionario"]);
      }, erro =>{
        console.log("Erro:"+erro);
        alert("Erro ao incluir!");
      })
  }

  private realizarEdicao(){}

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

  }
}
