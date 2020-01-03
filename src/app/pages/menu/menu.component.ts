import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransporterService } from '../../services/transporter.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from '../../services/server.service';
import { Toast } from '../../utils/toast';
import { TokenService } from '../../services/token.service';

declare var $: any;
declare var M: any;

interface User {
  id: number;
  name: string;
  password: string;
  username: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user: User;
  formUser: FormGroup;

  constructor(
    private route: Router,
    private transport: TransporterService,
    private fb: FormBuilder,
    private server: ServerService,
    private token: TokenService
  ) { }

  ngOnInit() {
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown();
    this.user = this.transport.getObj() || 'anonimo';

    this.formUser = this.fb.group({
      id: this.user.id,
      name: [this.user.name, Validators.required],
      password: [this.user.password, Validators.required]
    });
  }
  logout(){
    this.token.removeToken();
    this.route.navigate(['login']);
  }
  showFormUser(){
    setTimeout(() => { // PRECISA DAR ESSE TEMPO PRA CONSTRUIR O HTML
      M.updateTextFields();
    }, 1000);
  }
  updateUser(){
    if(this.formUser.valid){
      this.server.updateServer('dns', this.formUser.value).subscribe(res => {
        this.user = this.formUser.value;
        new Toast().showToast(res.txt, 'green', 15000);
        this.formUser.controls.password.setValue('');
      }, (err: HttpErrorResponse) => {
        console.log(err)
        new Toast().showToast(err.error, 'red', 30000);
      });
    }
  }
  validate(field: string){
    if(this.formUser.get(field).touched){
      if(this.formUser.get(field).invalid) {
        return 'invalid';
      }
      return 'valid';
    }
    return '';
  }
}
