import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/estado-list",
  templateUrl: ".//estado-list.component.html",
})
export class EstadoListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'comum', options: 'estado'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'uf', label: this.literals.fields.list['uf'] },
          { property: 'nomeEstado', label: this.literals.fields.list['nomeEstado'] }
        ]
      })
  }

}
