import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStore } from '../../utils/token-store';
import { TransporterService } from '../../services/transporter.service';

declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user = '';

  constructor(
    private route: Router,
    private transport: TransporterService
  ) { }

  ngOnInit() {
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown();
    this.user = this.transport.getObj().toString();
  }
  logout(){
    new TokenStore().removeToken();
    this.route.navigate(['login']);
  }
}
