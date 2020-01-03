import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../../../services/server.service';
import { Router } from '@angular/router';
import { Server } from '../../../models/server';
import { TransporterService } from '../../../services/transporter.service';
import { TokenStore } from '../../../utils/token-store';
import { Toast } from '../../../utils/toast';
import { TokenService } from '../../../services/token.service';



@Component({
  selector: 'app-new-server',
  templateUrl: './new-server.component.html',
  styleUrls: ['./new-server.component.css']
})
export class NewServerComponent implements OnInit {

  form: FormGroup;
  servers: Server[];
  loading = true;

  constructor(
    private fb: FormBuilder,
    private server: ServerService,
    private route: Router,
    private transport: TransporterService,
    private token: TokenService
  ) { }

  ngOnInit() {
    this.servers = this.transport.getObj();
    this.form = this.fb.group({
      name: [null, Validators.required],
      ip: [null,
        [
          Validators.required,
          Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
        ]
      ]
    });
  }
  save(){
    if(this.form.valid){
      let send = true;
      this.servers.forEach(s => {
        if (this.form.controls.name.value.toLowerCase() === s.name.toLowerCase()) {
          new Toast().showToast('Servidor com nome: ' + this.form.controls.name.value + ' já existe!', 'red', 30000);
          send = false;
        }
      });
      if (send) {
        this.loading = false;
        this.server.postServerSpring('protected/servers', this.form.value).subscribe(res => {
          const s = res as Server;
          new Toast().showToast('Criado ' + s.name, 'green', 10000);
          this.route.navigate(['menu/servers']);
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
