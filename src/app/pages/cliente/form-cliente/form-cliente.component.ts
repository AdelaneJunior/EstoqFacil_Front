import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss']
})
export class FormClienteComponent implements OnInit{
  formGroup!: FormGroup;
  public readonly ACAO_INCLUIR = "Cadastro";
  public readonly ACAO_EDITAR = "Editar";
  acao: string = this.ACAO_INCLUIR;
  codigo!: number;

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private clienteService: ClienteControllerService,
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
    this.prepararEdicao();
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
        nome: [null, Validators.required],
        cpf: [null, Validators.required],
        selectedDate: [null, Validators.required],
        telefone: [null, Validators.required],
        email: [null, Validators.required]
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
    const clienteDto: ClienteDto = {
      nome: this.formGroup.value.nome,
      cpf: this.formGroup.value.cpf,
      nascimento: this.formGroup.value.selectedDate,
      telefone: this.formGroup.value.telefone,
      email: this.formGroup.value.email,
    };
    console.log("Dados:",this.formGroup.value);
    this.clienteService.clienteControllerIncluir({body: clienteDto})
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

  confirmarInclusao(clienteDto: ClienteDto){
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Inclusão de: ${clienteDto.nome} (ID: ${clienteDto.codigo}) realiza com sucesso!`,
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
