import { Component, OnInit } from '@angular/core';
import { Bind } from '../../../models/bind';
import { ServerService } from 'src/app/services/server.service';
import { Router } from '@angular/router';
import { TransporterService } from 'src/app/services/transporter.service';
import { TokenStore } from 'src/app/utils/token-store';
import { HttpErrorResponse } from '@angular/common/http';
import { Toast } from 'src/app/utils/toast';

declare var $: any;

@Component({
  selector: 'app-bind-view',
  templateUrl: './bind-view.component.html',
  styleUrls: ['./bind-view.component.css']
})
export class BindViewComponent implements OnInit {

  servers: Bind[] = [];
  loading = false;
  loadingUpdate = true;
  serverDelete: Bind;
  serverUpdate: Bind;
  updateMsg: string[] = [];
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
    this.serverDelete = new Bind();
    this.serverUpdate = new Bind();
    $('.modal').modal();
    this.server.getServer('binds').subscribe(res => {
      new TokenStore().setToken(res.token);
      this.servers = res.data;
      this.loading = true;
      this.servers.forEach(bind => {
        this.server.getServer('dns/' + bind.ip).subscribe(resPing => {
          bind.ping = resPing.txt === 'true' ? true : false;
          bind.loading = true;
        });
      });
    },
    (err: HttpErrorResponse) => {
      console.log(err.status);
      console.log(err.error);
      this.route.navigate(['login']);
    });

  }
  showUpdateBind(server: Bind){
    this.updateMsg = [];
    this.serverUpdate = server;
  }
  updateBind(){
    this.loadingUpdate = false;
    this.server.getServer('binds/' + this.serverUpdate.id + "/files").subscribe(resFiles => {
      this.updateMsg.push(resFiles.txt);
      this.server.getServer('binds/' + this.serverUpdate.id + "/files/scp").subscribe(resScp => {
        this.updateMsg.push(resScp.txt);
        this.server.getServer('binds/' + this.serverUpdate.id + "/files/scp/restart").subscribe(resRestart => {
          this.updateMsg.push(resRestart.txt);

          this.server.getServer('binds/' + this.serverUpdate.id).subscribe(res => {
            const updated: Bind = res.data;
            updated.loading = true;
            updated.ping = this.serverUpdate.ping;
            this.servers.splice(this.servers.indexOf(this.serverUpdate), 1, updated);
            this.updateMsg.push(res.txt);
            new TokenStore().setToken(res.token);
            this.loadingUpdate = true;
          }, (err: HttpErrorResponse) => {
            this.updateMsg.push('DEU RUIM ATUALIZACAO');
            this.loadingUpdate = true;
          });

        }, (err: HttpErrorResponse) => {
          this.updateMsg.push('DEU RUIM RESTART');
          this.loadingUpdate = true;
        });
      }, (err: HttpErrorResponse) => {
        this.updateMsg.push('DEU RUIM NO SCP');
        this.loadingUpdate = true;
        console.log(err)
      });
    }, (err: HttpErrorResponse) => {
      this.updateMsg.push('DEU RUIM NA ESCRITA');
      this.loadingUpdate = true;
    });

  }
  confirmDelete(server: Bind){
    this.serverDelete = server;
  }
  deleteServer(){
    this.servers.splice(this.servers.indexOf(this.serverDelete), 1);
    this.server.deleteServer('binds', this.serverDelete.id).subscribe(res => {
       new Toast().showToast(res.txt, 'green', 10000);
    },
    (err: HttpErrorResponse) => {
      console.log(err);
      new Toast().showToast(err.error.txt, 'red', 10000);
    });
  }
  editServer(serverEdit: Bind){
    this.transport.setObj([
      {server: serverEdit},
      {servers: this.servers}
    ]);
    this.route.navigate(['menu/binds/edit']);
  }
  newServer(){
    this.transport.setObj(this.servers);
    this.route.navigate(['menu/binds/new']);
  }
  filterTable(): Bind[] {
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
