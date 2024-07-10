import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/relatorio-funcionario-list",
  templateUrl: ".//relatorio-funcionario-list.component.html",
})
export class RelatorioFuncionarioListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'relatorios', options: 'relatorioFuncionario'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'funcionarioNome', label: this.literals.fields.list['funcionarioNome'] },
          { property: 'dataInicio', label: this.literals.fields.list['dataInicio'] },
          { property: 'dataFim', label: this.literals.fields.list['dataFim'] }
        ]
      })
  }

}
