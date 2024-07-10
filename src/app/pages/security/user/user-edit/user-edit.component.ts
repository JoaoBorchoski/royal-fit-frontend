import { HttpClient } from "@angular/common/http"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { PoComboOption, PoNotificationService, PoPageAction, PoSelectOption } from "@po-ui/ng-components"
import { Subscription } from "rxjs"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from 'src/app/services/languages.service'
import { environment } from "src/environments/environment"

interface items {
  value: string
  label: string
}

interface Response {
  hasNext: boolean
  items: items[]
}

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
})
export class UserEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public isTfaActive = false
  public literals: any = {}

  public userGroupList: Array<PoComboOption> = []
  public blockReasonList: Array<PoSelectOption> = []

  public readonly serviceApiUserGroup = `${environment.baseUrl}/user-groups/select`
  public readonly serviceApiEmpresa = `${environment.baseUrl}/empresas/select`
  public readonly serviceApiBlockReason = `${environment.baseUrl}/block-reasons/select?filter=`

  userForm = this.formBuilder.group({
    name: null,
    userGroupId: null,
    empresaId: null,
    login: null,
    password: null,
    isAdmin: false,
    isSuperUser: false,
    isBlocked: false,
    blockReasonId: null,
    mustChangePasswordNextLogon: false,
    mustActiveTwoFactorAuthentication: false,
    disabled: false
  })

  subscriptions = new Subscription()

  public readonly pageActions: Array<PoPageAction> = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private poNotification: PoNotificationService,
    private router: Router,
    public httpClient: HttpClient,
    public restService: RestService,
    private languagesService: LanguagesService
    ) {}

  ngOnInit(): void {
    this.getLiterals()

    this.subscriptions.add(this.getBlockReason())

    this.id = this.activatedRoute.snapshot.paramMap.get("id")

    this.pageButtonsBuilder(this.getPageType(this.activatedRoute.snapshot.routeConfig.path))

    if (this.id) {
      this.subscriptions.add(this.getUser(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'edit', module: 'security', options: 'user'})
      .subscribe({
        next: res => this.literals = res
      })
  }

  getPageType(route: string): string {
    switch (route) {
      case 'new':
        return 'new'
      case 'new/:id':
        return 'new'
      case 'edit':
        return 'edit'
      case 'edit/:id':
        return 'edit'
      case 'view/:id':
        return 'view'
    }
  }

  pageButtonsBuilder(pageType: string): null {
    if (pageType === 'view') {
      this.readonly = true

      this.pageActions.push(
        {
          label: this.literals.return,
          action: this.goBack.bind(this),
        }
      )
      return
    }

    this.pageActions.push(
      {
        label: this.literals.save,
        action: () => this.save(this.userForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.userForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getUser(id: string) {
    this.restService
      .get(`/users-security/${id}`)
      .subscribe({
        next: (result: any) => {
          this.userForm.patchValue({
            name: result.name,
            userGroupId: result.userGroupId,
            empresaId: result.empresaId,
            login: result.login,
            password: 'dba50d5d-39d1-4ca2-bd6b-cbc707678e0d',
            isAdmin: result.isAdmin,
            isSuperUser: result.isSuperUser,
            isBlocked: result.isBlocked,
            blockReasonId: result.blockReasonId,
            mustChangePasswordNextLogon: result.mustChangePasswordNextLogon,
            mustActiveTwoFactorAuthentication: result.mustActiveTwoFactorAuthentication,
            disabled: result.disabled
          })
          this.isTfaActive = result.isTfaActive
        },
        error: (error) => console.log(error)
      })
  }

  getBlockReason() {
    this.httpClient
      .get(this.serviceApiBlockReason)
      .subscribe({
        next: (result: Response) => {
          this.blockReasonList = result.items
        },
        error: (error) => console.log(error)
      })
  }

  twoFactorAuthenticationDisable() {
    this.httpClient.post(`${environment.baseUrl}/tfa/disable`, { id: this.id })
      .subscribe({
        next: () => this.isTfaActive = false,
        error: (error) => console.log(error)
      })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.userForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/users-security/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.userForm.reset()
                  this.router.navigate(["users/new"])
                } else {
                  this.router.navigate(["users"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      } else {
        this.subscriptions.add(
          this.restService
            .post("/users-security", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.userForm.reset()
                  this.router.navigate(["users/new"])
                } else {
                  this.router.navigate(["users"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      }
    } else {
      this.markAsDirty()
      this.poNotification.warning({
        message: this.literals.formError,
        duration: environment.poNotificationDuration
      })
    }
  }

  markAsDirty() {
    this.userForm.controls.userGroupId.markAsDirty()
    this.userForm.controls.name.markAsDirty()
    this.userForm.controls.login.markAsDirty()
    this.userForm.controls.password.markAsDirty()
  }

  goBack() {
    this.router.navigate(["users"])
  }
}
