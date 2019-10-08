import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { ServerComponent } from './server/server.component';
import { ClientComponent } from './client/client.component';
import { PagesRoutingModule } from './pages.routing.module';



@NgModule({
  declarations: [
    MenuComponent,
    ServerComponent,
    ClientComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
