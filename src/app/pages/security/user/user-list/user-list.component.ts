import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "/user-list",
  templateUrl: ".//user-list.component.html",
})
export class UserListComponent implements OnInit {
  public literals: any = {}
  
  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'security', options: 'user'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'userGroupName', label: this.literals.fields['userGroupName'] },
          { property: 'name', label: this.literals.fields['name'] },
          { property: 'login', label: this.literals.fields['login'] },
        ]
      })
  }
}
