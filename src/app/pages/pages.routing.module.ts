import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ClientComponent } from './client/client.component';
import { ServerComponent } from './server/server.component';
import { NewServerComponent } from './server/new-server/new-server.component';
import { EditServerComponent } from './server/edit-server/edit-server.component';
import { OverviewServerComponent } from './server/overview-server/overview-server.component';
import { ClientViewComponent } from './client/client-view/client-view.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { ClientNewComponent } from './client/client-new/client-new.component';


const pagesRoutes: Routes = [
  {
    path: 'menu', component: MenuComponent, children: [
      { path: 'clients', component: ClientComponent, children: [
        { path: 'edit', component: ClientEditComponent},
        { path: 'new', component: ClientNewComponent},
        { path: '', component: ClientViewComponent}
      ] },
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
