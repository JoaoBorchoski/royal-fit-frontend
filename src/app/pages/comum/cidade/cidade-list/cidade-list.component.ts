import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/cidade-list",
  templateUrl: ".//cidade-list.component.html",
})
export class CidadeListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'comum', options: 'cidade'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'estadoUf', label: this.literals.fields.list['estadoUf'] },
          { property: 'nomeCidade', label: this.literals.fields.list['nomeCidade'] }
        ]
      })
  }

}
