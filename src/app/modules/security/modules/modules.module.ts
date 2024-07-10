import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ModuleListComponent } from 'src/app/pages/security/module/module-list/module-list.component'
import { ModuleEditComponent } from 'src/app/pages/security/module/module-edit/module-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routeModules = [
  {
    path: "",
    component: ModuleListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: ModuleEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: ModuleEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: ModuleEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: ModuleEditComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routeModules)]
  ],
  exports: [RouterModule]
})
export class ModulesModule { }
