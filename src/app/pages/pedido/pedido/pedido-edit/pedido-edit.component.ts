import { HttpClient } from "@angular/common/http"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { PoDynamicFormField, PoPageAction, PoNotificationService, PoNotification, PoTableAction } from "@po-ui/ng-components"
import { FormBuilder } from "@angular/forms"
import { Subscription } from "rxjs"
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from "src/app/services/languages.service"
import { finalize } from "rxjs/operators"

@Component({
  selector: "app-pedido-edit",
  templateUrl: "./pedido-edit.component.html",
  styleUrls: ["./pedido-edit.component.scss"],
})
export class PedidoEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}
  public produtoAtual: any
  public totalPreco = 0
  public disableAddButton: boolean = true
  public disableProdutos: boolean = true

  public pedidoItens: any[] = []
  public tableActions: PoTableAction[] = []
  public itensTable = []

  public columnsTable = [
    { property: "id", key: true, visible: false },
    {
      property: "produto",
      label: "Produto",
      type: "string",
      width: "25%",
    },
    {
      property: "quantidade",
      label: "Quantidade",
      width: "25%",
    },
    {
      property: "preco",
      label: "Preço Unitário",
      type: "currency",
      format: "BRL",
      width: "25%",
    },
    {
      property: "valor",
      label: "Valor",
      type: "currency",
      format: "BRL",
      width: "25%",
    },
  ]

  pedidoForm = this.formBuilder.group({
    // sequencial: 0,
    clienteId: null,
    data: null,
    hora: "",
    valorTotal: null,
    // desconto: 0,
    funcionarioId: null,
    meioPagamentoId: null,
    statusPagamentoId: null,
    isPagamentoPosterior: null,
    desabilitado: false,
  })

  pedidoItemForm = this.formBuilder.group({
    produtoId: null,
    quantidade: null,
    valor: 0,
  })

  public readonly serviceApi = `${environment.baseUrl}/pedidos`
  public clienteIdService = `${environment.baseUrl}/clientes/select`
  public funcionarioIdService = `${environment.baseUrl}/funcionarios/select`
  public meioPagamentoIdService = `${environment.baseUrl}/meios-pagamento/select`
  public statusPagamentoIdService = `${environment.baseUrl}/status-pagamento/select`
  public produtoIdService = `${environment.baseUrl}/produtos/select`

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
      this.subscriptions.add(this.getPedido(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: "edit", module: "pedido", options: "pedido" })
      .pipe(
        finalize(() => {
          this.tableActionsConstructor(this.literals.fields.form, this.tableActions)
        })
      )
      .subscribe({
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
        action: () => this.save(this.pedidoForm.value),
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.pedidoForm.value, true),
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getPedido(id: string) {
    this.restService.get(`/pedidos/${id}`).subscribe({
      next: (result) => {
        this.totalPreco = result.valorTotal
        this.pedidoForm.patchValue({
          clienteId: result.clienteId,
          data: result.data ? result.data.substring(0, 10) : null,
          hora: result.hora,
          valorTotal: result.valorTotal,
          funcionarioId: result.funcionarioId,
          meioPagamentoId: result.meioPagamentoId,
          statusPagamentoId: result.statusPagamentoId,
          isPagamentoPosterior: result.isPagamentoPosterior,
          desabilitado: result.desabilitado,
        })
        this.getPedidoItens(result.pedidoItemForm)
      },
      error: (error) => console.log(error),
    })
  }

  getPedidoItens(itens) {
    this.pedidoItens = itens
    this.itensTable = itens.map((item, index) => {
      return {
        id: index,
        produto: item.produtoNome,
        quantidade: item.quantidade,
        preco: item.preco,
        valor: item.valor,
      }
    })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.pedidoForm.valid) {
      data.pedidoItemForm = this.pedidoItens
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === "edit") {
        this.subscriptions.add(
          this.restService.put(`/pedidos/${this.id}`, data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })
              if (willCreateAnother) {
                this.pedidoForm.reset()
                this.router.navigate(["pedidos/new"])
              } else {
                this.router.navigate(["pedidos"])
              }
            },
            error: (error) => console.log(error),
          })
        )
      } else {
        this.subscriptions.add(
          this.restService.post("/pedidos", data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })
              if (willCreateAnother) {
                this.pedidoForm.reset()
                this.router.navigate(["pedidos/new"])
              } else {
                this.router.navigate(["pedidos"])
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
    // this.pedidoForm.controls.sequencial.markAsDirty()
    this.pedidoForm.controls.clienteId.markAsDirty()
    this.pedidoForm.controls.data.markAsDirty()
    this.pedidoForm.controls.hora.markAsDirty()
    this.pedidoForm.controls.funcionarioId.markAsDirty()
    this.pedidoForm.controls.meioPagamentoId.markAsDirty()
    this.pedidoForm.controls.statusPagamentoId.markAsDirty()
  }

  goBack() {
    this.router.navigate(["pedidos"])
  }

  addIten() {
    if (this.pedidoItemForm.valid) {
      if (this.pedidoItens.some((item) => item.produtoId === this.pedidoItemForm.controls.produtoId.value)) {
        this.poNotification.warning({
          message: "Produto já adicionado",
          duration: environment.poNotificationDuration,
        })
        return
      }
      console.log(this.pedidoItemForm.value)
      this.pedidoItens.push(this.pedidoItemForm.value)
      this.itensTable.push({
        id: this.itensTable.length,
        produto: this.produtoAtual.nome,
        quantidade: this.pedidoItemForm.controls.quantidade.value,
        preco: this.produtoAtual.preco,
        valor: this.pedidoItemForm.controls.valor.value,
      })
      this.totalPreco += this.pedidoItemForm.controls.valor.value
      this.pedidoForm.controls.valorTotal.setValue(this.totalPreco)
      this.pedidoItemForm.reset()
      this.disableAddButton = true
    } else {
      this.poNotification.warning({
        message: this.literals.formError,
        duration: environment.poNotificationDuration,
      })
    }
  }

  verifyAddButton() {
    this.disableAddButton = !this.pedidoItemForm.valid
  }

  verifyProdutos() {
    this.disableProdutos = !this.pedidoForm.valid
  }

  onProdutoIdChange(event) {
    if (!event) {
      return
    }
    this.subscriptions.add(
      this.restService.get(`/produtos/${event}`).subscribe({
        next: (res) => {
          this.produtoAtual = res
          if (this.pedidoItemForm.controls.quantidade.value) {
            this.verifyAddButton()
            this.pedidoItemForm.controls.valor.setValue(this.produtoAtual.preco * +this.pedidoItemForm.controls.quantidade.value)
          }
        },
      })
    )
  }

  onQuantidadeChange(event) {
    if (this.produtoAtual) {
      this.verifyAddButton()
      this.pedidoItemForm.controls.valor.setValue(this.produtoAtual.preco * event)
    }
  }

  private deleteParameterItem(item: any) {
    this.totalPreco -= item.valor
    this.pedidoForm.controls.valorTotal.setValue(this.totalPreco)
    const index = this.itensTable.indexOf(item)
    this.itensTable.splice(index, 1)
    this.pedidoItens.splice(index, 1)
  }

  private tableActionsConstructor(literals: any, tableActions: PoTableAction[]) {
    tableActions.push({ label: literals.excluir, action: this.deleteParameterItem.bind(this), icon: "fa-solid fa-trash" })
  }
}
