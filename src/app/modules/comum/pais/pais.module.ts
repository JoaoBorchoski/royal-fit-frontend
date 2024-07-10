import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PaisListComponent } from 'src/app/pages/comum/pais/pais-list/pais-list.component'
import { PaisEditComponent } from 'src/app/pages/comum/pais/pais-edit/pais-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesPais = [
  {
    path: "",
    component: PaisListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: PaisEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: PaisEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: PaisEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: PaisEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesPais)]
  ],
  exports: [RouterModule]
})

export class PaisModule { }
