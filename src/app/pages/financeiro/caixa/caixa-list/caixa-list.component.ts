import { FormBuilder } from "@angular/forms"
import { Component, OnInit, ViewChild } from "@angular/core"
import { PoModalAction, PoModalComponent, PoNotificationService } from "@po-ui/ng-components"
import { map } from "rxjs/operators"
import { IRemovedActions } from "src/app/components/custom-table/custom-table.component"
import { LanguagesService } from "src/app/services/languages.service"
import { HttpClient } from "@angular/common/http"
import { RestService } from "src/app/services/rest.service"
import { ActivatedRoute, Router } from "@angular/router"
import { ExcelService } from "src/app/services/excel.service"
import { environment } from "src/environments/environment"
import { Subscription } from "rxjs"

@Component({
  selector: "/caixa-list",
  templateUrl: ".//caixa-list.component.html",
})
export class CaixaListComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent

  public literals: any = {}

  public initialFields = []

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

  relatorioGeralForm = this.formBuilder.group({
    dataInicio: null,
    dataFim: null,
  })

  ngOnInit() {
    this.getLiterals()
  }

  subscriptions = new Subscription()

  readonly customPageActions = [
    {
      index: 2,
      pageAction: {
        label: "Relatório",
        action: this.openModal.bind(this),
        // icon: "fa-solid fa-file-import",
      },
    },
  ]

  public removedActions: IRemovedActions = {
    new: false,
    edit: false,
    delete: true,
    view: true,
    copy: true,
    refresh: true,
  }

  public primaryAction: PoModalAction = {
    label: "Gerar Relatório",
    action: () => this.gerarRelatorioGeral(),
  }
  public secondaryAction: PoModalAction = {
    label: "Cancelar",
    action: () => {
      // this.relatorioGeralForm.reset()
      this.poModal.close()
    },
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: "list", module: "financeiro", options: "caixa" })
      .pipe(map((res) => (this.literals = res)))
      .subscribe({
        next: () =>
          (this.initialFields = [
            { property: "id", key: true, visible: false },
            { property: "data", label: this.literals.fields.list["data"], type: "date" },
            { property: "descricao", label: "Descricão" },
            { property: "valor", label: "Valor" },
          ]),
      })
  }

  public openModal() {
    this.poModal.open()
  }

  public gerarRelatorioGeral() {
    if (this.relatorioGeralForm.valid) {
      this.subscriptions.add(
        this.restService.post("/financeiro-caixas/relatorio", this.relatorioGeralForm.value).subscribe({
          next: (res: any) => {
            console.log(res)
            const datIni = this.relatorioGeralForm.value.dataInicio.toString().split("-").reverse().join("/")
            const datFim = this.relatorioGeralForm.value.dataFim.toString().split("-").reverse().join("/")
            this.excelService.createDownload(res, `Relatório-Clientes-${datIni}-${datFim}`)
            this.poNotification.success({
              message: "Relatório gerado com sucesso",
              duration: environment.poNotificationDuration,
            })
            this.poModal.close()
            this.relatorioGeralForm.reset()
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
