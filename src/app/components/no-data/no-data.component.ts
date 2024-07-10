import { Component, Input, OnInit } from '@angular/core'
import { map } from 'rxjs/operators'
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {
  public literals: any = {}

  @Input() label: string = 'Sem dados'

  constructor(private languagesService: LanguagesService,) { }

  ngOnInit(): void {
    this.getLiterals()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list' })
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => this.label = this.literals.noData
      })
  }
}
