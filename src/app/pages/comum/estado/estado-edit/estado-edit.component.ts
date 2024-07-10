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
  selector: "app-estado-edit",
  templateUrl: "./estado-edit.component.html",
  styleUrls: ["./estado-edit.component.scss"],
})
export class EstadoEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  estadoForm = this.formBuilder.group({
    codigoIbge: '',
    uf: '',
    nomeEstado: '',
  })

  public readonly serviceApi = `${environment.baseUrl}/estados`

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
      this.subscriptions.add(this.getEstado(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: 'edit', module: 'comum', options: 'estado'})
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
        action: () => this.save(this.estadoForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.estadoForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getEstado(id: string) {
    this.restService
      .get(`/estados/${id}`)
      .subscribe({
        next: (result) => {
          this.estadoForm.patchValue({
            codigoIbge: result.codigoIbge,
            uf: result.uf,
            nomeEstado: result.nomeEstado,
          })
        },
        error: (error) => console.log(error)
      })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.estadoForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/estados/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.estadoForm.reset()
                  this.router.navigate(["estados/new"])
                } else {
                  this.router.navigate(["estados"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      } else {
        this.subscriptions.add(
          this.restService
            .post("/estados", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.estadoForm.reset()
                  this.router.navigate(["estados/new"])
                } else {
                  this.router.navigate(["estados"])
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
    this.estadoForm.controls.codigoIbge.markAsDirty()
    this.estadoForm.controls.uf.markAsDirty()
    this.estadoForm.controls.nomeEstado.markAsDirty()
  }

  goBack() {
    this.router.navigate(["estados"])
  }
}
