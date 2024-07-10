export interface PedidoInterface {
  id?: number
  sequencial?: number
  clienteId?: string
  data?: Date
  hora?: string
  valorTotal?: number
  desconto?: number
  funcionarioId?: string
  meioPagamentoId?: string
  statusPagamentoId?: string
  isPagamentoPosterior?: boolean
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}
