import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/balanco-list",
  templateUrl: ".//balanco-list.component.html",
})
export class BalancoListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'clientes', options: 'balanco'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'clienteNome', label: this.literals.fields.list['clienteNome'] },
          { property: 'saldoDevedor', label: this.literals.fields.list['saldoDevedor'], type: 'number' }
        ]
      })
  }

}
