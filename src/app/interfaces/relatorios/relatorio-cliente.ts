export interface RelatorioClienteInterface {
  id?: number
  clienteId?: string
  dataInicio?: Date
  dataFim?: Date
  relatório?: string
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}
