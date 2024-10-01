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
  selector: "app-estoque-edit",
  templateUrl: "./estoque-edit.component.html",
  styleUrls: ["./estoque-edit.component.scss"],
})
export class EstoqueEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  pedidoItemForm = this.formBuilder.group({
    produtoId: null,
    quantidade: null,
    desabilitado: false,
  })

  public readonly serviceApi = `${environment.baseUrl}/estoques`
  public produtoIdService = `${environment.baseUrl}/produtos/select`
  public pedidoIdService = `${environment.baseUrl}/pedidos/select`

  subscriptions = new Subscription()

  public readonly pageActions: Array<PoPageAction> = []
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
      this.subscriptions.add(this.getPedidoItem(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: "edit", module: "pedido", options: "pedidoItem" }).subscribe({
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
        action: () => this.save(this.pedidoItemForm.value),
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.pedidoItemForm.value, true),
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getPedidoItem(id: string) {
    this.restService.get(`/estoques/${id}`).subscribe({
      next: (result) => {
        this.pedidoItemForm.patchValue({
          produtoId: result.produtoId,
          quantidade: result.quantidade,
          desabilitado: result.desabilitado,
        })
      },
      error: (error) => console.log(error),
    })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.pedidoItemForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === "edit") {
        this.subscriptions.add(
          this.restService.put(`/estoques/${this.id}`, data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.pedidoItemForm.reset()
                this.router.navigate(["estoques/new"])
              } else {
                this.router.navigate(["estoques"])
              }
            },
            error: (error) => console.log(error),
          })
        )
      } else {
        this.subscriptions.add(
          this.restService.post("/estoques", data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.pedidoItemForm.reset()
                this.router.navigate(["estoques/new"])
              } else {
                this.router.navigate(["estoques"])
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
    this.pedidoItemForm.controls.produtoId.markAsDirty()
  }

  goBack() {
    this.router.navigate(["estoques"])
  }
}
