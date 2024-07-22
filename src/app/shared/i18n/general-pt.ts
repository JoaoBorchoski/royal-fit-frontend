import { paisesFields } from "./fields/pt/comum/paises"
import { estadosFields } from "./fields/pt/comum/estados"
import { cidadesFields } from "./fields/pt/comum/cidades"
import { cepsFields } from "./fields/pt/comum/ceps"
import { funcionariosFields } from "./fields/pt/cadastros/funcionarios"
import { clientesFields } from "./fields/pt/cadastros/clientes"
import { produtosFields } from "./fields/pt/cadastros/produtos"
import { garrafoesFields } from "./fields/pt/cadastros/garrafoes"
import { meiosPagamentoFields } from "./fields/pt/cadastros/meios-pagamento"
import { statusPagamentoFields } from "./fields/pt/cadastros/status-pagamento"
import { bonificacoesFields } from "./fields/pt/cadastros/bonificacoes"
import { pedidosFields } from "./fields/pt/pedido/pedidos"
import { pedidoItensFields } from "./fields/pt/pedido/pedido-itens"
import { relatoriosClientesFields } from "./fields/pt/relatorios/relatorios-clientes"
import { relatoriosFuncionariosFields } from "./fields/pt/relatorios/relatorios-funcionarios"
import { balancosFields } from "./fields/pt/clientes/balancos"
import { pagamentosFields } from "./fields/pt/clientes/pagamentos"

