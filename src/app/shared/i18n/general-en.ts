import { paisesFields } from './fields/en/comum/paises'
import { estadosFields } from './fields/en/comum/estados'
import { cidadesFields } from './fields/en/comum/cidades'
import { cepsFields } from './fields/en/comum/ceps'
import { funcionariosFields } from './fields/en/cadastros/funcionarios'
import { clientesFields } from './fields/en/cadastros/clientes'
import { produtosFields } from './fields/en/cadastros/produtos'
import { garrafoesFields } from './fields/en/cadastros/garrafoes'
import { meiosPagamentoFields } from './fields/en/cadastros/meios-pagamento'
import { statusPagamentoFields } from './fields/en/cadastros/status-pagamento'
import { bonificacoesFields } from './fields/en/cadastros/bonificacoes'
import { pedidosFields } from './fields/en/pedido/pedidos'
import { pedidoItensFields } from './fields/en/pedido/pedido-itens'
import { relatoriosClientesFields } from './fields/en/relatorios/relatorios-clientes'
import { relatoriosFuncionariosFields } from './fields/en/relatorios/relatorios-funcionarios'
import { balancosFields } from './fields/en/clientes/balancos'
import { pagamentosFields } from './fields/en/clientes/pagamentos'

export const generalEn = {
  list: {
    new: "New",
    edit: "Edit",
    copy: "Copy",
    view: "View",
    delete: "Delete",
    refresh: "Refresh",
    search: "Search",
    otherActions: "Other actions",
    loadingData: "Loading data",
    noData: "No data",
    confirmExcludeTitle: "Confirm exclude",
    confirmExcludeMessage: "Are you sure that you want to exclude this item? You can't undo this action.",
    confirmMultiExcludeTitle: "Confirm multi item delete",
    confirmMultiExcludeMessage: "Are you sure that you want to exclude these items? You can't undo this action.",
    excludeSuccess: "Item excluded with success.",
    multiExcludeSuccess: "Items excluded with success!",
    advancedFilterApplied: "Customized filter",
    filterCloseModal: "Close",
    filterApplyModal: "Apply Filter",
    filterField: "Field",
    filterOperator: "Operator",
    filterValue: "Value",
    filterOr: "OR",
    filterAnd: "AND",
    filterClear: "Clear",
    filterAdd: "Add",
    filterExpression: "Expression",
    filterSavedFilters: "Saved Filters",
    filterExcludeSavedFilter: "Delete",
    filterSaveFilterName: "Name",
    filterSaveNew: "Save new",
    filterApply: "Apply"
  },
  edit: {
    save: "Save",
    saveAndNew: "Save and new",
    cancel: "Cancel",
    return: "Return",
    saveSuccess: "Register saved successfully!",
    formError: "Form incorrect."
  },
  menu: {
    home: 'Home',
    profile: 'Profile',
    signOut: 'Sign out',
    'Segurança': 'Security',
    'Motivos de Bloqueio': 'Block Reasons',
    'Grupos de Usuários': 'Users Group',
    'Usuários': 'Users',
    'Módulos': 'Modules',
    'Opções de Menu': 'Menu Options',
    'Perfis': 'Profiles',
    'Usuários x Perfis': 'Users x Profiles',
    'Navegação': 'Navigation',
  },
  security_blockReason: {
    title: 'Block Reasons',
    fields: {
      id: '',
      code: 'Code',
      description: 'Description',
      instructionsToSolve: 'Instructions to Solve',
      isSolvedByPasswordReset: 'Is solved by password reset',
      disabled: 'Disabled'
    }
  },
  security_userGroup: {
    title: 'User Groups',
    fields: {
      id: '',
      name: 'Name',
      disabled: 'Disabled'
    }
  },
  security_user: {
    title: 'Users',
    fields: {
      id: '',
      userGroupName: 'User Group',
      userGroupId: 'User Group',
      name: 'Name',
      login: 'E-Mail',
      password: 'Password',
      disabled: 'Disabled',
      mustChangePasswordNextLogon: 'Must change password next logon',
      mustActiveTwoFactorAuthentication: 'Must active two factor authentication',
      isBlocked: 'Blocked',
      blockReasonId: 'Blocked Reason',
      disableTwoFactorAuthentication: 'Disable Two Factor Authentication',
      isAdmin: 'Admin',
      isSuperUser: 'Super User',
      general: 'General',
      security: 'Security',
      twoFactorAuthentication: 'Two Factor Authentication',
      properties: 'Properties'
    }
  },
  security_module: {
    title: 'Modules',
    fields: {
      id: '',
      name: 'Name',
      disabled: 'Disabled'
    }
  },
  security_menuOption: {
    title: 'Menu Options',
    fields: {
      id: '',
      moduleName: 'Module',
      moduleId: 'Module',
      sequence: 'Sequence',
      label: 'Label',
      route: 'Route',
      icon: 'Icon',
      key: 'Key',
      disabled: 'Disabled'
    }
  },
  security_profile: {
    title: 'Profiles',
    fields: {
      id: '',
      userGroupName: 'User Group',
      name: 'Name',
      disabled: 'Disabled',
      module: 'Module',
      menuOption: 'Menu Option',
      all: 'All',
      create: 'Create',
      view: 'View',
      update: 'Update',
      remove: 'Delete',
    }
  },
  security_userProfile: {
    title: 'User x Profile',
    fields: {
      id: '',
      userName: 'User',
      userId: 'User',
      profileName: 'Profile',
      profileId: 'Profile',
    }
  },
  security_navigation: {
    title: 'Navigation',
    fields: {
      id: '',
      userName: 'User',
      userId: 'User',
      navigationDate: 'Date',
      route: 'Route',
    }
  },
  comum_pais: {
    title: 'Países',
    fields: paisesFields
  },
  comum_estado: {
    title: 'Estados',
    fields: estadosFields
  },
  comum_cidade: {
    title: 'Cidades',
    fields: cidadesFields
  },
  comum_cep: {
    title: 'CEP',
    fields: cepsFields
  },
  cadastros_funcionario: {
    title: 'Funcionarios',
    fields: funcionariosFields
  },
  cadastros_cliente: {
    title: 'Clientes',
    fields: clientesFields
  },
  cadastros_produto: {
    title: 'Produtos',
    fields: produtosFields
  },
  cadastros_garrafao: {
    title: 'Garrafões',
    fields: garrafoesFields
  },
  cadastros_meioPagamento: {
    title: 'Meio de Pagamento',
    fields: meiosPagamentoFields
  },
  cadastros_statusPagamento: {
    title: 'Status de Pagamento',
    fields: statusPagamentoFields
  },
  cadastros_bonificacao: {
    title: 'Bonificacões',
    fields: bonificacoesFields
  },
  pedido_pedido: {
    title: 'Pedidos',
    fields: pedidosFields
  },
  pedido_pedidoItem: {
    title: 'PedidoItens',
    fields: pedidoItensFields
  },
  relatorios_relatorioCliente: {
    title: 'Relatórios Cliente',
    fields: relatoriosClientesFields
  },
  relatorios_relatorioFuncionario: {
    title: 'Relatórios Funcionarios',
    fields: relatoriosFuncionariosFields
  },
  clientes_balanco: {
    title: 'Balanços Clientes',
    fields: balancosFields
  },
  clientes_pagamento: {
    title: 'Pagamentos Clientes',
    fields: pagamentosFields
  },
}
