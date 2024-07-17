import { Component, OnInit, ViewChild } from "@angular/core"
import { PoModalComponent } from "@po-ui/ng-components"
import { map } from "rxjs/operators"
import { CustomTableComponent } from "src/app/components/custom-table/custom-table.component"
import { ImportExcelModalComponent } from "src/app/components/import-excel-modal-component/import-excel-modal-component"
import { LanguagesService } from "src/app/services/languages.service"
import { environment } from "src/environments/environment"

@Component({
  selector: "/estoque-list",
  templateUrl: "./estoque-list.component.html",
})
export class EstoqueListComponent implements OnInit {
  public literals: any = {}
  public initialFields = []

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent
  @ViewChild(CustomTableComponent) customTable: CustomTableComponent
  @ViewChild(ImportExcelModalComponent) modal: ImportExcelModalComponent

  public open = false
  public isHideLoading = true
  public uploadRoute = `${environment.baseUrl}/estoques/import-excel`
  public dataInfos: any
  public downloadRoute = "/estoques/export-excel"
  public downloadExcelFileName = "estoquesModelo"

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
      .getLiterals({ type: "list", module: "pedido", options: "pedidoItem" })
      .pipe(map((res) => (this.literals = res)))
      .subscribe({
        next: () => (
          (this.customPageActions[0].pageAction.label = this.literals.fields.list["import"]),
          (this.initialFields = [
            { property: "id", key: true, visible: false },
            { property: "produtoNome", label: this.literals.fields.list["produto"] },
            { property: "quantidade", label: this.literals.fields.list["quantidade"] },
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
