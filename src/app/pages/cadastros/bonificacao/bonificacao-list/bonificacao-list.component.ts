import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/bonificacao-list",
  templateUrl: ".//bonificacao-list.component.html",
})
export class BonificacaoListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'cadastros', options: 'bonificacao'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'clienteNome', label: this.literals.fields.list['clienteNome'] },
          { property: 'totalVendido', label: this.literals.fields.list['totalVendido'], type: 'number' },
          { property: 'bonificacaoDisponivel', label: this.literals.fields.list['bonificacaoDisponivel'], type: 'number' }
        ]
      })
  }

}
