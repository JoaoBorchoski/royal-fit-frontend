import { HttpClient } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from '@angular/router'
import { PoDynamicFormField, PoPageAction, PoNotificationService, PoNotification } from '@po-ui/ng-components'
import { FormBuilder } from '@angular/forms'
import { Subscription } from 'rxjs'
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "app-cep-edit",
  templateUrl: "./cep-edit.component.html",
  styleUrls: ["./cep-edit.component.scss"],
})
export class CepEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public estadoId = ''
  public result: any
  public literals: any = {}

  cepForm = this.formBuilder.group({
    codigoCep: '',
    logradouro: '',
    bairro: '',
    estadoId: null,
    cidadeId: null,
  })

  public readonly serviceApi = `${environment.baseUrl}/ceps`
  public estadoIdService = `${environment.baseUrl}/estados/select`
  public cidadeIdService = `${environment.baseUrl}/cidades/select`

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
      this.subscriptions.add(this.getCep(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: 'edit', module: 'comum', options: 'cep'})
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
        action: () => this.save(this.cepForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.cepForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getCep(id: string) {
    this.restService
      .get(`/ceps/${id}`)
      .subscribe({
        next: (result) => {
          this.estadoId = result.estadoId
          this.cepForm.patchValue({
            codigoCep: result.codigoCep,
            logradouro: result.logradouro,
            bairro: result.bairro,
            estadoId: result.estadoId,
            cidadeId: result.cidadeId,
          })
        },
        error: (error) => console.log(error)
      })
  }

  estadoIdChange(event: string) {
    this.cidadeIdService = `${environment.baseUrl}/cidades/select?estadoId=${event}`
  }

  save(data, willCreateAnother?: boolean) {
    if (this.cepForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/ceps/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.cepForm.reset()
                  this.router.navigate(["ceps/new"])
                } else {
                  this.router.navigate(["ceps"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      } else {
        this.subscriptions.add(
          this.restService
            .post("/ceps", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.cepForm.reset()
                  this.router.navigate(["ceps/new"])
                } else {
                  this.router.navigate(["ceps"])
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
    this.cepForm.controls.codigoCep.markAsDirty()
  }

  goBack() {
    this.router.navigate(["ceps"])
  }
}
