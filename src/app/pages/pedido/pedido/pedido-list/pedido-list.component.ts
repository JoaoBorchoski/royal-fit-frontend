import { Component, OnInit, ViewChild } from "@angular/core"
import { PoModalComponent } from "@po-ui/ng-components"
import { map } from "rxjs/operators"
import { CustomTableComponent } from "src/app/components/custom-table/custom-table.component"
import { ImportExcelModalComponent } from "src/app/components/import-excel-modal-component/import-excel-modal-component"
import { LanguagesService } from "src/app/services/languages.service"
import { WebSocketService } from "src/app/services/websocket.service"
import { environment } from "src/environments/environment"
@Component({
  selector: "/pedido-list",
  templateUrl: ".//pedido-list.component.html",
})
export class PedidoListComponent implements OnInit {
  public literals: any = {}
  public initialFields = []

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent
  @ViewChild(CustomTableComponent) customTable: CustomTableComponent
  @ViewChild(ImportExcelModalComponent) modal: ImportExcelModalComponent

  public open = false
  public isHideLoading = true
  public uploadRoute = `${environment.baseUrl}/pedidos/import-excel`
  public dataInfos: any
  public downloadRoute = "/pedidos/export-excel"
  public downloadExcelFileName = "pedidosModelo"

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

  constructor(private languagesService: LanguagesService, private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.getLiterals()

    this.webSocketService.listen("novoPedido").subscribe((pedido) => {
      this.customTable.updateItems()
    })
  }

  getLiterals() {
    const widthWindow = window.innerWidth
    this.languagesService
      .getLiterals({ type: "list", module: "pedido", options: "pedido" })
      .pipe(map((res) => (this.literals = res)))
      .subscribe({
        next: () => (
          (this.customPageActions[0].pageAction.label = this.literals.fields.list["import"]),
          (this.initialFields = [
            { property: "id", key: true, visible: false },
            { property: "sequencial", label: this.literals.fields.list["sequencial"], visible: widthWindow > 768 },
            { property: "clienteNome", label: this.literals.fields.list["clienteNome"] },
            { property: "data", label: this.literals.fields.list["data"] },
            { property: "valorTotal", label: this.literals.fields.list["valorTotal"], type: "currency", format: "BRL" },
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
