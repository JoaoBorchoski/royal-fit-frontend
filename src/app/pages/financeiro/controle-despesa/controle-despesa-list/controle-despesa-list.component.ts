import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
    selector: "/controle-despesa-list",
    templateUrl: ".//controle-despesa-list.component.html",
})
export class ControleDespesaListComponent implements OnInit {
    public literals: any = {}

    public initialFields = []

    constructor(private languagesService: LanguagesService) {}

    ngOnInit() {
        this.getLiterals()
    }

    getLiterals() {
        this.languagesService
            .getLiterals({ type: "list", module: "financeiro", options: "controleDespesa" })
            .pipe(map((res) => (this.literals = res)))
            .subscribe({
                next: () =>
                    (this.initialFields = [
                        { property: "id", key: true, visible: false },
                        { property: "dataVencimento", label: this.literals.fields.list["dataVencimento"], type: "date" },
                        { property: "valor", label: "Valor" },
                        { property: "descricao", label: "Descrição" },
                        { property: "status", label: "Status" },
                    ]),
            })
    }
}
