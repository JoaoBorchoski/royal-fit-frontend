import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CidadeListComponent } from 'src/app/pages/comum/cidade/cidade-list/cidade-list.component'
import { CidadeEditComponent } from 'src/app/pages/comum/cidade/cidade-edit/cidade-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesCidade = [
  {
    path: "",
    component: CidadeListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: CidadeEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: CidadeEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: CidadeEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: CidadeEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesCidade)]
  ],
  exports: [RouterModule]
})

export class CidadeModule { }
