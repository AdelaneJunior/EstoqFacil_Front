import {isEmail} from "class-validator";
import {AbstractControl} from "@angular/forms";

export class Validacoes{
     validarEmail(control: AbstractControl): { [key: string]: any } | null {
         const email: string = control.value;

         if (!isEmail(email) && email != '' && control.touched) {
             return { 'emailInvalido': true };
         }

         return null;
     }
     
}
