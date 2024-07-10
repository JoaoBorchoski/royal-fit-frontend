import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PagamentoListComponent } from 'src/app/pages/clientes/pagamento/pagamento-list/pagamento-list.component'
import { PagamentoEditComponent } from 'src/app/pages/clientes/pagamento/pagamento-edit/pagamento-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesPagamento = [
  {
    path: "",
    component: PagamentoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: PagamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: PagamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: PagamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: PagamentoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesPagamento)]
  ],
  exports: [RouterModule]
})

export class PagamentoModule { }
