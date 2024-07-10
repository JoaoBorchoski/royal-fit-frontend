import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { StatusPagamentoListComponent } from 'src/app/pages/cadastros/status-pagamento/status-pagamento-list/status-pagamento-list.component'
import { StatusPagamentoEditComponent } from 'src/app/pages/cadastros/status-pagamento/status-pagamento-edit/status-pagamento-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesStatusPagamento = [
  {
    path: "",
    component: StatusPagamentoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: StatusPagamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: StatusPagamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: StatusPagamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: StatusPagamentoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesStatusPagamento)]
  ],
  exports: [RouterModule]
})

export class StatusPagamentoModule { }
