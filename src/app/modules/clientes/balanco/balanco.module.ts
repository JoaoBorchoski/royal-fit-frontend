import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BalancoListComponent } from 'src/app/pages/clientes/balanco/balanco-list/balanco-list.component'
import { BalancoEditComponent } from 'src/app/pages/clientes/balanco/balanco-edit/balanco-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesBalanco = [
  {
    path: "",
    component: BalancoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: BalancoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: BalancoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: BalancoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: BalancoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesBalanco)]
  ],
  exports: [RouterModule]
})

export class BalancoModule { }
