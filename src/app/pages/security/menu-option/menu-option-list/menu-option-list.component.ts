import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "/menu-option-list",
  templateUrl: ".//menu-option-list.component.html",
})
export class MenuOptionListComponent implements OnInit {
  public literals: any = {}
  
  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'security', options: 'menuOption'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'moduleName', label: this.literals.fields['moduleName'] },
          { property: 'sequence', label: this.literals.fields['sequence'] },
          { property: 'label', label: this.literals.fields['label'] },
          { property: 'route', label: this.literals.fields['route'] },
        ]
      })
  }
}
