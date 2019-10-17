import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../../../services/server.service';
import { Router } from '@angular/router';
import { Server } from '../../../models/server';
import { TransporterService } from '../../../services/transporter.service';
import { TokenStore } from '../../../utils/token-store';

declare var M: any;

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
    private transport: TransporterService
  ) { }

  ngOnInit() {
    this.servers = this.transport.getObj();
    this.server.getServer('ping').subscribe(res => {
      new TokenStore().setToken(res.token);
    }, (err: HttpErrorResponse) => {
        console.log(err.error);
        console.log(err.status);
        M.toast({
          html: 'Sessão Expirada!',
          displayLength: 10000,
          classes: 'blue'
        });
        this.route.navigate(['/login']);
      });
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
          M.toast({
            html: 'Servidor com nome: ' + this.form.controls.name.value + ' já existe!',
            displayLength: 30000,
            classes: 'red'
          });
          send = false;
        }
      });
      if (send) {
        this.loading = false;
        this.server.postServer('servers', this.form.value).subscribe(res => {
          M.toast({
            html: res.txt,
            displayLength: 10000,
            classes: 'blue'
          });
          this.route.navigate(['menu/servers']);
        },
        (err: HttpErrorResponse) => {
          this.loading = true;
          M.toast({
            html: err.error,
            displayLength: 30000,
            classes: 'red'
          });
        });
      }
    }
  }
  validOrTouched(field){
    if(this.form.get(field).touched){
      if(this.form.get(field).invalid) {
        return 'invalid';
      }
      return 'valid';
    }
    return '';
  }
}
