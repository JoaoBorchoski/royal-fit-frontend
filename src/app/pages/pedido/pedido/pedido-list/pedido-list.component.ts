import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "/pedido-list",
  templateUrl: ".//pedido-list.component.html",
})
export class PedidoListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) {}

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: "list", module: "pedido", options: "pedido" })
      .pipe(map((res) => (this.literals = res)))
      .subscribe({
        next: () =>
          (this.initialFields = [
            { property: "id", key: true, visible: false },
            { property: "sequencial", label: this.literals.fields.list["sequencial"] },
            { property: "clienteNome", label: this.literals.fields.list["clienteNome"] },
            { property: "data", label: this.literals.fields.list["data"] },
            { property: "valorTotal", label: this.literals.fields.list["valorTotal"], type: "currency", format: "BRL" },
          ]),
      })
  }
}
