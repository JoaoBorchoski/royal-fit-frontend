import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BlockReasonListComponent } from 'src/app/pages/security/block-reason/block-reason-list/block-reason-list.component'
import { BlockReasonEditComponent } from 'src/app/pages/security/block-reason/block-reason-edit/block-reason-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routeBlockReasons = [
  {
    path: "",
    component: BlockReasonListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: BlockReasonEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: BlockReasonEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: BlockReasonEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: BlockReasonEditComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routeBlockReasons)]
  ],
  exports: [RouterModule]
})

export class BlockReasonsModule { }
