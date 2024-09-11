import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { PoNotificationService } from "@po-ui/ng-components"
import { AuthService } from "./auth.service"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: "root",
})
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private poNotificationService: PoNotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error.message.includes("Estoque insuficiente ou estoque não cadastrado para o produto")) {
          this.poNotificationService.warning({
            message: error.error.message,
            duration: environment.poNotificationDuration,
          })
        } else if (error.status === 400) {
          switch (error.error.message) {
            case "Email or password incorrect!":
              this.poNotificationService.warning({
                message: "E-Mail ou senha incorreta!",
                duration: environment.poNotificationDuration,
              })
              break
            case "User does not exists!":
              this.poNotificationService.warning({
                message: "E-Mail inválido!",
                duration: environment.poNotificationDuration,
              })
              break
            case "Estoque já cadastrado para este produto":
              this.poNotificationService.warning({
                message: "Estoque já cadastrado para este produto",
                duration: environment.poNotificationDuration,
              })
              break
            case "Arquivo com produtos não cadastrados, verificar.":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Arquivo com clientes e/ou funcionários não cadastrados, verificar.":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Funcionários com email duplicado não são permitidos.":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Data de início não pode ser maior que a data de fim":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Não há pedidos para o período selecionado":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Arquivo com data inválida, verificar.":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Cliente não possui garrafão cadastrado":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Quantidade de garrafões insuficiente":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Quantidade de bonificação insuficiente":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Quantidade de estoque insuficiente":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Nível de Acesso não encontrado.":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Cliente não encontrado":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break
            case "Já existe um cliente com este email e/ou CNPJ":
              this.poNotificationService.warning({
                message: error.error.message,
                duration: environment.poNotificationDuration,
              })
              break

            default:
              this.poNotificationService.warning({
                message: (error as any)?.data?.name ?? "Ocorreu um erro inesperado",
                duration: environment.poNotificationDuration,
              })
              break
          }
        }

        if (error.status === 401) {
          this.authService.signOut()
        }

        if (error.status === 404) {
          switch (error.error.message) {
            case "not null constraint":
              this.poNotificationService.warning({
                message: "Não foi possível deletar! Este item está vinculado a outro.",
                duration: environment.poNotificationDuration,
              })
              break
            default:
              this.poNotificationService.warning({
                message: (error as any)?.data?.name ?? "Ocorreu um erro inesperado",
                duration: environment.poNotificationDuration,
              })
              break
          }
        }

        if (error?.error?.data?.name) {
          this.poNotificationService.warning({
            message: error?.error?.data?.name,
            duration: environment.poNotificationDuration,
          })
        }

        return throwError(() => error)
      })
    )
  }
}
