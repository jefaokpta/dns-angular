import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { ServerService } from 'src/app/services/server.service';
import { Router } from '@angular/router';
import { TransporterService } from 'src/app/services/transporter.service';
import { TokenStore } from 'src/app/utils/token-store';
import { HttpErrorResponse } from '@angular/common/http';
import { Toast } from 'src/app/utils/toast';
import { TokenService } from '../../../services/token.service';

declare var $: any;

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.css']
})
export class ClientViewComponent implements OnInit {

  clients: Client[] = [];
  loading = false;
  clientDelete: Client;
  filter = '';

  constructor(
    private server: ServerService,
    private route: Router,
    private transport: TransporterService,
    private token: TokenService
  ) { }

  ngOnInit() {
    $('.fixed-action-btn').fadeOut();
    $(window).on('scroll', function() { // ESCONDE BOTAO QND TOP
      const scrollPos = $(window).scrollTop();
      if (scrollPos <= 500) {
          $('.fixed-action-btn').fadeOut();
      } else {
          $('.fixed-action-btn').fadeIn();
      }
    });

    this.clientDelete = new Client();
    $('.modal').modal();
    this.server.getServerSpring('protected/clients').subscribe(res => {
       this.clients = res as Client[];
       this.loading = true;
     }, (err: HttpErrorResponse) => {
       console.log(err.status);
       console.log(err.error);
       this.route.navigate(['login']);
     });
  }
  confirmDelete(client: Client){
    this.clientDelete = client;
  }
  deleteClient(){
    this.clients.splice(this.clients.indexOf(this.clientDelete), 1);
    this.server.deleteServer('clients', this.clientDelete.id).subscribe(res => {
       new Toast().showToast(res.txt, 'green', 10000);
    },
    (err: HttpErrorResponse) => {
      console.log(err);
      new Toast().showToast(err.error.txt, 'red', 10000);
    });
  }
  editClient(clientEdit: Client){
    this.transport.setObj([
      {client: clientEdit},
      {clients: this.clients}
    ]);
    this.route.navigate(['menu/clients/edit']);
  }
  newClient(){
    this.transport.setObj(this.clients);
    this.route.navigate(['menu/clients/new']);
  }
  filterTable(): Client[] {
    if (this.clients.length === 0 || this.filter === 'undefined' || this.filter.trim() === '') {
      return this.clients;
    }
    return this.clients.filter(client => {
      return client.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 ? true :
        client.id.toString().toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 ? true :
          client.dnss.length > 0 ? client.dnss[0].description.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 : false;
    });
  }
  toSearch(){
    $('html, body').animate({
      scrollTop: $('#icon_prefix').offset().top-200
    }, 1500, function(){$( '#icon_prefix' ).focus();});
  }
}
