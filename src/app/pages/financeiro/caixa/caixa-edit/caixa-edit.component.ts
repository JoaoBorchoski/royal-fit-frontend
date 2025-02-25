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
  selector: "app-caixa-edit",
  templateUrl: "./caixa-edit.component.html",
  styleUrls: ["./caixa-edit.component.scss"],
})
export class CaixaEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  caixaForm = this.formBuilder.group({
    descricao: "",
    valor: 0,
    data: new Date(),
    pedidoId: null,
    clienteId: null,
    formaPagamentoId: null,
  })

  public readonly serviceApi = `${environment.baseUrl}/caixas`

  subscriptions = new Subscription()

  public readonly pageActions: Array<PoPageAction> = []

  public formaPagamentoIdService = `${environment.baseUrl}/meios-pagamento/select`
  public clienteIdService = `${environment.baseUrl}/clientes/select`
  public pedidoIdService = `${environment.baseUrl}/pedidos/select`

  columnsFornecedor: Array<PoLookupColumn> = [{ property: "label", label: "Nome" }]

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
      this.subscriptions.add(this.getCaixa(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: "edit", module: "financeiro", options: "caixa" }).subscribe({
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
        action: () => this.save(this.caixaForm.value),
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.caixaForm.value, true),
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getCaixa(id: string) {
    this.restService.get(`/caixas/${id}`).subscribe({
      next: (result) => {
        this.caixaForm.patchValue({
          descricao: result.descricao,
          valor: result.valor,
          data: result.data ? result.data.substring(0, 10) : null,
          pedidoId: result.pedidoId,
          clienteId: result.clienteId,
          formaPagamentoId: result.formaPagamentoId,
        })
      },
      error: (error) => console.log(error),
    })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.caixaForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === "edit") {
        this.subscriptions.add(
          this.restService.put(`/caixas/${this.id}`, data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.caixaForm.reset()
                this.router.navigate(["caixas/new"])
              } else {
                this.router.navigate(["caixas"])
              }
            },
            error: (error) => console.log(error),
          })
        )
      } else {
        this.subscriptions.add(
          this.restService.post("/caixas", data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.caixaForm.reset()
                this.router.navigate(["caixas/new"])
              } else {
                this.router.navigate(["caixas"])
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
    this.caixaForm.controls.descricao.markAsDirty()
    this.caixaForm.controls.data.markAsDirty()
  }

  goBack() {
    this.router.navigate(["caixas"])
  }
}
