import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  hide: boolean = false;

  userData = { name: '', email: '', password: '' };

  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    Username: ['', [Validators.required]],
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

  gotolog() {
    this.router.navigate(['/']);
  }
  async registerUser() {
    this.auth
      .register(this.userData.name, this.userData.email, this.userData.password)
      .subscribe({
        next: (data) => {
          //store token from response data
          this.auth.storeToken(data.idToken);
          console.log('Registered idtoken is ' + data.idToken);
          this.auth.canAuthenticate();
        },
        error: (data) => {
          if (data.error.error.message == 'INVALID_EMAIL') {
            this.errorMsg = 'Invalid Email!';
          } else if (data.error.error.message == 'EMAIL_EXISTS') {
            this.errorMsg = 'Already Email Exists!';
          } else {
            this.errorMsg = 'Unknown error occured when creating this account!';
          }
        },
      })
      .add(() => {
        console.log('Register process completed!');
      });
  }
}
