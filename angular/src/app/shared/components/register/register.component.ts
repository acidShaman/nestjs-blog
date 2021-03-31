import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CustomValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.registerForm = this.fb.group({
      email: [null ,[Validators.required, Validators.email]],
      username: [null ,[Validators.required, Validators.minLength(5)]],
      name: [null ,[Validators.required, Validators.minLength(5)]],
      password: [null ,[Validators.required, Validators.minLength(6), CustomValidator.passwordContainsNumber]],
      repeatPassword: [null ,[Validators.required]]
    }, {
      validators: CustomValidator.passwordsMatch
    })
   }

  ngOnInit(): void {
    this.registerForm.valueChanges.subscribe( () => {
      console.log(this.registerForm.value);
    })
  }

  createUser() {
    const {repeatPassword, ...credentials} = this.registerForm.value;
    this.auth.create(credentials).subscribe(console.log);
  }

}
