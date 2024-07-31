import { HttpClient } from "@angular/common/http"
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import {
  PoDynamicFormField,
  PoPageAction,
  PoNotificationService,
  PoNotification,
  PoTableAction,
  PoModalComponent,
  PoModalAction,
} from "@po-ui/ng-components"
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
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent
  public widthWindow = window.innerWidth

  public id: string
  public readonly = false
  public result: any
  public literals: any = {}
  public produtoAtual: any
  public produtoAtualEdit: any
  public totalPreco = 0
  public disableAddButton: boolean = true
  public disableEditButton: boolean = true
  public disableProdutos: boolean = true
  public prodNameEdit: string
  public descPorcentagem: number = 0

  public pedidoItens: any[] = []
  public tableActions: PoTableAction[] = []
  public itensTable = []

  public isLiberadoSelect = [
    { label: "Aguardando", value: 0 },
    { label: "Liberado", value: 1 },
  ]

  public columnsTable = [
    { property: "id", key: true, visible: false },
    { property: "produtoId", visible: false },
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
      visible: this.widthWindow > 768,
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
    clienteId: null,
    data: null,
    hora: "",
    valorTotal: 0,
    funcionarioId: null,
    meioPagamentoId: null,
    // statusPagamentoId: null,
    isPagamentoPosterior: false,
    desabilitado: false,
    isLiberado: 0,
    descricao: "",
  })

  pedidoItemForm = this.formBuilder.group({
    produtoId: null,
    quantidade: null,
    valor: 0,
  })

  pedidoItemFormEdit = this.formBuilder.group({
    id: null,
    produtoId: null,
    quantidade: null,
    valor: 0,
  })

  public primaryAction: PoModalAction = {
    label: "Salvar",
    action: () => this.editItem(),
    disabled: this.verifyEditButton(),
  }
  public secondaryAction: PoModalAction = {
    label: "Cancelar",
    action: () => {
      this.pedidoItemFormEdit.reset()
      this.poModal.close()
    },
  }

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

  editParameterItem(item: any) {
    this.subscriptions.add(
      this.restService.get(`/produtos/${item.produtoId}`).subscribe({
        next: (res) => {
          this.prodNameEdit = res.nome
          this.produtoAtualEdit = res
        },
      })
    )

    this.pedidoItemFormEdit.patchValue({
      id: item.id,
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      valor: item.valor,
    })
    this.poModal.open()
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
        this.descPorcentagem = result.desconto
        this.totalPreco = result.valorTotal
        this.pedidoForm.patchValue({
          clienteId: result.clienteId,
          data: result.data ? result.data.substring(0, 10) : null,
          hora: result.hora,
          valorTotal: result.valorTotal,
          funcionarioId: result.funcionarioId,
          meioPagamentoId: result.meioPagamentoId,
          // statusPagamentoId: result.statusPagamentoId,
          isPagamentoPosterior: result.isPagamentoPosterior,
          isLiberado: result.isLiberado ? 1 : 0,
          desabilitado: result.desabilitado,
          descricao: result.descricao,
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
        id: item.id,
        produtoId: item.produtoId,
        produto: item.produtoNome,
        quantidade: item.quantidade,
        preco: this.getTotalMinusDesc(item.preco),
        valor: this.getTotalMinusDesc(item.valor),
      }
    })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.pedidoForm.valid) {
      if (this.pedidoItens.length === 0) {
        this.poNotification.warning({
          message: "Adicione ao menos um produto ao pedido",
          duration: environment.poNotificationDuration,
        })
        return
      }
      data.isLiberado = data.isLiberado == 1 ? true : false
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
    // this.pedidoForm.controls.statusPagamentoId.markAsDirty()
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
      this.pedidoItens.push(this.pedidoItemForm.value)
      this.itensTable.push({
        id: this.itensTable.length + 1,
        produtoId: this.pedidoItemForm.controls.produtoId.value,
        produto: this.produtoAtual.nome,
        quantidade: this.pedidoItemForm.controls.quantidade.value,
        preco: this.getTotalMinusDesc(this.produtoAtual.preco),
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

  editItem() {
    if (this.pedidoItemFormEdit.valid) {
      const indexItens = this.pedidoItens.findIndex((item) => item.id === this.pedidoItemFormEdit.value.id)
      this.totalPreco -= this.getTotalMinusDesc(this.pedidoItens[indexItens].valor)
      this.totalPreco += this.pedidoItemFormEdit.value.valor
      this.pedidoForm.controls.valorTotal.setValue(this.totalPreco)
      this.pedidoItens.splice(indexItens, 1, this.pedidoItemFormEdit.value)
      const indexTable = this.itensTable.findIndex((item) => item.id === this.pedidoItemFormEdit.value.id)
      this.itensTable.splice(indexTable, 1, {
        id: this.pedidoItemFormEdit.value.id,
        produtoId: this.pedidoItemFormEdit.controls.produtoId.value,
        produto: this.prodNameEdit,
        quantidade: this.pedidoItemFormEdit.controls.quantidade.value,
        preco: this.getTotalMinusDesc(this.produtoAtualEdit.preco),
        valor: this.pedidoItemFormEdit.controls.valor.value,
      })
      this.poModal.close()
    } else {
      this.poNotification.warning({
        message: "Preencha os campos corretamente",
        duration: environment.poNotificationDuration,
      })
    }
  }

  verifyAddButton() {
    this.disableAddButton = !this.pedidoItemForm.valid
  }

  verifyEditButton() {
    return !this.pedidoItemFormEdit.valid
  }

  verifyProdutos() {
    this.disableProdutos = !this.pedidoForm.valid
  }

  onProdutoIdChange(event) {
    if (!event) {
      this.prodNameEdit = ""
      return
    }
    this.subscriptions.add(
      this.restService.get(`/produtos/${event}`).subscribe({
        next: (res) => {
          this.prodNameEdit = res.nome
          this.produtoAtual = res
          if (this.pedidoItemForm.controls.quantidade.value) {
            this.verifyAddButton()
            this.pedidoItemForm.controls.valor.setValue(
              this.getTotalMinusDesc(this.produtoAtual.preco * +this.pedidoItemForm.controls.quantidade.value)
            )
          }
        },
      })
    )
  }

  onProdutoIdChangeEdit(event) {
    if (!event) {
      this.prodNameEdit = ""
      return
    }
    this.subscriptions.add(
      this.restService.get(`/produtos/${event}`).subscribe({
        next: (res) => {
          this.prodNameEdit = res.nome
          this.produtoAtualEdit = res
          if (this.pedidoItemFormEdit.controls.quantidade.value) {
            this.pedidoItemFormEdit.controls.valor.setValue(
              this.getTotalMinusDesc(this.produtoAtualEdit.preco * +this.pedidoItemFormEdit.controls.quantidade.value)
            )
          }
        },
      })
    )
  }

  onQuantidadeChange(event) {
    if (this.produtoAtual) {
      this.verifyAddButton()
      this.pedidoItemForm.controls.valor.setValue(this.getTotalMinusDesc(this.produtoAtual.preco * event))
    }
  }

  onQuantidadeChangeEdit(event) {
    if (this.produtoAtualEdit) {
      this.pedidoItemFormEdit.controls.valor.setValue(this.getTotalMinusDesc(this.produtoAtualEdit.preco * event))
    }
  }

  onClienteIdChange(event) {
    if (!event) return

    this.subscriptions.add(
      this.restService.get(`/clientes/${event}`).subscribe({
        next: (res) => {
          this.descPorcentagem = res.desconto
        },
      })
    )

    this.verifyProdutos()
  }

  private deleteParameterItem(item: any) {
    this.totalPreco -= item.valor
    this.pedidoForm.controls.valorTotal.setValue(this.totalPreco)
    const index = this.itensTable.indexOf(item)
    this.itensTable.splice(index, 1)
    this.pedidoItens.splice(index, 1)
  }

  private tableActionsConstructor(literals: any, tableActions: PoTableAction[]) {
    tableActions.push({ label: literals.editar, action: this.editParameterItem.bind(this), icon: "fa-solid fa-pen" })
    tableActions.push({ label: literals.excluir, action: this.deleteParameterItem.bind(this), icon: "fa-solid fa-trash" })
  }

  public getTotalMinusDesc(valor: number) {
    return valor - (valor * this.descPorcentagem) / 100
  }
}
