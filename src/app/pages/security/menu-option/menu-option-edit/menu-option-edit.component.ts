import { HttpClient } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from '@angular/router'
import { PoPageAction, PoNotificationService, PoNotification } from '@po-ui/ng-components'
import { FormBuilder } from '@angular/forms'
import { Subscription } from 'rxjs'
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "app-menu-option-edit",
  templateUrl: "./menu-option-edit.component.html",
  styleUrls: ["./menu-option-edit.component.scss"],
})
export class MenuOptionEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  menuOptionForm = this.formBuilder.group({
    moduleId: null,
    sequence: null,
    label: null,
    route: null,
    icon: null,
    key: null,
    disabled: false
  })

  public readonly serviceApi = `${environment.baseUrl}/menu-options`
  public moduleIdService = `${environment.baseUrl}/modules/select`

  subscriptions = new Subscription()

  public readonly pageActions: Array<PoPageAction> = []

  constructor(
    private formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public restService: RestService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService,
    private languagesService: LanguagesService
  ) { }

  ngOnInit(): void {
    this.getLiterals()

    this.id = this.activatedRoute.snapshot.paramMap.get("id")

    this.pageButtonsBuilder(this.getPageType(this.activatedRoute.snapshot.routeConfig.path))

    if (this.id) {
      this.subscriptions.add(this.getMenuOption(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'edit', module: 'security', options: 'menuOption'})
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
        action: () => this.save(this.menuOptionForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.menuOptionForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getMenuOption(id: string) {
    this.restService
      .get(`/menu-options/${id}`)
      .subscribe({
        next: (result) => {
          this.menuOptionForm.patchValue({
            moduleId: result.moduleId,
            sequence: result.sequence,
            label: result.label,
            route: result.route,
            icon: result.icon,
            key: result.key,
            disabled: result.disabled
          })
        },
        error: (error) => console.log(error)
      })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.menuOptionForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/menu-options/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.menuOptionForm.reset()
                  this.router.navigate(["menu-options/new"])
                } else {
                  this.router.navigate(["menu-options"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      } else {
        this.subscriptions.add(
          this.restService
            .post("/menu-options", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.menuOptionForm.reset()
                  this.router.navigate(["menu-options/new"])
                } else {
                  this.router.navigate(["menu-options"])
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
    this.menuOptionForm.controls.moduleId.markAsDirty()
    this.menuOptionForm.controls.sequence.markAsDirty()
    this.menuOptionForm.controls.label.markAsDirty()
  }

  goBack() {
    this.router.navigate(["menu-options"])
  }
}