export const generalPt = {
  list: {
    new: "Novo",
    edit: "Editar",
    copy: "Copiar",
    view: "Visualizar",
    delete: "Excluir",
    refresh: "Atualizar",
    search: "Pesquisar",
    otherActions: "Outras ações",
    loadingData: "Carregando dados",
    noData: "Sem dados",
    confirmExcludeTitle: "Confirmar exclusão",
    confirmExcludeMessage: "Tem certeza de que deseja excluir esse registro? Você não poderá desfazer essa ação.",
    confirmMultiExcludeTitle: "Confirmar exclusão em lote",
    confirmMultiExcludeMessage: "Tem certeza de que deseja excluir todos esses registros? Você não poderá desfazer essa ação.",
    excludeSuccess: "Item excluído com sucesso.",
    multiExcludeSuccess: "Itens excluídos com sucesso.",
    advancedFilterApplied: "Filtro customizado",
    filterCloseModal: "Fechar",
    filterApplyModal: "Filtrar",
    filterField: "Campo",
    filterOperator: "Operador",
    filterValue: "Valor",
    filterOr: "OU",
    filterAnd: "E",
    filterClear: "Limpar",
    filterAdd: "Adicionar",
    filterExpression: "Expressão",
    filterSavedFilters: "Filtros Salvos",
    filterExcludeSavedFilter: "Excluir",
    filterSaveFilterName: "Nome",
    filterSaveNew: "Salvar novo",
    filterApply: "Aplicar",
  },
  edit: {
    save: "Salvar",
    saveAndNew: "Salvar e novo",
    cancel: "Cancelar",
    return: "Voltar",
    saveSuccess: "Registro salvo com sucesso!",
    formError: "Formulário precisa ser preenchido corretamente.",
  },
  menu: {
    home: "Início",
    profile: "Perfil",
    signOut: "Sair",
    Segurança: "Segurança",
    "Motivos de Bloqueio": "Motivos de Bloqueio",
    "Grupos de Usuários": "Grupos de Usuários",
    Usuários: "Usuários",
    Módulos: "Módulos",
    "Opções de Menu": "Opções de Menu",
    Perfis: "Perfis",
    "Usuários x Perfis": "Usuários x Perfis",
    Navegação: "Navegação",
  },
  security_blockReason: {
    title: "Motivos de Bloqueio",
    fields: {
      id: "",
      code: "Código",
      description: "Descrição",
      instructionsToSolve: "Instruções de Solução",
      isSolvedByPasswordReset: "Resolve com reset de senha",
      disabled: "Inativo",
    },
  },
  security_userGroup: {
    title: "Grupos de Usuário",
    fields: {
      id: "",
      name: "Nome",
      disabled: "Inativo",
    },
  },
  security_user: {
    title: "Usuários",
    fields: {
      id: "",
      userGroupName: "Grupo de Usuário",
      userGroupId: "Grupo de Usuário",
      name: "Nome",
      login: "E-Mail",
      password: "Senha",
      disabled: "Inativo",
      mustChangePasswordNextLogon: "Deve trocar a senha no próximo logon",
      mustActiveTwoFactorAuthentication: "Deve ativar a autenticação de dois fatores",
      isBlocked: "Bloqueado",
      blockReasonId: "Motivo de bloqueio",
      disableTwoFactorAuthentication: "Desabilitar a autenticação de dois fatores",
      isAdmin: "Admin",
      isSuperUser: "Super Usuário",
      general: "Geral",
      security: "Segurança",
      twoFactorAuthentication: "Autenticação de Dois Fatores",
      properties: "Propiedades",
    },
  },
  security_module: {
    title: "Módulos",
    fields: {
      id: "",
      name: "Nome",
      disabled: "Inativo",
    },
  },
  security_menuOption: {
    title: "Opções de Menu",
    fields: {
      id: "",
      moduleName: "Módulo",
      moduleId: "Módulo",
      sequence: "Sequência",
      label: "Título",
      route: "Rota",
      icon: "Ícone",
      key: "Key",
      disabled: "Desativado",
    },
  },
  security_profile: {
    title: "Perfis",
    fields: {
      id: "",
      userGroupName: "Grupo de Usuário",
      name: "Nome",
      disabled: "Inativo",
      module: "Módulo",
      menuOption: "Opção de Menu",
      all: "Todos",
      create: "Incluir",
      view: "Visualizar",
      update: "Editar",
      remove: "Deletar",
    },
  },
  security_userProfile: {
    title: "Usuário x Perfil",
    fields: {
      id: "",
      userName: "Usuário",
      userId: "Usuário",
      profileName: "Perfil",
      profileId: "Perfil",
    },
  },
  security_navigation: {
    title: "Navegação",
    fields: {
      id: "",
      userName: "Usuário",
      userId: "Usuário",
      navigationDate: "Data",
      route: "Rota",
    },
  },
  comum_pais: {
    title: "Países",
    fields: paisesFields,
  },
  comum_estado: {
    title: "Estados",
    fields: estadosFields,
  },
  comum_cidade: {
    title: "Cidades",
    fields: cidadesFields,
  },
  comum_cep: {
    title: "CEP",
    fields: cepsFields,
  },
  cadastros_funcionario: {
    title: "Funcionarios",
    fields: funcionariosFields,
  },
  cadastros_cliente: {
    title: "Clientes",
    fields: clientesFields,
  },
  cadastros_produto: {
    title: "Produtos",
    fields: produtosFields,
  },
  cadastros_garrafao: {
    title: "Garrafões",
    fields: garrafoesFields,
  },
  cadastros_meioPagamento: {
    title: "Meio de Pagamento",
    fields: meiosPagamentoFields,
  },
  cadastros_statusPagamento: {
    title: "Status de Pagamento",
    fields: statusPagamentoFields,
  },
  cadastros_bonificacao: {
    title: "Bonificacões",
    fields: bonificacoesFields,
  },
  pedido_pedido: {
    title: "Pedidos",
    fields: pedidosFields,
  },
  pedido_pedidoItem: {
    title: "Estoques",
    fields: pedidoItensFields,
  },
  relatorios_relatorioCliente: {
    title: "Relatórios Cliente",
    fields: relatoriosClientesFields,
  },
  relatorios_relatorioFuncionario: {
    title: "Relatórios Funcionarios",
    fields: relatoriosFuncionariosFields,
  },
  clientes_balanco: {
    title: "Balanço de Clientes",
    fields: balancosFields,
  },
  clientes_pagamento: {
    title: "Pagamentos Clientes",
    fields: pagamentosFields,
  },
}
