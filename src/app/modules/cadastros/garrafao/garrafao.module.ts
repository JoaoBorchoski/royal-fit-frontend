import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { GarrafaoListComponent } from 'src/app/pages/cadastros/garrafao/garrafao-list/garrafao-list.component'
import { GarrafaoEditComponent } from 'src/app/pages/cadastros/garrafao/garrafao-edit/garrafao-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesGarrafao = [
  {
    path: "",
    component: GarrafaoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: GarrafaoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: GarrafaoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: GarrafaoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: GarrafaoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesGarrafao)]
  ],
  exports: [RouterModule]
})

export class GarrafaoModule { }
