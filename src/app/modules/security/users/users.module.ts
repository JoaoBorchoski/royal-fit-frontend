import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UserListComponent } from 'src/app/pages/security/user/user-list/user-list.component'
import { UserEditComponent } from 'src/app/pages/security/user/user-edit/user-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesUsers = [
  {
    path: "",
    component: UserListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: UserEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: UserEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: UserEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: UserEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: UserEditComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesUsers)]
  ],
  exports: [RouterModule]
})

export class UsersModule { }
