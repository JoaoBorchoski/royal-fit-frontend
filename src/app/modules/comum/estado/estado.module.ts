import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { EstadoListComponent } from 'src/app/pages/comum/estado/estado-list/estado-list.component'
import { EstadoEditComponent } from 'src/app/pages/comum/estado/estado-edit/estado-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesEstado = [
  {
    path: "",
    component: EstadoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: EstadoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: EstadoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: EstadoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: EstadoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesEstado)]
  ],
  exports: [RouterModule]
})

export class EstadoModule { }
