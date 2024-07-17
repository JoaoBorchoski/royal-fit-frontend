import { HttpClient } from "@angular/common/http"
import { Component, OnInit } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { PoLookupColumn, PoNotificationService, PoPageAction } from "@po-ui/ng-components"
import { Subscription } from "rxjs"
import { map } from "rxjs/operators"
import { ExcelService } from "src/app/services/excel.service"
import { LanguagesService } from "src/app/services/languages.service"
import { RestService } from "src/app/services/rest.service"
import { environment } from "src/environments/environment"

@Component({
  selector: "/relatorio-funcionario-list",
  templateUrl: ".//relatorio-funcionario-list.component.html",
})
export class RelatorioFuncionarioListComponent implements OnInit {
  public literals: any = {}
  public initialFields = []
  public funcionarioIdService = `${environment.baseUrl}/funcionarios/select`
  public funcionarioNome: string

  relatorioFuncionarioForm = this.formBuilder.group({
    funcionarioId: null,
    dataInicio: null,
    dataFim: null,
  })

  relatorioGeralForm = this.formBuilder.group({
    dataInicio: null,
    dataFim: null,
  })

  subscriptions = new Subscription()

  constructor(
    private languagesService: LanguagesService,
    private formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public restService: RestService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService,
    private excelService: ExcelService
  ) {}

  columnsFuncionarios: Array<PoLookupColumn> = [{ property: "label", label: "Nome" }]

  ngOnInit() {
    this.getLiterals()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: "list", module: "relatorios", options: "relatorioFuncionario" })
      .pipe(map((res) => (this.literals = res)))
      .subscribe({
        next: () =>
          (this.initialFields = [
            { property: "id", key: true, visible: false },
            { property: "funcionarioNome", label: this.literals.fields.list["funcionarioNome"] },
            { property: "dataInicio", label: this.literals.fields.list["dataInicio"] },
            { property: "dataFim", label: this.literals.fields.list["dataFim"] },
          ]),
      })
  }

  public onChangeFuncionario(event) {
    this.subscriptions.add(
      this.restService.get(`/funcionarios/${event}`).subscribe({
        next: (res: any) => {
          this.funcionarioNome = res.nome
        },
      })
    )
  }

  public gerarRelatorioGeral() {
    if (this.relatorioGeralForm.valid) {
      this.subscriptions.add(
        this.restService.post("/relatorios-funcionarios", this.relatorioGeralForm.value).subscribe({
          next: (res: any) => {
            const datIni = this.relatorioGeralForm.value.dataInicio.toString().split("-").reverse().join("/")
            const datFim = this.relatorioGeralForm.value.dataFim.toString().split("-").reverse().join("/")
            this.excelService.createDownload(res, `Relatório-Funcionários-${datIni}-${datFim}`)
            this.poNotification.success({
              message: "Relatório gerado com sucesso",
              duration: environment.poNotificationDuration,
            })
          },
          error: () => {
            this.poNotification.error({
              message: this.literals.messages.error,
              duration: environment.poNotificationDuration,
            })
          },
        })
      )
    } else {
      this.poNotification.warning({
        message: "Preencha todos os campos obrigatórios",
        duration: environment.poNotificationDuration,
      })
    }
  }

  public gerarRelatorio() {
    if (this.relatorioFuncionarioForm.valid) {
      this.subscriptions.add(
        this.restService
          .post(
            `/relatorios-funcionarios/${this.relatorioFuncionarioForm.value.funcionarioId}`,
            this.relatorioFuncionarioForm.value
          )
          .subscribe({
            next: (res: any) => {
              const datIni = this.relatorioFuncionarioForm.value.dataInicio.toString().split("-").reverse().join("/")
              const datFim = this.relatorioFuncionarioForm.value.dataFim.toString().split("-").reverse().join("/")
              this.excelService.createDownload(res, `Relatório-${this.funcionarioNome}-${datIni}-${datFim}`)
              this.poNotification.success({
                message: "Relatório gerado com sucesso",
                duration: environment.poNotificationDuration,
              })
            },
            error: () => {
              this.poNotification.error({
                message: this.literals.messages.error,
                duration: environment.poNotificationDuration,
              })
            },
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
