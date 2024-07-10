import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { MenuOptionListComponent } from 'src/app/pages/security/menu-option/menu-option-list/menu-option-list.component'
import { MenuOptionEditComponent } from 'src/app/pages/security/menu-option/menu-option-edit/menu-option-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routeMenuOptions = [
  {
    path: "",
    component: MenuOptionListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: MenuOptionEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: MenuOptionEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: MenuOptionEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: MenuOptionEditComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routeMenuOptions)]
  ],
  exports: [RouterModule]
})
export class MenuOptionsModule { }
