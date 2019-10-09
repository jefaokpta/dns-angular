import { Component, OnInit } from '@angular/core';
import { Server } from '../../models/server';
import { ServerService } from 'src/app/services/server.service';
import { TokenStore } from 'src/app/utils/token-store';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {

  servers: Server[];
  constructor(
    private server: ServerService,
    private route: Router
  ) {}

  ngOnInit() {
    this.server.getServer('servers').subscribe(res => {
      new TokenStore().setToken(res.token);
      this.servers = res.data as Server[];
    },
    (err: HttpErrorResponse) => {
      console.log(err.status);
      console.log(err.error);
      this.route.navigate(['login']);
    });
  }

}
