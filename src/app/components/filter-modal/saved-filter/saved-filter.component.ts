import { HttpClient } from '@angular/common/http'
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { PoNotificationService, PoSelectOption } from '@po-ui/ng-components'
import { Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { LanguagesService } from 'src/app/services/languages.service'
import { environment } from 'src/environments/environment'

export interface ISavedFilter extends PoSelectOption {
  expression: string
}

interface IResponse {
  items: ISavedFilter[]
}

@Component({
  selector: 'app-saved-filter',
  templateUrl: './saved-filter.component.html',
  styleUrls: ['./saved-filter.component.scss']
})
export class SavedFilterComponent implements OnInit, OnDestroy {
  public literals: any = {}

  public savedFilters: ISavedFilter[] = []
  public newFilterName = null
  public isInputNewFilterOpened = false
  public selectedFilter: string

  @Input() expression: string
  @Input() filterTable: string
  @Input() loadExpression: Function

  @Output() applyFilter = new EventEmitter<string>()

  private subscriptions = new Subscription()

  constructor(
    private httpClient: HttpClient,
    private languagesService: LanguagesService,
    private poNotificationService: PoNotificationService
  ) { }

  ngOnInit(): void {
    this.getLiterals()
    this.loadSavedFilters()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  private getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list' })
      .pipe(map(res => this.literals = res))
      .subscribe()
  }

  public excludeFilter() {
    this.subscriptions.add(
      this.httpClient
        .delete(`${environment.baseUrl}/filters/${this.selectedFilter}`)
        .subscribe({
          next: (_) => this.excludeFilterSuccess()
        })
    )
  }

  private excludeFilterSuccess() {
    const filterToExcludeIndex = this.savedFilters.findIndex(savedFilter => savedFilter.value === this.selectedFilter)
    this.savedFilters.splice(filterToExcludeIndex, 1)
    this.selectedFilter = null

    this.poNotificationService.success({
      message: 'Filtro excluído com sucesso!',
      duration: environment.poNotificationDuration
    })
  }

  public changeInputNewFilterStatus() {
    this.isInputNewFilterOpened = !this.isInputNewFilterOpened
  }

  private loadSavedFilters() {
    this.subscriptions.add(
    this.httpClient
      .get(`${environment.baseUrl}/filters/select?table=${this.filterTable}`)
      .subscribe({
        next: ({ items }: IResponse) => this.savedFilters = items,
      })
    )
  }

  public saveFilter() {
    if (this.expression && this.newFilterName) {
      const payload = {
        name: this.newFilterName,
        expression: this.expression.slice(0, -1),
        table: this.filterTable
      }

      this.subscriptions.add(
        this.httpClient
          .post(`${environment.baseUrl}/filters`, payload)
          .subscribe({
            next: ({ data }: any) => this.saveFilterSuccess(data),
          })
      )
    } else {
      this.changeInputNewFilterStatus()
    }
  }

  private saveFilterSuccess(data: any) {
    const newFilter = {
      value: data.id,
      label: data.name,
      expression: data.expression
    }

    this.savedFilters.push(newFilter)

    this.poNotificationService.success({
      message: 'Filtro salvo com sucesso!',
      duration: environment.poNotificationDuration
    })

    this.newFilterName = null
    this.changeInputNewFilterStatus()
  }

  public loadFilter() {
    if (this.selectedFilter) {
      let { expression } = this.savedFilters.find(savedFilter => savedFilter.value === this.selectedFilter)
  
      expression += ' '
  
      this.applyFilter.emit(expression)
    }
  }

}
