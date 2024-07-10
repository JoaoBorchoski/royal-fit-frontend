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
  selector: "app-pedido-edit",
  templateUrl: "./pedido-edit.component.html",
  styleUrls: ["./pedido-edit.component.scss"],
})
export class PedidoEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  pedidoForm = this.formBuilder.group({
    sequencial: 0,
    clienteId: null,
    data: null,
    hora: '',
    valorTotal: 0,
    desconto: 0,
    funcionarioId: null,
    meioPagamentoId: null,
    statusPagamentoId: null,
    isPagamentoPosterior: false,
    desabilitado: false,
  })

  public readonly serviceApi = `${environment.baseUrl}/pedidos`
  public clienteIdService = `${environment.baseUrl}/clientes/select`
  public funcionarioIdService = `${environment.baseUrl}/funcionarios/select`
  public meioPagamentoIdService = `${environment.baseUrl}/status-pagamento/select`
  public statusPagamentoIdService = `${environment.baseUrl}/funcionarios/select`

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
      this.subscriptions.add(this.getPedido(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: 'edit', module: 'pedido', options: 'pedido'})
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
        action: () => this.save(this.pedidoForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.pedidoForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getPedido(id: string) {
    this.restService
      .get(`/pedidos/${id}`)
      .subscribe({
        next: (result) => {
          this.pedidoForm.patchValue({
            sequencial: result.sequencial,
            clienteId: result.clienteId,
            data: result.data ? result.data.substring(0, 10) : null,
            hora: result.hora,
            valorTotal: result.valorTotal,
            desconto: result.desconto,
            funcionarioId: result.funcionarioId,
            meioPagamentoId: result.meioPagamentoId,
            statusPagamentoId: result.statusPagamentoId,
            isPagamentoPosterior: result.isPagamentoPosterior,
            desabilitado: result.desabilitado,
          })
        },
        error: (error) => console.log(error)
      })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.pedidoForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/pedidos/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
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
          this.restService
            .post("/pedidos", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
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
        duration: environment.poNotificationDuration
      })
    }
  }

  markAsDirty() {
    this.pedidoForm.controls.sequencial.markAsDirty()
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
}
