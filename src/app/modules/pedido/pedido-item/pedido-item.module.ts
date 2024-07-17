import { NgModule } from "@angular/core"
import { RouterModule } from "@angular/router"
import { EstoqueEditComponent } from "src/app/pages/pedido/pedido-item/pedido-item-edit/estoque-edit.component"
import { EstoqueListComponent } from "src/app/pages/pedido/pedido-item/pedido-item-list/estoque-list.component"
import { AuthGuard } from "src/app/services/auth.guard"

const routesEstoques = [
  {
    path: "",
    component: EstoqueListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: EstoqueEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: EstoqueEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: EstoqueEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: EstoqueEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [[RouterModule.forChild(routesEstoques)]],
  exports: [RouterModule],
})
export class EstoquesModule {}
