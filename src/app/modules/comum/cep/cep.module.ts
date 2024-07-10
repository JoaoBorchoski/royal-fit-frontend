import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CepListComponent } from 'src/app/pages/comum/cep/cep-list/cep-list.component'
import { CepEditComponent } from 'src/app/pages/comum/cep/cep-edit/cep-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesCep = [
  {
    path: "",
    component: CepListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: CepEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: CepEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: CepEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: CepEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesCep)]
  ],
  exports: [RouterModule]
})

export class CepModule { }
