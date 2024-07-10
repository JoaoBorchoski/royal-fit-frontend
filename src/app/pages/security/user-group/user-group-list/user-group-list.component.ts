import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "/user-group-list",
  templateUrl: ".//user-group-list.component.html",
})
export class UserGroupListComponent implements OnInit {
  public literals: any = {}
  
  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'security', options: 'userGroup'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'name', label: this.literals.fields['name'] },
        ]
      })
  }
}
