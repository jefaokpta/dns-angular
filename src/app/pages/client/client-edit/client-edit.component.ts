import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ServerService } from 'src/app/services/server.service';
import { TransporterService } from 'src/app/services/transporter.service';
import { Router } from '@angular/router';
import { Client } from '../../../models/client';
import { TokenStore } from 'src/app/utils/token-store';
import { HttpErrorResponse } from '@angular/common/http';
import { Server } from '../../../models/server';
import { Toast } from 'src/app/utils/toast';
import { TokenService } from '../../../services/token.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent implements OnInit {

  form: FormGroup;
  dnss: FormArray;
  filter = '';
  servers: Server[] = [];
  filteredServers: Server[] = [];

  constructor(
    private transport: TransporterService,
    private server: ServerService,
    private route: Router,
    private fb: FormBuilder,
    private token: TokenService
  ) { }

  clients: Client[];
  clientEdit: Client;
  loading = true;

  ngOnInit() {
    this.clientEdit = this.transport.getObj()[0].client;
    this.clients = this.transport.getObj()[1].clients;

    this.form = this.fb.group({
      id: [this.clientEdit.id],
      name: [this.clientEdit.name],
      dnss: this.fb.array(this.buildDnss())
    });

    this.server.getServer('servers').subscribe(res => {
      this.token.setToken(res.token);
      this.servers = res.data;
      this.filteredServers = res.data;
    },
    (err: HttpErrorResponse) => {
      console.log(err.status);
      console.log(err.error);
      this.route.navigate(['login']);
    });

    setTimeout(() => { // PRECISA DAR ESSE TEMPO PRA CONSTRUIR O HTML
          $('select').formSelect();
          M.updateTextFields();
        }, 1000);
  }
  buildDnss(): FormGroup[] {
    const fbInit: FormGroup[] = [];
    if (this.clientEdit.dnss.length === 0) {
      fbInit.push(this.createDns());
    } else {
      this.clientEdit.dnss.forEach(dns => {
        fbInit.push(this.fb.group({
          description: [dns.description, Validators.required],
          serverdns: [dns.serverdns, Validators.required],
          idclient: [dns.idclient],
          id: [dns.id]
        }));
      });
    }
    return fbInit;
  }
  createDns(): FormGroup {
    return this.fb.group({
      description: [null, Validators.required],
      serverdns: [null, Validators.required],
      idclient: [this.clientEdit.id]
    });
  }

  addDns(){
    this.dnss.push(this.createDns());
    setTimeout(() => { // PRECISA DAR ESSE TEMPO PRA CONSTRUIR O HTML
      $('select').formSelect();
    }, 1000);
  }
  removeDns(index: number){
    this.dnss.removeAt(index);
  }

  edit(){
    if(this.form.valid){
      this.loading = false;
      this.server.updateServer('clients', this.form.value).subscribe(res => {
          new Toast().showToast(res.txt, 'green', 10000);
          this.route.navigate(['menu/clients']);
        },
        (err: HttpErrorResponse) => {
          this.loading = true;
          new Toast().showToast(err.error.txt, 'red', 30000);
        }
      );
    }
  }
  validate(field: string, index: number){
    this.dnss = this.form.get('dnss') as FormArray;
    const item = this.dnss.controls[index] as FormGroup;

    if(item.controls[field].touched){
      if(item.controls[field].invalid) {
        return 'invalid';
      }
      return 'valid';
    }
    return '';
  }
  filterSelect(){
    if (this.servers.length === 0 || this.filter === 'undefined' || this.filter.trim() === '') {
      this.filteredServers = this.servers;
    }
    this.filteredServers = this.servers.filter(server => {
      return server.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0;
    });

    this.dnss.push(this.createDns());
    setTimeout(() => { // PRECISA DAR ESSE TEMPO PRA CONSTRUIR O HTML
      $('select').formSelect();
    }, 1000);
    this.dnss.removeAt(this.dnss.length - 1);
  }
}

