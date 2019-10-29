import { Component, OnInit } from '@angular/core';
import { Server } from 'src/app/models/server';
import { ServerService } from 'src/app/services/server.service';
import { Router } from '@angular/router';
import { TokenStore } from 'src/app/utils/token-store';
import { HttpErrorResponse } from '@angular/common/http';
import { TransporterService } from '../../../services/transporter.service';
import { Toast } from '../../../utils/toast';

declare var $: any;

@Component({
  selector: 'app-overview-server',
  templateUrl: './overview-server.component.html',
  styleUrls: ['./overview-server.component.css']
})
export class OverviewServerComponent implements OnInit {

  servers: Server[] = [];
  loading = false;
  serverDelete: Server;
  filter = '';

  constructor(
    private server: ServerService,
    private route: Router,
    private transport: TransporterService
  ) {}

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
    this.serverDelete = new Server();
    $('.modal').modal();
    this.server.getServer('servers').subscribe(res => {
      new TokenStore().setToken(res.token);
      this.servers = res.data;
      this.loading = true;
      this.servers.forEach(s => {
        this.server.getServer('dns/' + s.ip).subscribe(resPing => {
          s.ping = resPing.txt === 'true' ? true : false;
          s.loading = true;
        });
      });
    },
    (err: HttpErrorResponse) => {
      console.log(err.status);
      console.log(err.error);
      this.route.navigate(['login']);
    });

  }
  confirmDelete(server: Server){
    this.serverDelete = server;
  }
  deleteServer(){
    this.servers.splice(this.servers.indexOf(this.serverDelete), 1);
    this.server.deleteServer('servers', this.serverDelete.id).subscribe(res => {
       new Toast().showToast(res.txt, 'green', 10000);
    },
    (err: HttpErrorResponse) => {
      console.log(err);
      new Toast().showToast(err.error.txt, 'red', 10000);
    });
  }
  editServer(serverEdit: Server){
    this.transport.setObj([
      {server: serverEdit},
      {servers: this.servers}
    ]);
    this.route.navigate(['menu/servers/edit-server']);
  }
  newServer(){
    this.transport.setObj(this.servers);
    this.route.navigate(['menu/servers/new-server']);
  }
  filterTable(): Server[] {
    if (this.servers.length === 0 || this.filter === 'undefined' || this.filter.trim() === '') {
      return this.servers;
    }
    return this.servers.filter(server => {
      return server.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 ? true :
        server.ip.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 ? true :
          server.id.toString().toLowerCase().indexOf(this.filter.toLowerCase()) >= 0;
    });
  }
  toSearch(){
    $('html, body').animate({
      scrollTop: $('#icon_prefix').offset().top-200
    }, 1500, function(){$( '#icon_prefix' ).focus();});
  }
}
