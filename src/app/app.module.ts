import { HTTP_INTERCEPTORS } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { RouterModule } from "@angular/router"
import { PoPageModule, PoI18nModule } from "@po-ui/ng-components"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

import { DefaultComponent } from "./_layouts/default/default.component"
import { CustomTableComponent } from "./components/custom-table/custom-table.component"
import { NoDataComponent } from "./components/no-data/no-data.component"
import { FilterModalComponent } from "./components/filter-modal/filter-modal.component"
import { SavedFilterComponent } from "./components/filter-modal/saved-filter/saved-filter.component"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { HomeComponent } from "./pages/authentication/home/home.component"
import { ProfileComponent } from "./pages/authentication/profile/profile.component"
import { LoginComponent } from "./pages/authentication/login/login.component"
import { ResetPasswordComponent } from "./pages/authentication/reset-password/reset-password.component"
import { BlockReasonEditComponent } from "./pages/security/block-reason/block-reason-edit/block-reason-edit.component"
import { BlockReasonListComponent } from "./pages/security/block-reason/block-reason-list/block-reason-list.component"
import { UserGroupEditComponent } from "./pages/security/user-group/user-group-edit/user-group-edit.component"
import { UserGroupListComponent } from "./pages/security/user-group/user-group-list/user-group-list.component"
import { UserEditComponent } from "./pages/security/user/user-edit/user-edit.component"
import { UserListComponent } from "./pages/security/user/user-list/user-list.component"
import { ModuleEditComponent } from "./pages/security/module/module-edit/module-edit.component"
import { ModuleListComponent } from "./pages/security/module/module-list/module-list.component"
import { MenuOptionEditComponent } from "./pages/security/menu-option/menu-option-edit/menu-option-edit.component"
import { MenuOptionListComponent } from "./pages/security/menu-option/menu-option-list/menu-option-list.component"
import { ProfileEditComponent } from "./pages/security/profile/profile-edit/profile-edit.component"
import { ProfileListComponent } from "./pages/security/profile/profile-list/profile-list.component"
import { ProfileOptionEditComponent } from "./pages/security/profile-option/profile-option-edit/profile-option-edit.component"
import { ProfileOptionListComponent } from "./pages/security/profile-option/profile-option-list/profile-option-list.component"
import { UserProfileEditComponent } from "./pages/security/user-profile/user-profile-edit/user-profile-edit.component"
import { UserProfileListComponent } from "./pages/security/user-profile/user-profile-list/user-profile-list.component"
import { NavigationEditComponent } from "./pages/security/navigation/navigation-edit/navigation-edit.component"
import { NavigationListComponent } from "./pages/security/navigation/navigation-list/navigation-list.component"
import { PaisEditComponent } from "./pages/comum/pais/pais-edit/pais-edit.component"
import { PaisListComponent } from "./pages/comum/pais/pais-list/pais-list.component"
import { EstadoEditComponent } from "./pages/comum/estado/estado-edit/estado-edit.component"
import { EstadoListComponent } from "./pages/comum/estado/estado-list/estado-list.component"
import { CidadeEditComponent } from "./pages/comum/cidade/cidade-edit/cidade-edit.component"
import { CidadeListComponent } from "./pages/comum/cidade/cidade-list/cidade-list.component"
import { CepEditComponent } from "./pages/comum/cep/cep-edit/cep-edit.component"
import { CepListComponent } from "./pages/comum/cep/cep-list/cep-list.component"
import { FuncionarioEditComponent } from "./pages/cadastros/funcionario/funcionario-edit/funcionario-edit.component"
import { FuncionarioListComponent } from "./pages/cadastros/funcionario/funcionario-list/funcionario-list.component"
import { ClienteEditComponent } from "./pages/cadastros/cliente/cliente-edit/cliente-edit.component"
import { ClienteListComponent } from "./pages/cadastros/cliente/cliente-list/cliente-list.component"
import { ProdutoEditComponent } from "./pages/cadastros/produto/produto-edit/produto-edit.component"
import { ProdutoListComponent } from "./pages/cadastros/produto/produto-list/produto-list.component"
import { GarrafaoEditComponent } from "./pages/cadastros/garrafao/garrafao-edit/garrafao-edit.component"
import { GarrafaoListComponent } from "./pages/cadastros/garrafao/garrafao-list/garrafao-list.component"
import { MeioPagamentoEditComponent } from "./pages/cadastros/meio-pagamento/meio-pagamento-edit/meio-pagamento-edit.component"
import { MeioPagamentoListComponent } from "./pages/cadastros/meio-pagamento/meio-pagamento-list/meio-pagamento-list.component"
import { StatusPagamentoEditComponent } from "./pages/cadastros/status-pagamento/status-pagamento-edit/status-pagamento-edit.component"
import { StatusPagamentoListComponent } from "./pages/cadastros/status-pagamento/status-pagamento-list/status-pagamento-list.component"
import { BonificacaoEditComponent } from "./pages/cadastros/bonificacao/bonificacao-edit/bonificacao-edit.component"
import { BonificacaoListComponent } from "./pages/cadastros/bonificacao/bonificacao-list/bonificacao-list.component"
import { PedidoEditComponent } from "./pages/pedido/pedido/pedido-edit/pedido-edit.component"
import { PedidoListComponent } from "./pages/pedido/pedido/pedido-list/pedido-list.component"
import { EstoqueEditComponent } from "./pages/pedido/pedido-item/pedido-item-edit/estoque-edit.component"
import { EstoqueListComponent } from "./pages/pedido/pedido-item/pedido-item-list/estoque-list.component"
import { RelatorioClienteEditComponent } from "./pages/relatorios/relatorio-cliente/relatorio-cliente-edit/relatorio-cliente-edit.component"
import { RelatorioClienteListComponent } from "./pages/relatorios/relatorio-cliente/relatorio-cliente-list/relatorio-cliente-list.component"
import { RelatorioFuncionarioEditComponent } from "./pages/relatorios/relatorio-funcionario/relatorio-funcionario-edit/relatorio-funcionario-edit.component"
import { RelatorioFuncionarioListComponent } from "./pages/relatorios/relatorio-funcionario/relatorio-funcionario-list/relatorio-funcionario-list.component"
import { BalancoEditComponent } from "./pages/clientes/balanco/balanco-edit/balanco-edit.component"
import { BalancoListComponent } from "./pages/clientes/balanco/balanco-list/balanco-list.component"
import { PagamentoEditComponent } from "./pages/clientes/pagamento/pagamento-edit/pagamento-edit.component"
import { PagamentoListComponent } from "./pages/clientes/pagamento/pagamento-list/pagamento-list.component"
import { TokenInterceptorService } from "./services/token-interceptor.service"
import { ErrorInterceptorService } from "./services/error-interceptor.service"
import { NotAuthorizedComponent } from "./pages/security/not-authorized/not-authorized.component"
import { ImportExcelModalComponent } from "./components/import-excel-modal-component/import-excel-modal-component"

