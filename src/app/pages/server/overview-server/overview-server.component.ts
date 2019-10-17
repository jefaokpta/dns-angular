import { Component, OnInit } from '@angular/core';
import { Server } from 'src/app/models/server';
import { ServerService } from 'src/app/services/server.service';
import { Router } from '@angular/router';
import { TokenStore } from 'src/app/utils/token-store';
import { HttpErrorResponse } from '@angular/common/http';
import { TransporterService } from '../../../services/transporter.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-overview-server',
  templateUrl: './overview-server.component.html',
  styleUrls: ['./overview-server.component.css']
})
export class OverviewServerComponent implements OnInit {

  servers: Server[];
  loading = false;
  serverDelete: Server;
  filter = '';
  constructor(
    private server: ServerService,
    private route: Router,
    private transport: TransporterService
  ) {}

  ngOnInit() {
    $('.modal').modal();
    this.server.getServer('servers').subscribe(res => {
      new TokenStore().setToken(res.token);
      this.servers = res.data as Server[];
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
    // this.server.deleteServer('servers', server.id).subscribe(res => {
    //   M.toast({
    //     html: res.txt,
    //     displayLength: 10000,
    //     classes: 'blue'
    //   });
      console.log(this.servers.splice(this.servers.indexOf(this.serverDelete),1))
      //this.filterTable();
    //});
  }
  newServer(){
    this.transport.setObj(this.servers);
    this.route.navigate(['menu/servers/new-server']);
  }
  filterTable(){
    if (this.servers.length === 0 || this.filter === 'undefined' || this.filter.trim() === '') {
      return this.servers;
    }
    return this.servers.filter(server => {
      return server.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 ? true :
        server.ip.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 ? true :
          server.id.toString().toLowerCase().indexOf(this.filter.toLowerCase()) >= 0;
    });
  }

}
