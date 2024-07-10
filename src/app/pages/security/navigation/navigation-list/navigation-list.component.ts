import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "/navigation-list",
  templateUrl: ".//navigation-list.component.html",
})
export class NavigationListComponent implements OnInit {
  public literals: any = {}
  
  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'security', options: 'navigation'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'userName', label: this.literals.fields['userName'] },
          { property: 'navigationDate', label: this.literals.fields['navigationDate'] },
          { property: 'route', label: this.literals.fields['route'] },
        ]
      })
  }
}
