import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { MeioPagamentoListComponent } from 'src/app/pages/cadastros/meio-pagamento/meio-pagamento-list/meio-pagamento-list.component'
import { MeioPagamentoEditComponent } from 'src/app/pages/cadastros/meio-pagamento/meio-pagamento-edit/meio-pagamento-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesMeioPagamento = [
  {
    path: "",
    component: MeioPagamentoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: MeioPagamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: MeioPagamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: MeioPagamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: MeioPagamentoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesMeioPagamento)]
  ],
  exports: [RouterModule]
})

export class MeioPagamentoModule { }
