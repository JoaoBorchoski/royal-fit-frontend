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
  selector: "app-funcionario-edit",
  templateUrl: "./funcionario-edit.component.html",
  styleUrls: ["./funcionario-edit.component.scss"],
})
export class FuncionarioEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public estadoId = ''
  public result: any
  public literals: any = {}

  funcionarioForm = this.formBuilder.group({
    nome: '',
    cpf: '',
    email: '',
    cargo: '',
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

  public readonly serviceApi = `${environment.baseUrl}/funcionarios`
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
      this.subscriptions.add(this.getFuncionario(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: 'edit', module: 'cadastros', options: 'funcionario'})
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
        action: () => this.save(this.funcionarioForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.funcionarioForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getFuncionario(id: string) {
    this.restService
      .get(`/funcionarios/${id}`)
      .subscribe({
        next: (result) => {
          this.estadoId = result.estadoId
          this.funcionarioForm.patchValue({
            nome: result.nome,
            cpf: result.cpf,
            email: result.email,
            cargo: result.cargo,
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
    if (this.funcionarioForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/funcionarios/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.funcionarioForm.reset()
                  this.router.navigate(["funcionarios/new"])
                } else {
                  this.router.navigate(["funcionarios"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      } else {
        this.subscriptions.add(
          this.restService
            .post("/funcionarios", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.funcionarioForm.reset()
                  this.router.navigate(["funcionarios/new"])
                } else {
                  this.router.navigate(["funcionarios"])
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
    this.funcionarioForm.controls.nome.markAsDirty()
  }

  goBack() {
    this.router.navigate(["funcionarios"])
  }
}
