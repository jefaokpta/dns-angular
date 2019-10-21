import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenStore } from '../utils/token-store';
import { Router } from '@angular/router';
import { CryptoInfo } from '../utils/crypto-info';

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

  constructor(
    private fb: FormBuilder,
    private server: ServerService,
    private route: Router
  ) {}

  ngOnInit() {
    this.formLogin = this.fb.group({
      name: [null, Validators.required],
      password: [null, Validators.required]
    });
  }
  login(){
    if(this.formLogin.valid){
      this.loginError = true;
      this.server.postServer('dns', JSON.stringify({
        name: this.formLogin.controls.name.value,
        password: 'HASH ' + new CryptoInfo().encrypString(this.formLogin.controls.password.value)
      }))
      .subscribe(res => {
        new TokenStore().setToken(res.token);
        this.route.navigate(['menu/servers']);
      },
      (err: HttpErrorResponse) => {
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
