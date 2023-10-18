import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-form-funcionario',
  templateUrl: './form-funcionario.component.html',
  styleUrls: ['./form-funcionario.component.scss']
})
export class FormFuncionarioComponent implements OnInit{
  formGroup!: FormGroup;
  public readonly ACAO_INCLUIR = "Cadastro";
  public readonly ACAO_EDITAR = "Editar";
  acao: string = this.ACAO_INCLUIR;
  codigo!: string;
  cargos: CargoDto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private funcionarioService: FuncionarioControllerService,
    private cargoService: CargoControllerService,
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
      }
    );
  }



  private createForm() {
    if(this.acao == "Editar"){
      this.funcionarioService.funcionarioControllerObterPorId({id: this.codigo}).
      subscribe(retorno =>
          this.formGroup = this.formBuilder.group({
            nome: [retorno.nome, Validators.required],
            cpf: [retorno.cpf, Validators.required],
            nascimento: [retorno.nascimento, Validators.required],
            telefone: [retorno.telefone, Validators.required],
            email: [retorno.email, Validators.required],
            cargoId: [retorno.cargoId, Validators.required]
          }));
    }else{
      this.formGroup = this.formBuilder.group({
        nome: [null, Validators.required],
        cpf: [null, Validators.required],
        nascimento: [null, Validators.required],
        telefone: [null, Validators.required],
        email: [null, Validators.required],
        cargoId: [null, Validators.required]
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
    console.log("Dados:",this.formGroup.value);
    this.funcionarioService.funcionarioControllerIncluir({body: this.formGroup.value})
      .subscribe( retorno =>{
        console.log("Retorno:",retorno);
        this.confirmarInclusao(retorno);
        this.router.navigate(["/funcionario"]);
      }, erro =>{
        console.log("Erro:"+erro);
        alert("Erro ao incluir!");
      })
  }


  confirmarInclusao(funcionarioDto: FuncionarioDto){
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        titulo: 'Mensagem!!!',
        mensagem: `Inclusão de: ${funcionarioDto.nome} (ID: ${funcionarioDto.cpf}) realiza com sucesso!`,
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
      const codigo = paramId;
      console.log("cpf",paramId);
      this.funcionarioService.funcionarioControllerObterPorId({id: codigo}).subscribe(
        retorno => {
          this.acao = this.ACAO_EDITAR;
          console.log("retorno", retorno);
          this.codigo = retorno.codigo || "";
          this.formGroup.patchValue(retorno);
        },error => {
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
          ok: 'ok',
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
        //this.showError(erro.error, this.ACAO_EDITAR);
      })
  }

}
