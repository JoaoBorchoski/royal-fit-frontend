import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/produto-list",
  templateUrl: ".//produto-list.component.html",
})
export class ProdutoListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'cadastros', options: 'produto'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'nome', label: this.literals.fields.list['nome'] },
          { property: 'descricao', label: this.literals.fields.list['descricao'] }
        ]
      })
  }

}
