import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenStore } from '../utils/token-store';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin:FormGroup;
  loginError = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private server: ServerService,
    private route: Router
  ) {}

  ngOnInit() {
    //$('body').css('background-image', 'url("assets/img/www.png")');
    //$('body').css('background-repeat', 'no-repeat');
    this.formLogin = this.fb.group({
      name: [null, Validators.required],
      password: [null, Validators.required]
    });
  }
  login(){
    if(this.formLogin.valid){
      console.log(this.formLogin.value)
      this.loginError = true;
      this.server.postServer('dns', this.formLogin.value).subscribe(res => {
        console.log(res);
        new TokenStore().setToken(res.token);
        this.route.navigate(['menu']);
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
  validOrTouched(field): boolean{
    return !this.formLogin.get(field).valid && this.formLogin.get(field).touched;
  }
}
