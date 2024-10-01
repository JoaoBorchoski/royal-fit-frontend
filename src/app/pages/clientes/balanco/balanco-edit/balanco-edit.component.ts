import { HttpClient } from "@angular/common/http"
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import {
  PoDynamicFormField,
  PoPageAction,
  PoNotificationService,
  PoNotification,
  PoModalAction,
  PoModalComponent,
  PoPageDefaultComponent,
  PoLookupColumn,
} from "@po-ui/ng-components"
import { FormBuilder } from "@angular/forms"
import { Subscription } from "rxjs"
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from "src/app/services/languages.service"
import { ExcelService } from "src/app/services/excel.service"
import { AuthService } from "src/app/services/auth.service"
import { parse } from "uuid"

@Component({
  selector: "app-balanco-edit",
  templateUrl: "./balanco-edit.component.html",
  styleUrls: ["./balanco-edit.component.scss"],
})
export class BalancoEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}
  public widthWindow = window.innerWidth
  public clienteNome: string
  public isBonificado: boolean = false
  columnsFornecedor: Array<PoLookupColumn> = [{ property: "label", label: "Nome" }]
  public user: any
  @ViewChild("confirmarEntrada", { static: true }) confirmarEntrada: PoModalComponent

  tipoCasco = [
    { label: "Sim", value: 0 },
    { label: "Não", value: 1 },
  ]

  tamanhoCasco = [
    { label: "20L", value: 20 },
    { label: "10L", value: 10 },
  ]

  balancoForm = this.formBuilder.group({
    clienteId: null,
    saldoDevedor: 0,
    bonificacaoDisponivel: null,
    garrafoesDisponivel: null,
    desabilitado: false,
  })

  addPagamentoForm = this.formBuilder.group({
    clienteId: null,
    meioPagamentoId: null,
    data: new Date(),
    valor: null,
  })

  addGarrafaoForm = this.formBuilder.group({
    clienteId: null,
    quantidade: null,
    isRoyalfit: null,
    tamanhoCasco: null,
  })

  addRetiradaBonificacaoForm = this.formBuilder.group({
    clienteId: null,
    quantidade: null,
  })

  relatorioPedidoForm = this.formBuilder.group({
    clienteId: null,
    dataInicio: null,
    dataFim: null,
  })

  relatorioPagamentoForm = this.formBuilder.group({
    clienteId: null,
    dataInicio: null,
    dataFim: null,
  })

  relatorioEntradaGarrafoesForm = this.formBuilder.group({
    clienteId: null,
    dataInicio: null,
    dataFim: null,
  })

  public readonly serviceApi = `${environment.baseUrl}/balancos`
  public clienteIdService = `${environment.baseUrl}/clientes/select`
  public meioPagamentoIdService = `${environment.baseUrl}/meios-pagamento/select`

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
    private excelService: ExcelService,
    private authService: AuthService
  ) {}

  public itensTable = []

  public columnsTable = [
    { property: "id", key: true, visible: false },
    {
      property: "sequencial",
      label: "Sequencial",
      type: "string",
      width: "25%",
      visible: this.widthWindow > 768,
    },
    {
      property: "statusPagamentoId",
      label: "Pago",
      type: "string",
      width: "25%",
    },
    {
      property: "data",
      label: "Data",
      width: "25%",
    },
    {
      property: "valorTotal",
      label: "Valor Total",
      type: "currency",
      format: "BRL",
      width: "25%",
    },
  ]

  public addGarrafaoPrimaryAction: PoModalAction = {
    label: "Selecionar",
    action: this.addGarrafao.bind(this),
  }

  public addGarrafaoSecondaryAction: PoModalAction = {
    label: "Cancelar",
    action: () => {
      this.confirmarEntrada.close()
    },
  }

  ngOnInit(): void {
    this.getLiterals()
    this.user = this.authService.userValue.user

    this.id = this.activatedRoute.snapshot.paramMap.get("id")

    this.pageButtonsBuilder(this.getPageType(this.activatedRoute.snapshot.routeConfig.path))

    if (this.id) {
      this.subscriptions.add(this.getBalanco(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: "edit", module: "clientes", options: "balanco" }).subscribe({
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
    this.pageActions.push({
      label: this.literals.return,
      action: this.goBack.bind(this),
    })
    return
    // if (pageType === "view") {
    //   this.readonly = true

    //   this.pageActions.push({
    //     label: this.literals.return,
    //     action: this.goBack.bind(this),
    //   })
    //   return
    // }

    // this.pageActions.push(
    //   {
    //     label: this.literals.save,
    //     action: () => this.save(this.balancoForm.value),
    //   },
    //   {
    //     label: this.literals.saveAndNew,
    //     action: () => this.save(this.balancoForm.value, true),
    //   },
    //   {
    //     label: this.literals.cancel,
    //     action: this.goBack.bind(this),
    //   }
    // )
  }

  getBalanco(id: string) {
    this.restService.get(`/balancos/${id}`).subscribe({
      next: (result) => {
        this.isBonificado = result.isBonificado
        this.clienteNome = result.clienteNome
        this.balancoForm.patchValue({
          clienteId: result.clienteId,
          saldoDevedor: result.saldoDevedor,
          desabilitado: result.desabilitado,
          bonificacaoDisponivel: result.bonificacaodisponivel,
          garrafoesDisponivel: result.garrafoesDisponivel,
        })
        this.addPagamentoForm.patchValue({
          clienteId: result.clienteId,
        })
        this.addGarrafaoForm.patchValue({
          clienteId: result.clienteId,
        })
        this.addRetiradaBonificacaoForm.patchValue({
          clienteId: result.clienteId,
        })
        this.relatorioPedidoForm.patchValue({
          clienteId: result.clienteId,
        })
        this.relatorioPagamentoForm.patchValue({
          clienteId: result.clienteId,
        })
        this.relatorioEntradaGarrafoesForm.patchValue({
          clienteId: result.clienteId,
        })
        this.getPedidos(result.clienteId)
      },
      error: (error) => console.log(error),
    })
  }

  getPedidos(clienteId: string) {
    this.restService.get(`/pedidos/cliente/${clienteId}`).subscribe({
      next: (result) => {
        this.itensTable = result
      },
      error: (error) => console.log(error),
    })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.balancoForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === "edit") {
        this.subscriptions.add(
          this.restService.put(`/balancos/${this.id}`, data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.balancoForm.reset()
                this.router.navigate(["balancos/new"])
              } else {
                this.router.navigate(["balancos"])
              }
            },
            error: (error) => console.log(error),
          })
        )
      } else {
        this.subscriptions.add(
          this.restService.post("/balancos", data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
              })

              if (willCreateAnother) {
                this.balancoForm.reset()
                this.router.navigate(["balancos/new"])
              } else {
                this.router.navigate(["balancos"])
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
    this.balancoForm.controls.clienteId.markAsDirty()
  }

  goBack() {
    this.router.navigate(["balancos"])
  }

  public addPagamento() {
    if (this.addPagamentoForm.valid && +this.addPagamentoForm.value.valor > 0) {
      if (+this.addPagamentoForm.value.valor > +this.balancoForm.value.saldoDevedor) {
        this.poNotification.warning({
          message: "Valor do pagamento não pode ser maior que o saldo devedor",
          duration: environment.poNotificationDuration,
        })
        this.addPagamentoForm.patchValue({
          valor: null,
        })
        return
      }
      this.subscriptions.add(
        this.restService.put(`/balancos/add-valor/${this.id}`, this.addPagamentoForm.value).subscribe({
          next: () => {
            this.poNotification.success({
              message: this.literals.saveSuccess,
              duration: environment.poNotificationDuration,
            })
            this.getBalanco(this.id)
            this.addPagamentoForm.patchValue({
              valor: null,
            })
          },
          error: (error) => console.log(error),
        })
      )
    } else {
      this.poNotification.warning({
        message: "Preencha todos os campos obrigatórios / Valor inválido",
        duration: environment.poNotificationDuration,
      })
    }
  }

  public addGarrafao() {
    const data = {
      ...this.addGarrafaoForm.value,
      impressoraIp: this.user.impressoraIp,
    }
    data.isRoyalfit = data.isRoyalfit === 0 ? true : false

    console.log(data)

    this.subscriptions.add(
      this.restService.put(`/garrafoes/add-garrafao/${this.id}`, data).subscribe({
        next: (res: any) => {
          console.log(res)
          this.poNotification.success({
            message: this.literals.saveSuccess,
            duration: environment.poNotificationDuration,
          })
          this.getBalanco(this.id)
          this.addGarrafaoForm.patchValue({
            quantidade: 0,
            isRoyalfit: 0,
          })
        },
        error: (error) => console.log(error),
      })
    )

    this.confirmarEntrada.close()
  }

  public addRetiradaBonificacao() {
    if (
      this.addRetiradaBonificacaoForm.valid &&
      this.addRetiradaBonificacaoForm.value.quantidade <= this.balancoForm.value.bonificacaoDisponivel &&
      +this.addRetiradaBonificacaoForm.value.quantidade > 0
    ) {
      const data = {
        ...this.addRetiradaBonificacaoForm.value,
        impressoraIp: this.user.impressoraIp,
      }
      this.subscriptions.add(
        this.restService.put(`/bonificacoes/add-retirada/${this.id}`, data).subscribe({
          next: () => {
            this.poNotification.success({
              message: this.literals.saveSuccess,
              duration: environment.poNotificationDuration,
            })
            this.getBalanco(this.id)
            this.addRetiradaBonificacaoForm.patchValue({
              quantidade: 0,
            })
          },
          error: (error) => console.log(error),
        })
      )
    } else {
      this.addRetiradaBonificacaoForm.patchValue({
        quantidade: 0,
      })

      this.poNotification.warning({
        message: "Quantidade de bonificação indisponível ou inválida",
        duration: environment.poNotificationDuration,
      })
    }
  }

  public gerarRelatorioPedido() {
    if (this.relatorioPedidoForm.valid) {
      this.subscriptions.add(
        this.restService.post(`/pedidos/relatorio-cliente/${this.balancoForm.value.clienteId}`, this.relatorioPedidoForm.value).subscribe({
          next: (result) => {
            const datIni = this.relatorioPedidoForm.value.dataInicio.toString().split("-").reverse().join("/")
            const datFim = this.relatorioPedidoForm.value.dataFim.toString().split("-").reverse().join("/")
            this.excelService.createDownload(result, `Relatório-Pedidos-${this.clienteNome}-${datIni}-${datFim}`)
            this.poNotification.success({
              message: "Relatório gerado com sucesso",
              duration: environment.poNotificationDuration,
            })
          },
          error: (error) => console.log(error),
        })
      )
    } else {
      this.poNotification.warning({
        message: "Preencha todos os campos obrigatórios",
        duration: environment.poNotificationDuration,
      })
    }
  }

  public gerarRelatorioPagamento() {
    if (this.relatorioPagamentoForm.valid) {
      this.subscriptions.add(
        this.restService
          .post(`/pagamentos/relatorio-cliente/${this.balancoForm.value.clienteId}`, this.relatorioPagamentoForm.value)
          .subscribe({
            next: (result) => {
              const datIni = this.relatorioPagamentoForm.value.dataInicio.toString().split("-").reverse().join("/")
              const datFim = this.relatorioPagamentoForm.value.dataFim.toString().split("-").reverse().join("/")
              this.excelService.createDownload(result, `Relatório-Pagamentos-${this.clienteNome}-${datIni}-${datFim}`)
              this.poNotification.success({
                message: "Relatório gerado com sucesso",
                duration: environment.poNotificationDuration,
              })
            },
            error: (error) => console.log(error),
          })
      )
    } else {
      this.poNotification.warning({
        message: "Preencha todos os campos obrigatórios",
        duration: environment.poNotificationDuration,
      })
    }
  }

  public gerarRelatorioEntradaGarrafoes() {
    if (this.relatorioEntradaGarrafoesForm.valid) {
      this.subscriptions.add(
        this.restService
          .post(`/entradas-garrafao/relatorio-cliente/${this.balancoForm.value.clienteId}`, this.relatorioEntradaGarrafoesForm.value)
          .subscribe({
            next: (result) => {
              const datIni = this.relatorioEntradaGarrafoesForm.value.dataInicio.toString().split("-").reverse().join("/")
              const datFim = this.relatorioEntradaGarrafoesForm.value.dataFim.toString().split("-").reverse().join("/")
              this.excelService.createDownload(result, `Relatório-Entrada-Garrafões-${this.clienteNome}-${datIni}-${datFim}`)
              this.poNotification.success({
                message: "Relatório gerado com sucesso",
                duration: environment.poNotificationDuration,
              })
            },
            error: (error) => console.log(error),
          })
      )
    } else {
      this.poNotification.warning({
        message: "Preencha todos os campos obrigatórios",
        duration: environment.poNotificationDuration,
      })
    }
  }

  openModalGarrafao() {
    if (this.addGarrafaoForm.valid && +this.addGarrafaoForm.value.quantidade > 0) {
      this.confirmarEntrada.open()
    } else {
      this.poNotification.warning({
        message: "Preencha todos os campos obrigatórios",
        duration: environment.poNotificationDuration,
      })
    }
  }

  onChengeQuantidadeRetiradaBonificacao(event) {
    const valor = Math.floor(parseInt(event))

    this.addRetiradaBonificacaoForm.patchValue({
      quantidade: valor,
    })
  }
}
