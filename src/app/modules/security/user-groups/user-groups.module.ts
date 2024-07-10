import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UserGroupListComponent } from 'src/app/pages/security/user-group/user-group-list/user-group-list.component'
import { UserGroupEditComponent } from 'src/app/pages/security/user-group/user-group-edit/user-group-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routeUserGroups = [
  {
    path: "",
    component: UserGroupListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: UserGroupEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: UserGroupEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: UserGroupEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: UserGroupEditComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routeUserGroups)]
  ],
  exports: [RouterModule]
})

export class UserGroupsModule { }
