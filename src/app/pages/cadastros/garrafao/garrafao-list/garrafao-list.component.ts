import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "/garrafao-list",
  templateUrl: ".//garrafao-list.component.html",
})
export class GarrafaoListComponent implements OnInit {
  public literals: any = {}

  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'cadastros', options: 'garrafao'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'clienteNome', label: this.literals.fields.list['clienteNome'] },
          { property: 'quantidade', label: this.literals.fields.list['quantidade'], type: 'number' }
        ]
      })
  }

}
