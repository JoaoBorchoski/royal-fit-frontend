export const validarCnpj = (cpfCnpj: string): boolean => {
  cpfCnpj = cpfCnpj.replace(/[^\d]+/g, "")

  if (cpfCnpj.length !== 14) return false

  if (
    cpfCnpj == "00000000000000" ||
    cpfCnpj == "11111111111111" ||
    cpfCnpj == "22222222222222" ||
    cpfCnpj == "33333333333333" ||
    cpfCnpj == "44444444444444" ||
    cpfCnpj == "55555555555555" ||
    cpfCnpj == "66666666666666" ||
    cpfCnpj == "77777777777777" ||
    cpfCnpj == "88888888888888" ||
    cpfCnpj == "99999999999999"
  )
    return false

  let tamanho = cpfCnpj.length - 2
  let numeros = cpfCnpj.substring(0, tamanho)
  let digitos = cpfCnpj.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== Number(digitos.charAt(0))) return false

  tamanho = tamanho + 1
  numeros = cpfCnpj.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== Number(digitos.charAt(1))) return false

  return true
}
