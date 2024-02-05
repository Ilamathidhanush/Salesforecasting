import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide: boolean = false;

  userData = { email: '', password: '' };

  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value);
  }
  gotodash() {
    this.router.navigate(['/login']);
  }

  gotoreg() {
    this.router.navigate(['/register']);
  }

  login() {
    //call login service
    this.auth
      .login(this.userData.email, this.userData.password)
      .subscribe({
        next: (data) => {
          //store token
          this.auth.storeToken(data.idToken);
          console.log('logged user token is ' + data.idToken);
          this.auth.canAuthenticate();
        },
        error: (data) => {
          console.log(data.error.error.message);
          if (
            data.error.error.message == 'INVALID_PASSWORD' ||
            data.error.error.message == 'INVALID_EMAIL'
          ) {
            this.errorMsg = 'Invalid Credentials!';
            console.error('Invalid Credentials!');
          } else if (
            data.error.error.message.includes('TOO_MANY_ATTEMPTS_TRY_LATER')
          ) {
            this.errorMsg = 'Account suspended temporarily, Try later';
            console.log('Account suspended temporarily, Try later');
          } else {
            this.errorMsg = 'Unknown error when logging into this account!';
            console.error('Unknown error when logging into this account!');
          }
        },
      })
      .add(() => {
        console.log('login process completed!');
      });
  }
}
