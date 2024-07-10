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
  selector: "app-module-edit",
  templateUrl: "./module-edit.component.html",
  styleUrls: ["./module-edit.component.scss"],
})
export class ModuleEditComponent implements OnInit {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  moduleForm = this.formBuilder.group({
    name: null,
    disabled: false
  })

  public readonly serviceApi = `${environment.baseUrl}/modules`

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
      this.subscriptions.add(this.getModule(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'edit', module: 'security', options: 'module'})
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
        action: () => this.save(this.moduleForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.moduleForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getModule(id: string) {
    this.restService
      .get(`/modules/${id}`)
      .subscribe({
        next: (result) => {
          this.moduleForm.patchValue({
            name: result.name,
            disabled: result.disabled
          })
        },
        error: (error) => console.log(error)
      })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.moduleForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/modules/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.moduleForm.reset()
                  this.router.navigate(["modules/new"])
                } else {
                  this.router.navigate(["modules"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      } else {
        this.subscriptions.add(
          this.restService
            .post("/modules", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.moduleForm.reset()
                  this.router.navigate(["modules/new"])
                } else {
                  this.router.navigate(["modules"])
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
    this.moduleForm.controls.name.markAsDirty()
  }

  goBack() {
    this.router.navigate(["modules"])
  }
}
