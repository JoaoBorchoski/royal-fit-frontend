import { Component, OnInit } from "@angular/core"
import { map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"

@Component({
  selector: "/profile-list",
  templateUrl: ".//profile-list.component.html",
})
export class ProfileListComponent implements OnInit {
  public literals: any = {}
  
  public initialFields = []

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list', module: 'security', options: 'profile'})
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.initialFields = [
          { property: "id", key: true, visible: false },
          { property: 'userGroupName', label: this.literals.fields['userGroupName'] },
          { property: 'name', label: this.literals.fields['name'] },
        ]
      })
  }
}
