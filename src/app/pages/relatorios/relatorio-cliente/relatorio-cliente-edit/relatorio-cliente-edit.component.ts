import { HttpClient } from "@angular/common/http"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { PoDynamicFormField, PoPageAction, PoNotificationService, PoNotification } from "@po-ui/ng-components"
import { FormBuilder } from "@angular/forms"
import { Subscription } from "rxjs"
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "app-relatorio-cliente-edit",
  templateUrl: "./relatorio-cliente-edit.component.html",
  styleUrls: ["./relatorio-cliente-edit.component.scss"],
})
export class RelatorioClienteEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  public isLiberadoSelect = [
    { label: "Aguardando", value: 0 },
    { label: "Liberado", value: 1 },
  ]

  relatorioClienteForm = this.formBuilder.group({
    clienteId: null,
    dataInicio: null,
    isLiberado: null,
    quantidade: null,
    desabilitado: false,
  })

  public readonly serviceApi = `${environment.baseUrl}/relatorios-clientes`
  public clienteIdService = `${environment.baseUrl}/clientes/select`

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
  ) {}

  ngOnInit(): void {
    this.getLiterals()

    this.id = this.activatedRoute.snapshot.paramMap.get("id")

    this.pageButtonsBuilder(this.getPageType(this.activatedRoute.snapshot.routeConfig.path))

    if (this.id) {
      this.subscriptions.add(this.getRelatorioCliente(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: "edit", module: "relatorios", options: "relatorioCliente" }).subscribe({
      next: (res) => (this.literals = res),
    })
  }

  getPageType(route: string): string {
    switch (route) {
      case "new":
        return "new"
      case "new/:id":
        return "new"
      case "edit":
        return "edit"
      case "edit/:id":
        return "edit"
      case "view/:id":
        return "view"
    }
  }

  pageButtonsBuilder(pageType: string): null {
    if (pageType === "view") {
      this.readonly = true

      this.pageActions.push({
        label: this.literals.return,
        action: this.goBack.bind(this),
      })
      return
    }

    this.pageActions.push(
      {
        label: this.literals.save,
        action: () => this.save(this.relatorioClienteForm.value),
      },
      // {
      //   label: this.literals.saveAndNew,
      //   action: () => this.save(this.relatorioClienteForm.value, true),
      // },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getRelatorioCliente(id: string) {
    this.restService.get(`/pedido-bonificados/${id}`).subscribe({
      next: (result) => {
        this.relatorioClienteForm.patchValue({
          clienteId: result.clienteId,
          dataInicio: result.data ? result.data.substring(0, 10) : null,
          isLiberado: result.isLiberado ? 1 : 0,
          quantidade: result.quantidade,
          desabilitado: result.desabilitado,
        })
      },
      error: (error) => console.log(error),
    })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.relatorioClienteForm.valid) {
      data.isLiberado = data.isLiberado == 1 ? true : false
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === "edit") {
        this.subscriptions.add(
          this.restService.put(`/pedido-bonificados/${this.id}`, data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.relatorioClienteForm.reset()
                this.router.navigate(["pedido-bonificados/new"])
              } else {
                this.router.navigate(["pedido-bonificados"])
              }
            },
            error: (error) => console.log(error),
          })
        )
      } else {
        this.subscriptions.add(
          this.restService.post("/pedido-bonificados", data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.relatorioClienteForm.reset()
                this.router.navigate(["pedido-bonificados/new"])
              } else {
                this.router.navigate(["pedido-bonificados"])
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
        duration: environment.poNotificationDuration,
      })
    }
  }

  markAsDirty() {
    this.relatorioClienteForm.controls.clienteId.markAsDirty()
    this.relatorioClienteForm.controls.dataInicio.markAsDirty()
  }

  goBack() {
    this.router.navigate(["pedido-bonificados"])
  }
}
