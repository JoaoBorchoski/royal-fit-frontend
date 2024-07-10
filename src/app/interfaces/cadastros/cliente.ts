export interface ClienteInterface {
  id?: number
  nome?: string
  cpfCnpj?: string
  email?: string
  cep?: string
  estadoId?: string
  cidadeId?: string
  bairro?: string
  endereco?: string
  numero?: number
  complemento?: string
  telefone?: string
  usuarioId?: string
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}
