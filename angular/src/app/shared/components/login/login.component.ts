import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit(): void {
    // this.loginForm = this.fb.group({
    //   email: ['', Validators.required, Validators.email],
    //   password: ['', Validators.required, Validators.minLength(6)]
    // });
    console.log(this.loginForm);
  }

  authUser() {
    this.authService.auth(this.loginForm.value).subscribe( res => {
      console.log(res);
    });
  }

}
