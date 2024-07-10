import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { RelatorioFuncionarioListComponent } from 'src/app/pages/relatorios/relatorio-funcionario/relatorio-funcionario-list/relatorio-funcionario-list.component'
import { RelatorioFuncionarioEditComponent } from 'src/app/pages/relatorios/relatorio-funcionario/relatorio-funcionario-edit/relatorio-funcionario-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesRelatorioFuncionario = [
  {
    path: "",
    component: RelatorioFuncionarioListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: RelatorioFuncionarioEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: RelatorioFuncionarioEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: RelatorioFuncionarioEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: RelatorioFuncionarioEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesRelatorioFuncionario)]
  ],
  exports: [RouterModule]
})

export class RelatorioFuncionarioModule { }
