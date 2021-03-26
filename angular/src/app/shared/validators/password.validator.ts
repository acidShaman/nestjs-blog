import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidator {
    static passwordContainsNumber(control: AbstractControl): ValidationErrors | null {
        const regex = /\d/;

        if (regex.test(control.value) && control.value !== null) {
            return null;
        } else {
            return {passwordInvalid: true};
        }

    }

    static passwordsMatch(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const passwordConfirm = control.get('repeatPassword')?.value;
        if ((password === passwordConfirm) && (password !== null && passwordConfirm != null)) {
            return null;
        } else {
            return {passwordsDoNotMatch: true};
        }
    } 
}
