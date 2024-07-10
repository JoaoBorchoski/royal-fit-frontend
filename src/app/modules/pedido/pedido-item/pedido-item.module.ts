import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PedidoItemListComponent } from 'src/app/pages/pedido/pedido-item/pedido-item-list/pedido-item-list.component'
import { PedidoItemEditComponent } from 'src/app/pages/pedido/pedido-item/pedido-item-edit/pedido-item-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesPedidoItem = [
  {
    path: "",
    component: PedidoItemListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: PedidoItemEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: PedidoItemEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: PedidoItemEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: PedidoItemEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesPedidoItem)]
  ],
  exports: [RouterModule]
})

export class PedidoItemModule { }
