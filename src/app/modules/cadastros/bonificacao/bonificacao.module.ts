import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BonificacaoListComponent } from 'src/app/pages/cadastros/bonificacao/bonificacao-list/bonificacao-list.component'
import { BonificacaoEditComponent } from 'src/app/pages/cadastros/bonificacao/bonificacao-edit/bonificacao-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesBonificacao = [
  {
    path: "",
    component: BonificacaoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: BonificacaoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: BonificacaoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: BonificacaoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: BonificacaoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesBonificacao)]
  ],
  exports: [RouterModule]
})

export class BonificacaoModule { }
