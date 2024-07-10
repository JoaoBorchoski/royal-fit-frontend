export interface BonificacaoInterface {
  id?: number
  clienteId?: string
  totalVendido?: number
  bonificacaoDisponivel?: number
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}
