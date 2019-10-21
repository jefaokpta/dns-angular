import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStore } from '../../utils/token-store';

declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private route: Router
  ) { }

  ngOnInit() {
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown();
  }
  logout(){
    new TokenStore().removeToken();
    this.route.navigate(['login']);
  }
}
