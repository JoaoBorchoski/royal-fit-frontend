import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ProdutoListComponent } from 'src/app/pages/cadastros/produto/produto-list/produto-list.component'
import { ProdutoEditComponent } from 'src/app/pages/cadastros/produto/produto-edit/produto-edit.component'
import { AuthGuard } from 'src/app/services/auth.guard'

const routesProduto = [
  {
    path: "",
    component: ProdutoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: ProdutoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new/:id",
    component: ProdutoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: ProdutoEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id",
    component: ProdutoEditComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routesProduto)]
  ],
  exports: [RouterModule]
})

export class ProdutoModule { }
