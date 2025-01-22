import { NgModule } from "@angular/core"
import { RouterModule } from "@angular/router"
import { CaixaListComponent } from "src/app/pages/financeiro/caixa/caixa-list/caixa-list.component"
import { CaixaEditComponent } from "src/app/pages/financeiro/caixa/caixa-edit/caixa-edit.component"
import { AuthGuard } from "../../../services/auth.guard"

const routesCaixa = [
  {
    path: "",
    component: CaixaListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: CaixaEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: CaixaEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: CaixaEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: CaixaEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [[RouterModule.forChild(routesCaixa)]],
  exports: [RouterModule],
})
export class CaixaModule {}
