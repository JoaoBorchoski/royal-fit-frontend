import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/pais-list",
  templateUrl: ".//pais-list.component.html",
})
export class PaisListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'comum', options: 'pais'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'codigoPais', label: this.literals.fields.list['codigoPais'] },
          { property: 'nomePais', label: this.literals.fields.list['nomePais'] }
        ]
      })
  }

}
