import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Bind } from '../../../models/bind';
import { ServerService } from 'src/app/services/server.service';
import { Router } from '@angular/router';
import { TransporterService } from 'src/app/services/transporter.service';
import { TokenStore } from 'src/app/utils/token-store';
import { HttpErrorResponse } from '@angular/common/http';
import { Toast } from 'src/app/utils/toast';

declare var M: any;

@Component({
  selector: 'app-bind-new',
  templateUrl: './bind-new.component.html',
  styleUrls: ['./bind-new.component.css']
})
export class BindNewComponent implements OnInit {

  form: FormGroup;
  servers: Bind[];
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
        new Toast().showToast('Sessão Expirada!', 'blue', 10000);
        this.route.navigate(['/login']);
      });
    this.form = this.fb.group({
      name: [null, Validators.required],
      lastupdate: [new Date()],
      ip: [null,
        [
          Validators.required,
          Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
        ]
      ],
      port: [22, Validators.required]
    });
    setTimeout(() => { // PRECISA DAR ESSE TEMPO PRA CONSTRUIR O HTML
      M.updateTextFields();
    }, 1000);
  }
  save(){
    if(this.form.valid){
      let send = true;
      this.servers.forEach(s => {
        if (this.form.controls.name.value.toLowerCase() === s.name.toLowerCase()) {
          new Toast().showToast('Servidor Bind com nome: ' + this.form.controls.name.value + ' já existe!', 'red', 30000);
          send = false;
        }
      });
      if (send) {
        this.loading = false;
        this.server.postServer('binds', this.form.value).subscribe(res => {
          new Toast().showToast(res.txt, 'green', 10000);
          this.route.navigate(['menu/binds']);
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
