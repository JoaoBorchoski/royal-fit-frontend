import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NavigationListComponent } from 'src/app/pages/security/navigation/navigation-list/navigation-list.component'
import { NavigationEditComponent } from 'src/app/pages/security/navigation/navigation-edit/navigation-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routeNavigations = [
  {
    path: "",
    component: NavigationListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: NavigationEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: NavigationEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: NavigationEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: NavigationEditComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routeNavigations)]
  ],
  exports: [RouterModule]
})

export class NavigationsModule { }
