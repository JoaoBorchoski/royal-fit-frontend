import { Component, OnInit, ViewChild } from "@angular/core"
import { Router } from "@angular/router"
import { map } from "rxjs/operators"
import { CustomTableComponent, IRemovedActions } from "src/app/components/custom-table/custom-table.component"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "/balanco-list",
  templateUrl: ".//balanco-list.component.html",
})
export class BalancoListComponent implements OnInit {
  public literals: any = {}
  public initialFields = []
  @ViewChild("customTable", { static: true }) customTable: CustomTableComponent

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
    // {
    //   index: 2,
    //   pageAction: {
    //     label: "Download File",
    //     disabled: this.singleItemSelected.bind(this),
    //     action: this.downloadFile.bind(this),
    //     icon: 'fa-solid fa-download',
    //   },
    // },
  ]

  constructor(private languagesService: LanguagesService, private router: Router) {}

  ngOnInit() {
    this.getLiterals()
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
}
