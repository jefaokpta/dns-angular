import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ClientComponent } from './client/client.component';
import { ServerComponent } from './server/server.component';
import { NewServerComponent } from './server/new-server/new-server.component';
import { EditServerComponent } from './server/edit-server/edit-server.component';
import { OverviewServerComponent } from './server/overview-server/overview-server.component';


const pagesRoutes: Routes = [
  {
    path: 'menu', component: MenuComponent, children: [
      { path: 'clients', component: ClientComponent },
      { path: 'servers', component: ServerComponent, children: [
        { path: 'new-server', component: NewServerComponent},
        { path: 'edit-server', component: EditServerComponent},
        { path: '', component: OverviewServerComponent}
      ]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
