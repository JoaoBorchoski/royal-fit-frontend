import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FuncionarioListComponent } from 'src/app/pages/cadastros/funcionario/funcionario-list/funcionario-list.component'
import { FuncionarioEditComponent } from 'src/app/pages/cadastros/funcionario/funcionario-edit/funcionario-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesFuncionario = [
  {
    path: "",
    component: FuncionarioListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: FuncionarioEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: FuncionarioEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: FuncionarioEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: FuncionarioEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesFuncionario)]
  ],
  exports: [RouterModule]
})

export class FuncionarioModule { }
