import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/relatorio-cliente-list",
  templateUrl: ".//relatorio-cliente-list.component.html",
})
export class RelatorioClienteListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'relatorios', options: 'relatorioCliente'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'clienteNome', label: this.literals.fields.list['clienteNome'] },
          { property: 'dataInicio', label: this.literals.fields.list['dataInicio'] },
          { property: 'dataFim', label: this.literals.fields.list['dataFim'] }
        ]
      })
  }

}
