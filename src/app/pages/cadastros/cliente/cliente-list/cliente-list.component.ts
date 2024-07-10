import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/cliente-list",
  templateUrl: ".//cliente-list.component.html",
})
export class ClienteListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'cadastros', options: 'cliente'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'nome', label: this.literals.fields.list['nome'] },
          { property: 'cpfCnpj', label: this.literals.fields.list['cpfCnpj'] },
          { property: 'email', label: this.literals.fields.list['email'] }
        ]
      })
  }

}
