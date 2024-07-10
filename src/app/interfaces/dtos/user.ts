interface BlockReasonDTO {
  description: string
  instructionsToSolve: string
}

interface UserDTO {
  blockReasonId: BlockReasonDTO
  isBlocked: boolean
}

export interface User {
  id?: string
  login?: string
  password?: string
  name?: string
  token?: string
  user?: UserDTO
}
