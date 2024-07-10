import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UserProfileListComponent } from 'src/app/pages/security/user-profile/user-profile-list/user-profile-list.component'
import { UserProfileEditComponent } from 'src/app/pages/security/user-profile/user-profile-edit/user-profile-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routeUsersProfile = [
  {
    path: "",
    component: UserProfileListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: UserProfileEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: UserProfileEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: UserProfileEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: UserProfileEditComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routeUsersProfile)]
  ],
  exports: [RouterModule]
})

export class UsersProfileModule { }
