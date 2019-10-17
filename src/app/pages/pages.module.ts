import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MenuComponent } from './menu/menu.component';
import { ServerComponent } from './server/server.component';
import { ClientComponent } from './client/client.component';
import { PagesRoutingModule } from './pages.routing.module';
import { NewServerComponent } from './server/new-server/new-server.component';
import { EditServerComponent } from './server/edit-server/edit-server.component';
import { OverviewServerComponent } from './server/overview-server/overview-server.component';



@NgModule({
  declarations: [
    MenuComponent,
    ServerComponent,
    ClientComponent,
    NewServerComponent,
    EditServerComponent,
    OverviewServerComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
