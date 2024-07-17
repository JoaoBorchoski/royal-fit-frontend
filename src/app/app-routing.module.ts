import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { DefaultComponent } from "./_layouts/default/default.component"
import { HomeComponent } from "./pages/authentication/home/home.component"
import { ProfileComponent } from "./pages/authentication/profile/profile.component"
import { LoginComponent } from "./pages/authentication/login/login.component"
import { ResetPasswordComponent } from "./pages/authentication/reset-password/reset-password.component"
import { NotAuthorizedComponent } from "./pages/security/not-authorized/not-authorized.component"
import { AuthGuard } from "./services/auth.guard"

// Componentes
const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "home",
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "block-reasons",
        loadChildren: () => import("./modules/security/block-reasons/block-reasons.module").then((m) => m.BlockReasonsModule),
      },
      {
        path: "user-groups",
        loadChildren: () => import("./modules/security/user-groups/user-groups.module").then((m) => m.UserGroupsModule),
      },
      {
        path: "users",
        loadChildren: () => import("./modules/security/users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "modules",
        loadChildren: () => import("./modules/security/modules/modules.module").then((m) => m.ModulesModule),
      },
      {
        path: "menu-options",
        loadChildren: () => import("./modules/security/menu-options/menu-options.module").then((m) => m.MenuOptionsModule),
      },
      {
        path: "profiles",
        loadChildren: () => import("./modules/security/profiles/profiles.module").then((m) => m.ProfilesModule),
      },
      {
        path: "profile-options",
        loadChildren: () =>
          import("./modules/security/profile-options/profile-options.module").then((m) => m.ProfileOptionsModule),
      },
      {
        path: "users-profiles",
        loadChildren: () => import("./modules/security/users-profile/users-profile.module").then((m) => m.UsersProfileModule),
      },
      {
        path: "navigations",
        loadChildren: () => import("./modules/security/navigations/navigations.module").then((m) => m.NavigationsModule),
      },
      {
        path: "paises",
        loadChildren: () => import("./modules/comum/pais/pais.module").then((m) => m.PaisModule),
      },
      {
        path: "estados",
        loadChildren: () => import("./modules/comum/estado/estado.module").then((m) => m.EstadoModule),
      },
      {
        path: "cidades",
        loadChildren: () => import("./modules/comum/cidade/cidade.module").then((m) => m.CidadeModule),
      },
      {
        path: "ceps",
        loadChildren: () => import("./modules/comum/cep/cep.module").then((m) => m.CepModule),
      },
      {
        path: "funcionarios",
        loadChildren: () => import("./modules/cadastros/funcionario/funcionario.module").then((m) => m.FuncionarioModule),
      },
      {
        path: "clientes",
        loadChildren: () => import("./modules/cadastros/cliente/cliente.module").then((m) => m.ClienteModule),
      },
      {
        path: "produtos",
        loadChildren: () => import("./modules/cadastros/produto/produto.module").then((m) => m.ProdutoModule),
      },
      {
        path: "garrafoes",
        loadChildren: () => import("./modules/cadastros/garrafao/garrafao.module").then((m) => m.GarrafaoModule),
      },
      {
        path: "meios-pagamento",
        loadChildren: () => import("./modules/cadastros/meio-pagamento/meio-pagamento.module").then((m) => m.MeioPagamentoModule),
      },
      {
        path: "status-pagamento",
        loadChildren: () =>
          import("./modules/cadastros/status-pagamento/status-pagamento.module").then((m) => m.StatusPagamentoModule),
      },
      {
        path: "bonificacoes",
        loadChildren: () => import("./modules/cadastros/bonificacao/bonificacao.module").then((m) => m.BonificacaoModule),
      },
      {
        path: "pedidos",
        loadChildren: () => import("./modules/pedido/pedido/pedido.module").then((m) => m.PedidoModule),
      },
      {
        path: "estoques",
        loadChildren: () => import("./modules/pedido/pedido-item/pedido-item.module").then((m) => m.EstoquesModule),
      },
      {
        path: "relatorios-clientes",
        loadChildren: () =>
          import("./modules/relatorios/relatorio-cliente/relatorio-cliente.module").then((m) => m.RelatorioClienteModule),
      },
      {
        path: "relatorios-funcionarios",
        loadChildren: () =>
          import("./modules/relatorios/relatorio-funcionario/relatorio-funcionario.module").then(
            (m) => m.RelatorioFuncionarioModule
          ),
      },
      {
        path: "balancos",
        loadChildren: () => import("./modules/clientes/balanco/balanco.module").then((m) => m.BalancoModule),
      },
      {
        path: "pagamentos",
        loadChildren: () => import("./modules/clientes/pagamento/pagamento.module").then((m) => m.PagamentoModule),
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "reset/:id",
    component: ResetPasswordComponent,
  },
  {
    path: "not-authorized",
    component: NotAuthorizedComponent,
  },

  { path: "**", redirectTo: "/login" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
