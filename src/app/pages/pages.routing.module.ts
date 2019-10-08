import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ClientComponent } from './client/client.component';
import { ServerComponent } from './server/server.component';


const pagesRoutes: Routes = [
  {
    path: 'menu', component: MenuComponent, children: [
      { path: 'clients', component: ClientComponent },
      { path: 'servers', component: ServerComponent },
      { path: '', component: ServerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
