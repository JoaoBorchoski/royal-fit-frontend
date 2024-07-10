export interface PagamentoInterface {
  id?: number
  clienteId?: string
  valorPago?: number
  meioPagamentoId?: string
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}
