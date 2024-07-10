import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ClienteListComponent } from 'src/app/pages/cadastros/cliente/cliente-list/cliente-list.component'
import { ClienteEditComponent } from 'src/app/pages/cadastros/cliente/cliente-edit/cliente-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesCliente = [
  {
    path: "",
    component: ClienteListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: ClienteEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: ClienteEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: ClienteEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: ClienteEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesCliente)]
  ],
  exports: [RouterModule]
})

export class ClienteModule { }
