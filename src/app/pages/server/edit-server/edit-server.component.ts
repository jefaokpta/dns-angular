import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Server } from '../../../models/server';
import { TransporterService } from '../../../services/transporter.service';
import { ServerService } from '../../../services/server.service';
import { TokenStore } from 'src/app/utils/token-store';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Toast } from '../../../utils/toast';
import { TokenService } from '../../../services/token.service';

declare var M: any;

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit {

  form: FormGroup;

  constructor(
    private transport: TransporterService,
    private server: ServerService,
    private route: Router,
    private fb: FormBuilder,
    private token: TokenService
  ) { }

  servers: Server[];
  serverEdit: Server;
  loading = true;

  ngOnInit() {
    this.serverEdit = this.transport.getObj()[0].server;
    this.servers = this.transport.getObj()[1].servers;

    this.form = this.fb.group({
      id: [this.serverEdit.id],
      name: [this.serverEdit.name, Validators.required],
      ip: [this.serverEdit.ip,
        [
          Validators.required,
          Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
        ]
      ]
    });
    setTimeout(() => { // PRECISA DAR ESSE TEMPO PRA CONSTRUIR O HTML
      M.updateTextFields();
    }, 1000);
  }
  edit(){
    if(this.form.valid){
      let send = true;
      this.servers.forEach(s => {
        if (this.form.controls.name.value.toLowerCase() === s.name.toLowerCase()
          && this.serverEdit.id !== s.id) {
          new Toast().showToast('Servidor com nome: ' + this.form.controls.name.value + ' já existe!', 'red', 30000);
          send = false;
        }
      });
      if (send) {
        this.loading = false;
        this.server.updateServerSpring('protected/servers', this.form.value).subscribe(res => {
           new Toast().showToast('Editado ' + this.form.controls.name.value, 'green', 10000);
           this.route.navigate(['menu/servers']);
         },
         (err: HttpErrorResponse) => {
           this.loading = true;
           new Toast().showToast(err.error.txt, 'red', 30000);
         }
        );
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