import { SharedModule } from "./shared/shared.module"
import { i18nConfig } from "./shared/i18n"

// PO-UI
@NgModule({
  declarations: [
    AppComponent,
    CustomTableComponent,
    NoDataComponent,
    FilterModalComponent,
    SavedFilterComponent,
    LoginComponent,
    ResetPasswordComponent,
    BlockReasonEditComponent,
    BlockReasonListComponent,
    UserGroupEditComponent,
    UserGroupListComponent,
    UserEditComponent,
    UserListComponent,
    ModuleEditComponent,
    ModuleListComponent,
    MenuOptionEditComponent,
    MenuOptionListComponent,
    ProfileEditComponent,
    ProfileListComponent,
    ProfileOptionEditComponent,
    ProfileOptionListComponent,
    UserProfileEditComponent,
    UserProfileListComponent,
    NavigationEditComponent,
    NavigationListComponent,
    PaisEditComponent,
    PaisListComponent,
    EstadoEditComponent,
    EstadoListComponent,
    CidadeEditComponent,
    CidadeListComponent,
    CepEditComponent,
    CepListComponent,
    FuncionarioEditComponent,
    FuncionarioListComponent,
    ClienteEditComponent,
    ClienteListComponent,
    ProdutoEditComponent,
    ProdutoListComponent,
    GarrafaoEditComponent,
    GarrafaoListComponent,
    MeioPagamentoEditComponent,
    MeioPagamentoListComponent,
    StatusPagamentoEditComponent,
    StatusPagamentoListComponent,
    BonificacaoEditComponent,
    BonificacaoListComponent,
    PedidoEditComponent,
    PedidoListComponent,
    EstoqueEditComponent,
    EstoqueListComponent,
    RelatorioClienteEditComponent,
    RelatorioClienteListComponent,
    RelatorioFuncionarioEditComponent,
    RelatorioFuncionarioListComponent,
    BalancoEditComponent,
    BalancoListComponent,
    PagamentoEditComponent,
    PagamentoListComponent,
    DefaultComponent,
    HomeComponent,
    ProfileComponent,
    NotAuthorizedComponent,
    ImportExcelModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    RouterModule.forRoot([]),
    PoPageModule,
    FormsModule,
    ReactiveFormsModule,
    PoI18nModule.config(i18nConfig),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
