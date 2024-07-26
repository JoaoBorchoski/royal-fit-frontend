import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { IRemovedActions } from "src/app/components/custom-table/custom-table.component"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "/relatorio-cliente-list",
  templateUrl: ".//relatorio-cliente-list.component.html",
})
export class RelatorioClienteListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  public removedActions: IRemovedActions = {
    new: true,
    copy: true,
    // delete: true,
    view: true,
  }

  constructor(private languagesService: LanguagesService) {}

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    const widthWindow = window.innerWidth
    this.languagesService
      .getLiterals({ type: "list", module: "relatorios", options: "relatorioCliente" })
      .pipe(map((res) => (this.literals = res)))
      .subscribe({
        next: () =>
          (this.initialFields = [
            { property: "id", key: true, visible: false },
            { property: "clienteNome", label: this.literals.fields.list["clienteNome"] },
            { property: "data", label: this.literals.fields.list["data"], visible: widthWindow > 768 },
            { property: "quantidade", label: this.literals.fields.list["quantidade"] },
            {
              property: "isLiberado",
              label: this.literals.fields.list["isLiberado"],
              type: "subtitle",
              width: widthWindow > 768 ? "150px" : "100px",
              subtitles: [
                {
                  value: true,
                  color: "color-10",
                  label: "Liberado",
                  content: "LB",
                },
                {
                  value: false,
                  color: "color-07",
                  label: "Aguardando",
                  content: "AG",
                },
              ],
            },
          ]),
      })
  }
}
