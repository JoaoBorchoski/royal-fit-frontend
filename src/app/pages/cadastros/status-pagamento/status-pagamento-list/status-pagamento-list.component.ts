import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "/status-pagamento-list",
  templateUrl: ".//status-pagamento-list.component.html",
})
export class StatusPagamentoListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) {}

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: "list", module: "cadastros", options: "statusPagamento" })
      .pipe(map((res) => (this.literals = res)))
      .subscribe({
        next: () =>
          (this.initialFields = [
            { property: "id", key: true, visible: false },
            { property: "item", label: this.literals.fields.list["item"] },
            { property: "quantidade", label: this.literals.fields.list["quantidade"] },
          ]),
      })
  }
}
