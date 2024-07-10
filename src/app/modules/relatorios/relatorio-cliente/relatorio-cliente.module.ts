import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { RelatorioClienteListComponent } from 'src/app/pages/relatorios/relatorio-cliente/relatorio-cliente-list/relatorio-cliente-list.component'
import { RelatorioClienteEditComponent } from 'src/app/pages/relatorios/relatorio-cliente/relatorio-cliente-edit/relatorio-cliente-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesRelatorioCliente = [
  {
    path: "",
    component: RelatorioClienteListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: RelatorioClienteEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: RelatorioClienteEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: RelatorioClienteEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: RelatorioClienteEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesRelatorioCliente)]
  ],
  exports: [RouterModule]
})

export class RelatorioClienteModule { }
