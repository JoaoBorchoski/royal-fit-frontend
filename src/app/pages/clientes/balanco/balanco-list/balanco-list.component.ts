import { HttpClient } from "@angular/common/http"
import { Component, OnInit, ViewChild } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { PoModalAction, PoModalComponent, PoNotificationService } from "@po-ui/ng-components"
import { Subscription } from "rxjs"
import { map } from "rxjs/operators"
import { CustomTableComponent, IRemovedActions } from "src/app/components/custom-table/custom-table.component"
import { ExcelService } from "src/app/services/excel.service"
import { LanguagesService } from "src/app/services/languages.service"
import { RestService } from "src/app/services/rest.service"
import { environment } from "src/environments/environment"

@Component({
  selector: "/balanco-list",
  templateUrl: ".//balanco-list.component.html",
})
export class BalancoListComponent implements OnInit {
  public literals: any = {}
  public initialFields = []
  @ViewChild("customTable", { static: true }) customTable: CustomTableComponent
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent

  relatorioGeralForm = this.formBuilder.group({
    dataInicio: null,
    dataFim: null,
  })

  public removedActions: IRemovedActions = {
    new: true,
    edit: true,
    delete: true,
    view: true,
    copy: true,
  }

  public customPageActions = [
    {
      index: 0,
      pageAction: {
        label: "Analisar",
        disabled: this.singleItemSelected.bind(this),
        action: this.analysisItem.bind(this),
        icon: "fa-solid fa-pencil",
      },
    },
  ]

  subscriptions = new Subscription()

  public primaryAction: PoModalAction = {
    label: "Gerar Relatório",
    action: () => this.gerarRelatorioGeral(),
  }
  public secondaryAction: PoModalAction = {
    label: "Cancelar",
    action: () => {
      this.relatorioGeralForm.reset()
      this.poModal.close()
    },
  }

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

  ngOnInit() {
    this.getLiterals()

    this.customPageActions.push({
      index: 1,
      pageAction: {
        label: "Relatórios",
        disabled: false,
        action: this.openModal.bind(this),
        icon: "fa-solid fa-file",
      },
    })
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: "list", module: "clientes", options: "balanco" })
      .pipe(map((res) => (this.literals = res)))
      .subscribe({
        next: () =>
          (this.initialFields = [
            { property: "id", key: true, visible: false },
            { property: "clienteNome", label: this.literals.fields.list["clienteNome"] },
            { property: "bonificacaoDisponivel", label: this.literals.fields.list["bonificacaoDisponivel"], type: "number" },
            { property: "saldoDevedor", label: this.literals.fields.list["saldoDevedor"], type: "currency", currency: "BRL" },
          ]),
      })
  }

  private singleItemSelected(): boolean {
    return this.customTable.singleItemIsSelected()
  }

  private analysisItem(event?: any) {
    const id = event?.id ?? this.customTable.getSelectedItemsKeys()[0].id

    this.router.navigate([`balancos/edit/${id}`])
  }

  public gerarRelatorioGeral() {
    if (this.relatorioGeralForm.valid) {
      this.subscriptions.add(
        this.restService.post("/balancos/relatorio-all", this.relatorioGeralForm.value).subscribe({
          next: (res: any) => {
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  public openModal() {
    this.poModal.open()
  }
}
