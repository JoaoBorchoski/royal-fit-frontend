import { paisesFields } from './fields/es/comum/paises'
import { estadosFields } from './fields/es/comum/estados'
import { cidadesFields } from './fields/es/comum/cidades'
import { cepsFields } from './fields/es/comum/ceps'
import { funcionariosFields } from './fields/es/cadastros/funcionarios'
import { clientesFields } from './fields/es/cadastros/clientes'
import { produtosFields } from './fields/es/cadastros/produtos'
import { garrafoesFields } from './fields/es/cadastros/garrafoes'
import { meiosPagamentoFields } from './fields/es/cadastros/meios-pagamento'
import { statusPagamentoFields } from './fields/es/cadastros/status-pagamento'
import { bonificacoesFields } from './fields/es/cadastros/bonificacoes'
import { pedidosFields } from './fields/es/pedido/pedidos'
import { pedidoItensFields } from './fields/es/pedido/pedido-itens'
import { relatoriosClientesFields } from './fields/es/relatorios/relatorios-clientes'
import { relatoriosFuncionariosFields } from './fields/es/relatorios/relatorios-funcionarios'
import { balancosFields } from './fields/es/clientes/balancos'
import { pagamentosFields } from './fields/es/clientes/pagamentos'

export const generalEs = {
  list: {
    new: "Nuevo",
    edit: "Editar",
    copy: "Copiar",
    view: "Visualizar",
    delete: "Borrar",
    refresh: "Actualizar",
    search: "Buscar",
    otherActions: "Otras acciones",
    loadingData: "Cargando datos",
    noData: "Sin datos",
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
    filterApply: "Aplicar"
  },
  edit: {
    save: "Save",
    saveAndNew: "Save and new",
    cancel: "Cancel",
    return: "Volver",
    saveSuccess: "Registro guardado con éxito!",
    formError: "Campos incorrectos."
  },
  menu: {
    home: 'Home',
    profile: 'Perfil',
    signOut: 'Salir',
    'Segurança': 'Seguridad',
    'Motivos de Bloqueio': 'Razones de Bloqueo',
    'Grupos de Usuários': 'Grupo de Usuario',
    'Usuários': 'Usuarios',
    'Módulos': 'Módulos',
    'Opções de Menu': 'Opciones de Menú',
    'Perfis': 'Perfiles',
    'Usuários x Perfis': 'Usuarios x Perfiles',
    'Navegação': 'Navegación',
  },
  security_blockReason: {
    title: 'Razones de Bloqueo',
    fields: {
      id: '',
      code: 'Código',
      description: 'Descripción',
      instructionsToSolve: 'Instrucciones de Solución',
      isSolvedByPasswordReset: 'Soluciona restableciendo la contraseña',
      disabled: 'Desactivado'
    }
  },
  security_userGroup: {
    title: 'Grupos de Usuario',
    fields: {
      id: '',
      name: 'Nombre',
      disabled: 'Desactivado'
    }
  },
  security_user: {
    title: 'Usuarios',
    fields: {
      id: '',
      userGroupName: 'Grupo de Usuario',
      userGroupId: 'Grupo de Usuario',
      name: 'Nombre',
      login: 'E-Mail',
      password: 'Contraseña',
      disabled: 'Inactivo',
      mustChangePasswordNextLogon: 'Debe cambiar la contraseña el próximo inicio de sesión',
      mustActiveTwoFactorAuthentication: 'Debe activar la autenticación de dos factores',
      isBlocked: 'Bloqueado',
      blockReasonId: 'Motivo de bloqueo',
      disableTwoFactorAuthentication: 'Deshabilitar la autenticación de dos factores',
      isAdmin: 'Admin',
      isSuperUser: 'Super Usuario',
      general: 'General',
      security: 'Seguridad',
      twoFactorAuthentication: 'Autenticación de Dos Factores',
      properties: 'Propiedades'
    }
  },
  security_module: {
    title: 'Módulos',
    fields: {
      id: '',
      name: 'Nombre',
      disabled: 'Desactivado'
    }
  },
  security_menuOption: {
    title: 'Opciones de Menú',
    fields: {
      id: '',
      moduleName: 'Módulo',
      moduleId: 'Módulo',
      sequence: 'Secuencia',
      label: 'Etiqueta',
      route: 'Ruta',
      icon: 'Icono',
      key: 'Key',
      disabled: 'Desactivado'
    }
  },
  security_profile: {
    title: 'Perfiles',
    fields: {
      id: '',
      userGroupName: 'Grupo de Usuario',
      name: 'Nombre',
      disabled: 'Desactivado',
      module: 'Módulo',
      menuOption: 'Opción de Menú',
      all: 'Todo',
      create: 'Crear',
      view: 'Vista',
      update: 'Actualizar',
      remove: 'Eliminar',
    }
  },
  security_userProfile: {
    title: 'Usuario x Perfil',
    fields: {
      id: '',
      userName: 'Usuario',
      userId: 'Usuario',
      profileName: 'Perfil',
      profileId: 'Perfil',
    }
  },
  security_navigation: {
    title: 'Navegación',
    fields: {
      id: '',
      userName: 'Usuario',
      userId: 'Usuario',
      navigationDate: 'Fecha',
      route: 'Ruta',
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
