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
  selector: "app-pedido-item-edit",
  templateUrl: "./pedido-item-edit.component.html",
  styleUrls: ["./pedido-item-edit.component.scss"],
})
export class PedidoItemEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  pedidoItemForm = this.formBuilder.group({
    produtoId: null,
    pedidoId: null,
    quantidade: 0,
    desabilitado: false,
  })

  public readonly serviceApi = `${environment.baseUrl}/pedido-itens`
  public produtoIdService = `${environment.baseUrl}/produtos/select`
  public pedidoIdService = `${environment.baseUrl}/pedidos/select`

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
      this.subscriptions.add(this.getPedidoItem(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: 'edit', module: 'pedido', options: 'pedidoItem'})
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
        action: () => this.save(this.pedidoItemForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.pedidoItemForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getPedidoItem(id: string) {
    this.restService
      .get(`/pedido-itens/${id}`)
      .subscribe({
        next: (result) => {
          this.pedidoItemForm.patchValue({
            produtoId: result.produtoId,
            pedidoId: result.pedidoId,
            quantidade: result.quantidade,
            desabilitado: result.desabilitado,
          })
        },
        error: (error) => console.log(error)
      })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.pedidoItemForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/pedido-itens/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.pedidoItemForm.reset()
                  this.router.navigate(["pedido-itens/new"])
                } else {
                  this.router.navigate(["pedido-itens"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      } else {
        this.subscriptions.add(
          this.restService
            .post("/pedido-itens", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.pedidoItemForm.reset()
                  this.router.navigate(["pedido-itens/new"])
                } else {
                  this.router.navigate(["pedido-itens"])
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
    this.pedidoItemForm.controls.produtoId.markAsDirty()
    this.pedidoItemForm.controls.pedidoId.markAsDirty()
  }

  goBack() {
    this.router.navigate(["pedido-itens"])
  }
}
