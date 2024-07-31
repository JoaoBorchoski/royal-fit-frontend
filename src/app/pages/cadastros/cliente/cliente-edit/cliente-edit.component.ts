import { HttpClient } from "@angular/common/http"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { PoDynamicFormField, PoPageAction, PoNotificationService, PoNotification, PoComboOption } from "@po-ui/ng-components"
import { FormBuilder } from "@angular/forms"
import { Subscription } from "rxjs"
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from "src/app/services/languages.service"
import { finalize } from "rxjs/operators"
import { validarCnpj } from "../../../../utils/validar-cnpj"

interface IResponseCorreiosAPI {
  bairro: string
  cep: string
  complemento: string
  ddd: string
  erro?: string
  gia: string
  ibge: string
  cidadeNomeCidade: string
  logradouro: string
  siafi: string
  estadoUf: string
}

interface INameCidadeSelectResponse {
  estadoId: string
  cidadeId: string
}

@Component({
  selector: "app-cliente-edit",
  templateUrl: "./cliente-edit.component.html",
  styleUrls: ["./cliente-edit.component.scss"],
})
export class ClienteEditComponent implements OnInit, OnDestroy {
  public id: string
  public readonly = false
  public estadoId = ""
  public result: any
  public literals: any = {}
  public CnpjMask = "99.999.999/9999-99"

  clienteForm = this.formBuilder.group({
    nome: "",
    cpfCnpj: "",
    email: "",
    cep: "",
    isBonificado: false,
    desconto: null,
    estadoId: null,
    cidadeId: null,
    bairro: "",
    endereco: "",
    numero: 0,
    complemento: "",
    telefone: "",
    desabilitado: false,
  })

  public cepErrorNotification: PoNotification = {
    message: "CEP inválido",
    duration: environment.poNotificationDuration,
  }

  public readonly serviceApi = `${environment.baseUrl}/clientes`
  public estadoIdService = `${environment.baseUrl}/estados/select`
  public cidadeIdService = `${environment.baseUrl}/cidades/select`

  public cidadesList: Array<PoComboOption> = []
  public estadosList: Array<PoComboOption> = []

  subscriptions = new Subscription()

  public bonificado = [
    { value: true, label: "Sim" },
    { value: false, label: "Não" },
  ]

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
      this.subscriptions.add(this.getCliente(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService.getLiterals({ type: "edit", module: "cadastros", options: "cliente" }).subscribe({
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
        action: () => this.save(this.clienteForm.value),
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.clienteForm.value, true),
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getCliente(id: string) {
    this.restService.get(`/clientes/${id}`).subscribe({
      next: (result) => {
        this.estadoId = result.estadoId
        this.clienteForm.patchValue({
          nome: result.nome,
          cpfCnpj: result.cpfCnpj,
          email: result.email,
          isBonificado: result.isBonificado,
          desconto: result.desconto,
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
      error: (error) => console.log(error),
    })
  }

  estadoIdChange(event: string) {
    this.cidadeIdService = `${environment.baseUrl}/cidades/select?estadoId=${event}`
  }

  save(data, willCreateAnother?: boolean) {
    if (this.clienteForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === "edit") {
        this.subscriptions.add(
          this.restService.put(`/clientes/${this.id}`, data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
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
          this.restService.post("/clientes", data).subscribe({
            next: () => {
              this.poNotification.success({
                message: this.literals.saveSuccess,
                duration: environment.poNotificationDuration,
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
        duration: environment.poNotificationDuration,
      })
    }
  }

  markAsDirty() {
    this.clienteForm.controls.nome.markAsDirty()
  }

  goBack() {
    this.router.navigate(["clientes"])
  }

  onCepChange(event: string) {
    // this.loading = true
    const cep = event.replace("-", "")

    if (cep.length === 8) {
      this.subscriptions.add(
        this.httpClient
          .get(`${environment.baseUrl}/ceps/by-cep/${cep}`)
          // .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: (response: IResponseCorreiosAPI) => {
              if (response) {
                this.clienteForm.patchValue({
                  endereco: response.logradouro,
                  bairro: response.bairro,
                })

                this.subscriptions.add(
                  this.httpClient.get(`${environment.baseUrl}/cidades/select-name?name=${response.cidadeNomeCidade}`).subscribe({
                    next: (ids: INameCidadeSelectResponse) => {
                      this.cidadesList = [{ value: ids.cidadeId, label: response.cidadeNomeCidade }]
                      this.clienteForm.patchValue({
                        cidadeId: ids.cidadeId,
                        estadoId: ids.estadoId,
                      })
                    },
                  })
                )
              } else {
                this.poNotification.warning(this.cepErrorNotification)
              }
            },
            error: () => {
              this.poNotification.warning({
                message: "Algo inesperado aconteceu!",
                duration: environment.poNotificationDuration,
              })
            },
          })
      )
    } else {
      if (cep.length !== 0) {
        this.poNotification.warning(this.cepErrorNotification)
      }
    }
    // this.loading = false
  }

  cnpjChange(cpfCnpj: string) {
    const newCpfCnpj = cpfCnpj.replace(/[^\d]+/g, "")

    this.CnpjMask = newCpfCnpj.length > 11 ? "99.999.999/9999-99" : ""

    const cnpj = newCpfCnpj.length === 14
    const isValid = cnpj ? validarCnpj(cpfCnpj) : null

    if (isValid) return true

    this.clienteForm.controls.cpfCnpj.setErrors({
      error: "CNPJ Inválido!",
    })
  }
}
