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
  selector: "app-cliente-edit",
  templateUrl: "./cliente-edit.component.html",
  styleUrls: ["./cliente-edit.component.scss"],
})
export class ClienteEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public estadoId = ''
  public result: any
  public literals: any = {}

  clienteForm = this.formBuilder.group({
    nome: '',
    cpfCnpj: '',
    email: '',
    cep: '',
    estadoId: null,
    cidadeId: null,
    bairro: '',
    endereco: '',
    numero: 0,
    complemento: '',
    telefone: '',
    desabilitado: false,
  })

  public readonly serviceApi = `${environment.baseUrl}/clientes`
  public estadoIdService = `${environment.baseUrl}/estados/select`
  public cidadeIdService = `${environment.baseUrl}/cidades/select`

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
      this.subscriptions.add(this.getCliente(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: 'edit', module: 'cadastros', options: 'cliente'})
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
        action: () => this.save(this.clienteForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.clienteForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getCliente(id: string) {
    this.restService
      .get(`/clientes/${id}`)
      .subscribe({
        next: (result) => {
          this.estadoId = result.estadoId
          this.clienteForm.patchValue({
            nome: result.nome,
            cpfCnpj: result.cpfCnpj,
            email: result.email,
            cep: result.cep,
            estadoId: result.estadoId,
            cidadeId: result.cidadeId,
            bairro: result.bairro,
            endereco: result.endereco,
            numero: result.numero,
            complemento: result.complemento,
            telefone: result.telefone,
            desabilitado: result.desabilitado,
          })
        },
        error: (error) => console.log(error)
      })
  }

  estadoIdChange(event: string) {
    this.cidadeIdService = `${environment.baseUrl}/cidades/select?estadoId=${event}`
  }

  save(data, willCreateAnother?: boolean) {
    if (this.clienteForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/clientes/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.clienteForm.reset()
                  this.router.navigate(["clientes/new"])
                } else {
                  this.router.navigate(["clientes"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      } else {
        this.subscriptions.add(
          this.restService
            .post("/clientes", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.clienteForm.reset()
                  this.router.navigate(["clientes/new"])
                } else {
                  this.router.navigate(["clientes"])
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
    this.clienteForm.controls.nome.markAsDirty()
  }

  goBack() {
    this.router.navigate(["clientes"])
  }
}
