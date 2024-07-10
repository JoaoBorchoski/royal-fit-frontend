import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PedidoListComponent } from 'src/app/pages/pedido/pedido/pedido-list/pedido-list.component'
import { PedidoEditComponent } from 'src/app/pages/pedido/pedido/pedido-edit/pedido-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesPedido = [
  {
    path: "",
    component: PedidoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: PedidoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: PedidoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: PedidoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: PedidoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesPedido)]
  ],
  exports: [RouterModule]
})

export class PedidoModule { }
