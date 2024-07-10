import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ProfileOptionListComponent } from 'src/app/pages/security/profile-option/profile-option-list/profile-option-list.component'
import { ProfileOptionEditComponent } from 'src/app/pages/security/profile-option/profile-option-edit/profile-option-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routeProfileOptions = [
  {
    path: "",
    component: ProfileOptionListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: ProfileOptionEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: ProfileOptionEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: ProfileOptionEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: ProfileOptionEditComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routeProfileOptions)]
  ],
  exports: [RouterModule]
})

export class ProfileOptionsModule { }
