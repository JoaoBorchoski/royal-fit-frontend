import { HttpClient } from "@angular/common/http"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { PoDynamicFormField, PoPageAction, PoNotificationService, PoNotification, PoLookupColumn } from "@po-ui/ng-components"
import { FormBuilder } from "@angular/forms"
import { Subscription } from "rxjs"
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "app-controle-despesa-edit",
  templateUrl: "./controle-despesa-edit.component.html",
  styleUrls: ["./controle-despesa-edit.component.scss"],
})
export class ControleDespesaEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  public formaPagamentoIdService = `${environment.baseUrl}/meios-pagamento/select`

  columnsFornecedor: Array<PoLookupColumn> = [{ property: "label", label: "Nome" }]

  public statusOptions = [
    { label: "Pendente", value: 0 },
    { label: "Pago", value: 1 },
    { label: "Cancelado", value: 2 },
  ]

  controleDespesaForm = this.formBuilder.group({
    dataEmissao: new Date(),
    dataVencimento: null,
    descricao: "",
    valor: 0,
    status: 0,
    categoria: "",
    codigoBarras: "",
    pedidoId: "",
    clienteId: "",
    formaPagamentoId: "",
  })

  public readonly serviceApi = `${environment.baseUrl}/controle-despesas`

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
      this.subscriptions.add(this.getControleDespesa(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: "edit", module: "financeiro", options: "controleDespesa" }).subscribe({
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
        action: () => this.save(this.controleDespesaForm.value),
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.controleDespesaForm.value, true),
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getControleDespesa(id: string) {
    this.restService.get(`/controle-despesas/${id}`).subscribe({
      next: (result) => {
        this.controleDespesaForm.patchValue({
          dataEmissao: result.dataEmissao ? result.dataEmissao.substring(0, 10) : null,
          dataVencimento: result.dataVencimento ? result.dataVencimento.substring(0, 10) : null,
          descricao: result.descricao,
          valor: result.valor,
          status: result.status,
          categoria: result.categoria,
          codigoBarras: result.codigoBarras,
          pedidoId: result.pedidoId,
          clienteId: result.clienteId,
          formaPagamentoId: result.formaPagamentoId,
        })
      },
      error: (error) => console.log(error),
    })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.controleDespesaForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === "edit") {
        this.subscriptions.add(
          this.restService.put(`/controle-despesas/${this.id}`, data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.controleDespesaForm.reset()
                this.router.navigate(["controle-despesas/new"])
              } else {
                this.router.navigate(["controle-despesas"])
              }
            },
            error: (error) => console.log(error),
          })
        )
      } else {
        this.subscriptions.add(
          this.restService.post("/controle-despesas", data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.controleDespesaForm.reset()
                this.router.navigate(["controle-despesas/new"])
              } else {
                this.router.navigate(["controle-despesas"])
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
    this.controleDespesaForm.controls.dataEmissao.markAsDirty()
    this.controleDespesaForm.controls.dataVencimento.markAsDirty()
  }

  goBack() {
    this.router.navigate(["controle-despesas"])
  }
}
