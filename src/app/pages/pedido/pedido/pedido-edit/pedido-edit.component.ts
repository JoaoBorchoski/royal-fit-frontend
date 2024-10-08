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
  PoLookupColumn,
} from "@po-ui/ng-components"
import { FormBuilder } from "@angular/forms"
import { Subscription } from "rxjs"
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from "src/app/services/languages.service"
import { finalize } from "rxjs/operators"
import { AuthService } from "src/app/services/auth.service"
import { v4 as uuidv4 } from "uuid"

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
  public disableMeioPagamento = false
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
  public disableDescontoButtom: boolean = false
  public user: any
  public descontosCliente: any[] = []

  public pedidoItens: any[] = []
  public tableActions: PoTableAction[] = []
  public itensTable = []
  public horaAtual = new Date().toLocaleTimeString().substring(0, 5).split(":").join("")

  public isLiberadoSelect = [
    { label: "Aguardando", value: 0 },
    { label: "Liberado", value: 1 },
  ]

  public tipoEntregaSelect = [
    { label: "Retirada na Fonte", value: 0 },
    { label: "Entrega PG", value: 1 },
    { label: "Entrega outras regiões", value: 2 },
  ]

  columnsFornecedor: Array<PoLookupColumn> = [{ property: "label", label: "Nome" }]

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
    data: new Date(),
    hora: this.horaAtual,
    valorTotal: 0,
    funcionarioId: null,
    meioPagamentoId: null,
    // statusPagamentoId: null,
    isPagamentoPosterior: false,
    desabilitado: false,
    isLiberado: 0,
    descricao: "",
    desconto: 0,
    subTotal: null,
    tipoEntrega: null,
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
  public produtoIdService = `${environment.baseUrl}/produtos/select-without-desabilitado`

  subscriptions = new Subscription()

  public readonly pageActions: Array<PoPageAction> = []

  constructor(
    private formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public restService: RestService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService,
    private languagesService: LanguagesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getLiterals()
    this.user = this.authService.userValue.user

    this.id = this.activatedRoute.snapshot.paramMap.get("id")

    this.pageButtonsBuilder(this.getPageType(this.activatedRoute.snapshot.routeConfig.path))

    if (this.id) {
      this.disableMeioPagamento = true
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
        label: "Imprimir Canhoto",
        action: () => this.imprimirCanhoto(this.pedidoForm.value),
        disabled: !(this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === "edit"),
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
        if (result.desconto && result.desconto > 0) this.disableDescontoButtom = true

        // this.totalPreco = result.valorTotal
        this.pedidoForm.patchValue({
          clienteId: result.clienteId,
          data: result.data ? result.data.substring(0, 10) : null,
          hora: result.hora,
          // valorTotal: +(result.valorTotal - result.desconto ?? 0).toFixed(2),
          valorTotal: +result.valorTotal.toFixed(2),
          funcionarioId: result.funcionarioId,
          meioPagamentoId: result.meioPagamentoId,
          // statusPagamentoId: result.statusPagamentoId,
          // isPagamentoPosterior: result.isPagamentoPosterior,
          isLiberado: result.isLiberado ? 1 : 0,
          desabilitado: result.desabilitado,
          descricao: result.descricao,
          desconto: result.desconto,
          subTotal: result.valorTotal,
          tipoEntrega: result.tipoEntrega,
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

  imprimirCanhoto(data) {
    data.isLiberado = data.isLiberado == 1 ? true : false
    data.pedidoItemForm = this.pedidoItens
    data.impressoraIp = this.user.impressoraIp
    data.impressao = true

    this.subscriptions.add(
      this.restService.put(`/pedidos/${this.id}`, data).subscribe({
        next: () => {
          this.poNotification.success({
            message: "Canhoto impresso com sucesso",
            duration: environment.poNotificationDuration,
          })
        },
        error: (error) => console.log(error),
      })
    )
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
      data.impressoraIp = this.user.impressoraIp
      data.valorTotal = this.pedidoForm.value.subTotal

      console.log(data)

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
      this.pedidoItens.push({ ...this.pedidoItemForm.value, id: uuidv4() })

      this.itensTable.push({
        id: uuidv4(),
        produtoId: this.pedidoItemForm.controls.produtoId.value,
        produto: this.produtoAtual.nome,
        quantidade: this.pedidoItemForm.controls.quantidade.value,
        preco: this.getTotalMinusDesc(this.produtoAtual.preco),
        valor: this.pedidoItemForm.controls.valor.value,
      })
      const novoTotal = this.pedidoItens.reduce((acc, item) => acc + item.valor, 0)

      this.pedidoForm.patchValue({
        subTotal: novoTotal,
        valorTotal: novoTotal - this.pedidoForm.value.desconto,
      })

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
      console.log(this.pedidoItemFormEdit.value)

      const indexItens = this.pedidoItens.findIndex((item) => item.id === this.pedidoItemFormEdit.value.id)
      // this.totalPreco -= this.getTotalMinusDesc(this.pedidoItens[indexItens].valor)
      // this.totalPreco += this.pedidoItemFormEdit.value.valor
      // this.pedidoForm.controls.valorTotal.setValue(this.totalPreco)
      this.pedidoItens.splice(indexItens, 1, { ...this.pedidoItemFormEdit.value, id: this.pedidoItemFormEdit.value.id })
      const indexTable = this.itensTable.findIndex((item) => item.id === this.pedidoItemFormEdit.value.id)
      this.itensTable.splice(indexTable, 1, {
        id: this.pedidoItemFormEdit.value.id,
        produtoId: this.pedidoItemFormEdit.controls.produtoId.value,
        produto: this.prodNameEdit,
        quantidade: this.pedidoItemFormEdit.controls.quantidade.value,
        preco: this.getTotalMinusDesc(this.produtoAtualEdit.preco),
        valor: this.pedidoItemFormEdit.controls.valor.value,
      })

      const novoTotal = this.pedidoItens.reduce((acc, item) => acc + item.valor, 0)

      this.pedidoForm.patchValue({
        subTotal: novoTotal,
        valorTotal: novoTotal - this.pedidoForm.value.desconto,
      })

      this.pedidoItemFormEdit.reset()
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
          this.descontosCliente.forEach((desconto) => {
            if (res.id === desconto.produtoId) {
              this.produtoAtual.preco -= (this.produtoAtual.preco * desconto.desconto) / 100
            }
          })

          const quantidade = +this.pedidoItemForm.controls.quantidade.value
          if (quantidade) {
            const produtoIdEspecial = "fbe43047-093b-496b-9c59-ce5c2ce66b34"
            const tipoEntrega = this.pedidoForm.controls.tipoEntrega.value
            const isProdutoEspecial = res.id === produtoIdEspecial

            const aplicarPreco = (faixas: { limite: number; preco: number }[]) => {
              const faixa = faixas.find((f) => quantidade <= f.limite) || faixas[faixas.length - 1]
              this.produtoAtual.preco = faixa.preco
            }

            if (isProdutoEspecial) {
              if (tipoEntrega === 1) {
                aplicarPreco([
                  { limite: 49, preco: 5.8 },
                  { limite: 99, preco: 5.7 },
                  { limite: Infinity, preco: 5.6 },
                ])
              } else if (tipoEntrega === 2) {
                aplicarPreco([
                  { limite: 19, preco: 6.9 },
                  { limite: 29, preco: 6.8 },
                  { limite: 49, preco: 6.5 },
                  { limite: Infinity, preco: 6.4 },
                ])
              }
            }

            this.verifyAddButton()

            const total = this.getTotalMinusDesc(this.produtoAtual.preco * quantidade)
            this.pedidoItemForm.controls.valor.setValue(total)
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

          this.descontosCliente.forEach((desconto) => {
            if (res.id === desconto.produtoId) {
              this.produtoAtualEdit.preco = this.produtoAtualEdit.preco - (this.produtoAtualEdit.preco * desconto.desconto) / 100
            }
          })

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

      const tipoEntrega = this.pedidoForm.controls.tipoEntrega.value
      const produtoIdEspecial = "fbe43047-093b-496b-9c59-ce5c2ce66b34"
      const quantidade = +event

      const aplicarPreco = (faixas: { limite: number; preco: number }[]) => {
        const faixa = faixas.find((f) => quantidade <= f.limite) || faixas[faixas.length - 1]
        this.produtoAtual.preco = faixa.preco
      }

      if (this.produtoAtual.id === produtoIdEspecial) {
        if (tipoEntrega === 1) {
          aplicarPreco([
            { limite: 49, preco: 5.8 },
            { limite: 99, preco: 5.7 },
            { limite: Infinity, preco: 5.6 },
          ])
        } else if (tipoEntrega === 2) {
          aplicarPreco([
            { limite: 19, preco: 6.9 },
            { limite: 29, preco: 6.8 },
            { limite: 49, preco: 6.5 },
            { limite: Infinity, preco: 6.4 },
          ])
        }
      }

      const total = +(this.produtoAtual.preco * quantidade).toFixed(2)
      this.pedidoItemForm.controls.valor.setValue(total)
    }
  }

  onQuantidadeChangeEdit(event) {
    if (this.produtoAtualEdit) {
      this.pedidoItemFormEdit.controls.valor.setValue(+(+this.produtoAtualEdit.preco * +event).toFixed(2))
    }
  }

  onClienteIdChange(event) {
    if (!event) return

    this.subscriptions.add(
      this.restService.get(`/clientes/${event}`).subscribe({
        next: (result: any) => {
          this.descontosCliente = result.descontos
        },
      })
    )

    this.verifyProdutos()
  }

  private deleteParameterItem(item: any) {
    const indexTable = this.itensTable.indexOf(item)
    const indexItens = this.pedidoItens.findIndex((it) => it.id === item.id)
    this.itensTable.splice(indexTable, 1)
    this.pedidoItens.splice(indexItens, 1)
    const novoTotal = this.pedidoItens.reduce((acc, item) => acc + item.valor, 0)
    this.pedidoForm.patchValue({
      subTotal: novoTotal,
      valorTotal: novoTotal - this.pedidoForm.value.desconto,
    })
  }

  private tableActionsConstructor(literals: any, tableActions: PoTableAction[]) {
    tableActions.push({ label: literals.editar, action: this.editParameterItem.bind(this), icon: "fa-solid fa-pen" })
    tableActions.push({ label: literals.excluir, action: this.deleteParameterItem.bind(this), icon: "fa-solid fa-trash" })
  }

  public getTotalMinusDesc(valor: number) {
    return valor - (valor * this.descPorcentagem) / 100
  }

  aplicarDesconto() {
    if (this.pedidoForm.valid && +this.pedidoForm.value.desconto > 0) {
      const novoTotal = +this.pedidoForm.value.subTotal - +this.pedidoForm.value.desconto
      // this.totalPreco = novoTotal
      this.pedidoForm.controls.valorTotal.setValue(novoTotal)
      this.disableDescontoButtom = true
    } else {
      this.poNotification.warning({
        message: "O desconto deve ser maior que R$ 0,00!",
        duration: environment.poNotificationDuration,
      })
    }
  }
}
