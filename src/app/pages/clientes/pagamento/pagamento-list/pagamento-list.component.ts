import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/pagamento-list",
  templateUrl: ".//pagamento-list.component.html",
})
export class PagamentoListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'clientes', options: 'pagamento'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'clienteNome', label: this.literals.fields.list['clienteNome'] },
          { property: 'valorPago', label: this.literals.fields.list['valorPago'], type: 'number' }
        ]
      })
  }

}
