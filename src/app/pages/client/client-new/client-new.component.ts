import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Client } from '../../../models/client';
import { ServerService } from 'src/app/services/server.service';
import { Router } from '@angular/router';
import { TransporterService } from 'src/app/services/transporter.service';
import { TokenStore } from 'src/app/utils/token-store';
import { HttpErrorResponse } from '@angular/common/http';
import { Toast } from 'src/app/utils/toast';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-client-new',
  templateUrl: './client-new.component.html',
  styleUrls: ['./client-new.component.css']
})
export class ClientNewComponent implements OnInit {

  form: FormGroup;
  clients: Client[];
  loading = true;

  constructor(
    private fb: FormBuilder,
    private server: ServerService,
    private route: Router,
    private transport: TransporterService,
    private token: TokenService
  ) { }

  ngOnInit() {
    this.clients = this.transport.getObj();
    this.form = this.fb.group({
      name: [null, Validators.required]
    });
  }
  save(){
    if(this.form.valid){
      let send = true;
      this.clients.forEach(s => {
        if (this.form.controls.name.value.toLowerCase() === s.name.toLowerCase()) {
          new Toast().showToast('Cliente com nome: ' + this.form.controls.name.value + ' já existe!', 'red', 30000);
          send = false;
        }
      });
      if (send) {
        this.loading = false;
        this.server.postServerSpring('protected/clients', this.form.value).subscribe(res => {
          const ret = res as Client;
          new Toast().showToast('Criado ' + ret.name, 'green', 10000);
          this.route.navigate(['menu/clients']);
        },
        (err: HttpErrorResponse) => {
          this.loading = true;
          new Toast().showToast(err.error.txt, 'red', 30000);
        });
      }
    }
  }
  validate(field: string){
    if(this.form.get(field).touched){
      if(this.form.get(field).invalid) {
        return 'invalid';
      }
      return 'valid';
    }
    return '';
  }

}
