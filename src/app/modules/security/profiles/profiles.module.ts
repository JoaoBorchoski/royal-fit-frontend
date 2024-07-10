import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ProfileListComponent } from 'src/app/pages/security/profile/profile-list/profile-list.component'
import { ProfileEditComponent } from 'src/app/pages/security/profile/profile-edit/profile-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routeProfiles = [
  {
    path: "",
    component: ProfileListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routeProfiles)]
  ],
  exports: [RouterModule]
})

export class ProfilesModule { }
