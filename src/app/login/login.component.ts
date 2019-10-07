import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin:FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    $('body').css('background-image', 'url("assets/img/www.png")');
    $('body').css('background-repeat', 'no-repeat');
    this.formLogin = this.fb.group({
      user: [null, Validators.required],
      pass: [null, Validators.required]
    });
  }
  login(){
    console.log(this.formLogin.value);
  }
}
