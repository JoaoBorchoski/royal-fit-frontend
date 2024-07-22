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
} from "@po-ui/ng-components"
import { FormBuilder } from "@angular/forms"
import { Subscription } from "rxjs"
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from "src/app/services/languages.service"
import { ExcelService } from "src/app/services/excel.service"

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
    private excelService: ExcelService
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

  ngOnInit(): void {
    this.getLiterals()

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
    if (this.addPagamentoForm.valid) {
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
    }
  }

  public addGarrafao() {
    if (this.addGarrafaoForm.valid) {
      this.subscriptions.add(
        this.restService.put(`/garrafoes/add-garrafao/${this.id}`, this.addGarrafaoForm.value).subscribe({
          next: () => {
            this.poNotification.success({
              message: this.literals.saveSuccess,
              duration: environment.poNotificationDuration,
            })
            this.getBalanco(this.id)
            this.addGarrafaoForm.patchValue({
              quantidade: null,
            })
          },
          error: (error) => console.log(error),
        })
      )
    }
  }

  public addRetiradaBonificacao() {
    if (this.addRetiradaBonificacaoForm.valid) {
      this.subscriptions.add(
        this.restService.put(`/bonificacoes/add-retirada/${this.id}`, this.addRetiradaBonificacaoForm.value).subscribe({
          next: () => {
            this.poNotification.success({
              message: this.literals.saveSuccess,
              duration: environment.poNotificationDuration,
            })
            this.getBalanco(this.id)
            this.addRetiradaBonificacaoForm.patchValue({
              quantidade: null,
            })
          },
          error: (error) => console.log(error),
        })
      )
    }
  }

  public gerarRelatorioPedido() {
    if (this.relatorioPedidoForm.valid) {
      this.subscriptions.add(
        this.restService
          .post(`/pedidos/relatorio-cliente/${this.balancoForm.value.clienteId}`, this.relatorioPedidoForm.value)
          .subscribe({
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
}
