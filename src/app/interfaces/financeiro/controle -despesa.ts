export interface Controle DespesaInterface {
  id?: number
  dataEmissao?: Date
  dataVencimento?: Date
  descricao?: string
  valor?: number
  status?: number
  categoria?: string
  codigoBarras?: string
  pedidoId?: string
  clienteId?: string
  formaPagamentoId?: string
  createdAt?: Date
  updatedAt?: Date
}
