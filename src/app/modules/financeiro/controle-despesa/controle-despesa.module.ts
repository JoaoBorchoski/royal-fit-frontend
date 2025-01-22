import { ControleDespesaListComponent } from "../../../pages/financeiro/controle-despesa/controle-despesa-list/controle-despesa-list.component"
import { ControleDespesaEditComponent } from "../../../pages/financeiro/controle-despesa/controle-despesa-edit/controle-despesa-edit.component"

import { NgModule } from "@angular/core"
import { RouterModule } from "@angular/router"
import { AuthGuard } from "../../../services/auth.guard"

const routesControleDespesa = [
  {
    path: "",
    component: ControleDespesaListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: ControleDespesaEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: ControleDespesaEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: ControleDespesaEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: ControleDespesaEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [[RouterModule.forChild(routesControleDespesa)]],
  exports: [RouterModule],
})
export class ControleDespesaModule {}
