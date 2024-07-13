import { Component, OnInit, ViewChild } from "@angular/core"
import { PoModalComponent } from "@po-ui/ng-components"
import { map } from "rxjs/operators"
import { CustomTableComponent } from "src/app/components/custom-table/custom-table.component"
import { ImportExcelModalComponent } from "src/app/components/import-excel-modal-component/import-excel-modal-component"
import { LanguagesService } from "src/app/services/languages.service"
import { environment } from "src/environments/environment"

@Component({
  selector: "/bonificacao-list",
  templateUrl: ".//bonificacao-list.component.html",
})
export class BonificacaoListComponent implements OnInit {
  public literals: any = {}
  public initialFields = []

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent
  @ViewChild(CustomTableComponent) customTable: CustomTableComponent
  @ViewChild(ImportExcelModalComponent) modal: ImportExcelModalComponent

  public open = false
  public isHideLoading = true
  public uploadRoute = `${environment.baseUrl}/bonificacoes/import-excel`
  public dataInfos: any
  public downloadRoute = "/bonificacoes/export-excel"
  public downloadExcelFileName = "bonificacoesModelo"

  readonly customPageActions = [
    {
      index: 2,
      pageAction: {
        label: "Importar",
        action: this.openModal.bind(this),
        icon: "fa-solid fa-file-import",
      },
    },
  ]

  constructor(private languagesService: LanguagesService) {}

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: "list", module: "cadastros", options: "bonificacao" })
      .pipe(map((res) => (this.literals = res)))
      .subscribe({
        next: () => (
          (this.customPageActions[0].pageAction.label = this.literals.fields.list["import"]),
          (this.initialFields = [
            { property: "id", key: true, visible: false },
            { property: "clienteNome", label: this.literals.fields.list["clienteNome"] },
            { property: "totalVendido", label: this.literals.fields.list["totalVendido"], type: "number" },
            { property: "bonificacaoDisponivel", label: this.literals.fields.list["bonificacaoDisponivel"], type: "number" },
          ])
        ),
      })
  }
  public openModal() {
    this.modal.openModal()
  }

  public importSuccess() {
    this.customTable.updateItems()
  }
}
