import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenStore } from '../utils/token-store';
import { Router } from '@angular/router';
import { CryptoInfo } from '../utils/crypto-info';
import { TransporterService } from '../services/transporter.service';
import { TokenService } from '../services/token.service';
import { stringify } from 'querystring';
import { toBase64String } from '@angular/compiler/src/output/source_map';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  loginError = true;
  errorMessage = '';
  loading = true;

  constructor(
    private fb: FormBuilder,
    private server: ServerService,
    private route: Router,
    private transport: TransporterService,
    private token: TokenService
  ) {}

  ngOnInit() {
    this.formLogin = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }
  login(){
    if(this.formLogin.valid){
      this.loading = false;
      this.loginError = true;
      const auth = btoa(this.formLogin.controls.username.value + ':' + this.formLogin.controls.password.value);
      this.server.postServerSpringLogin('protected/login', JSON.stringify({
        username: this.formLogin.controls.username.value
      }), auth)
      .subscribe(res => {
        this.token.setToken(auth);
        this.transport.setObj(res);
        this.loading = true;
        this.route.navigate(['menu/clients']);
      },
      (err: HttpErrorResponse) => {
        this.loading = true;
        console.log(err);
        this.loginError = false;
        if(err.status == 0) {
          this.errorMessage = 'Ops. Parece q o servidor ta down!';
        }
      });
    }
  }
  validate(field): boolean{
    return !this.formLogin.get(field).valid && this.formLogin.get(field).touched;
  }
}
