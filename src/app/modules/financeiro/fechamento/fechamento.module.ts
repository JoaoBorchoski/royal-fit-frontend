import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FechamentoListComponent } from 'src/app/pages/financeiro/fechamento/fechamento-list/fechamento-list.component'
import { FechamentoEditComponent } from 'src/app/pages/financeiro/fechamento/fechamento-edit/fechamento-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesFechamento = [
  {
    path: "",
    component: FechamentoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: FechamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: FechamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: FechamentoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: FechamentoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesFechamento)]
  ],
  exports: [RouterModule]
})

export class FechamentoModule { }
