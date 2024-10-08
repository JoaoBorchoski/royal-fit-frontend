import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { PoDialogService } from "@po-ui/ng-components"
import { BehaviorSubject, Observable } from "rxjs"

import { User } from "./../interfaces/dtos/user"
import { RestService } from "./rest.service"

interface LoginRequestProps {
  login: string
  password: string
  rememberUser: boolean
}

interface ResponseProps {
  token: string
  refreshToken: string
  user: {
    name: string
    login: string
    avatar: string
    mustChangePassword?: boolean
    mustActiveTwoFactorAuthentication?: boolean
    tfa?: boolean
    isBlocked?: boolean
    blockReasonId?: {
      description?: string
      instructionsToSolve?: string
    }
    isDisabled?: boolean
    isAdmin?: boolean
  }
}

interface ResetPasswordRequestProps {
  id: string
  newPassword: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userSubject: BehaviorSubject<User>
  public user: Observable<User>
  public response: ResponseProps

  constructor(private restService: RestService, private router: Router, private poDialogService: PoDialogService) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("@royalfit:user")))
    this.user = this.userSubject.asObservable()
  }

  public get userValue(): User {
    const user = JSON.parse(localStorage.getItem("@royalfit:user"))
    return user
  }

  public updateUser(user: User) {
    localStorage.removeItem("@royalfit:user")
    localStorage.setItem("@royalfit:user", JSON.stringify(user))
  }

  signIn(event: LoginRequestProps) {
    return new Promise((resolve, reject) => {
      this.restService.post("/sessions", event).subscribe({
        next: (response: ResponseProps) => {
          const valuesToSave = {
            token: response.token,
            refreshToken: response.refreshToken,
            user: {
              name: response.user.name,
              login: response.user.login,
              avatar: response.user.avatar,
              tfa: response.user.tfa,
              isAdmin: response.user.isAdmin,
            },
          }

          if (!response.user.tfa || response.user.mustActiveTwoFactorAuthentication) {
            localStorage.setItem("@royalfit:user", JSON.stringify(valuesToSave))
          }
          this.response = response

          if (this.response.user.mustChangePassword) {
            this.router.navigate([`reset/${this.response.user.mustChangePassword}`])
          }

          if (
            !this.response.user.mustChangePassword &&
            !this.response.user.isBlocked &&
            !this.response.user.tfa &&
            !this.response.user.mustActiveTwoFactorAuthentication
          ) {
            // this.router.navigate(["home"])
            resolve({
              sucess: true,
              value: valuesToSave,
            })
          }

          if (response.user.isBlocked) {
            this.poDialogService.alert({
              title: "Usuário Bloqueado",
              message: `
              <p>
                <b>Motivo de bloqueio:</b> ${response.user.blockReasonId ? response.user.blockReasonId.description : "Não definido"}
              </p>
              <p>
                <b>Instruções de Reset:</b> ${
                  response.user.blockReasonId ? response.user.blockReasonId.instructionsToSolve : "Contate um administrador."
                }
              </p>`,
            })
            localStorage.removeItem("@royalfit:user")
            localStorage.removeItem("@royalfit:temp")
            reject()
          }

          if (response.user.isDisabled) {
            this.poDialogService.alert({
              title: "Usuário Inativo",
              message: `
              <p>
                Caso queira ativar novamente sua conta, entre em contato com um administrador.
              </p>`,
            })
            localStorage.removeItem("@royalfit:user")
            localStorage.removeItem("@royalfit:temp")
            reject()
          }

          resolve({
            tfa: response.user.tfa,
            mustActiveTwoFactorAuthentication: response.user.mustActiveTwoFactorAuthentication,
            value: valuesToSave,
          })
        },
        error: (error) => {
          console.log(error)
        },
      })
    })
  }

  signOut() {
    localStorage.removeItem("@royalfit:user")
    localStorage.removeItem("@royalfit:temp")
    localStorage.removeItem("@royalfit:preferences")
    this.router.navigate(["login"])
  }

  resetPassword(event: ResetPasswordRequestProps) {
    const payload = {
      password: event.newPassword,
    }

    this.restService.post(`/passwords/reset?token=${event.id}`, payload).subscribe({
      next: () => {
        if (this.response.user.mustChangePassword) {
          this.router.navigate(["home"])
        } else {
          this.router.navigate(["login"])
        }
      },
      error: (error) => {
        console.log(error)
      },
    })
  }

  get tablePreferences() {
    return JSON.parse(localStorage.getItem("@royalfit:preferences"))
  }

  routeTablePreferences(route: string) {
    const preferences = this.tablePreferences
    if (preferences) {
      const preference = preferences.find((preference) => preference.route === route)
      return preference
    }
    return null
  }

  browseTablePreferences(route: string, preferences: any) {
    let tablePreferences = []
    const savedTablePreferences = this.tablePreferences

    if (savedTablePreferences) tablePreferences = savedTablePreferences

    if (tablePreferences.length > 0) {
      let indexOfPreferences: number = null
      tablePreferences.map((tablePreference, index) => {
        if (tablePreference.route === route) indexOfPreferences = index
      })
      if (indexOfPreferences !== null) tablePreferences.splice(indexOfPreferences, 1)
    }

    tablePreferences.push({ route, preferences })

    localStorage.removeItem("@royalfit:preferences")
    localStorage.setItem("@royalfit:preferences", JSON.stringify(tablePreferences))
  }
}
