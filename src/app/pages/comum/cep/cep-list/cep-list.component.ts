import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/cep-list",
  templateUrl: ".//cep-list.component.html",
})
export class CepListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'comum', options: 'cep'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'codigoCep', label: this.literals.fields.list['codigoCep'] },
          { property: 'logradouro', label: this.literals.fields.list['logradouro'] },
          { property: 'bairro', label: this.literals.fields.list['bairro'] }
        ]
      })
  }

}
