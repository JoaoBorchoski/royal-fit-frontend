import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { PoDialogService, PoNotificationService, PoPageAction, PoPageFilter, PoTableComponent } from '@po-ui/ng-components'
import { Subscription } from 'rxjs'
import { finalize, map, tap } from 'rxjs/operators'
import { FilterModalComponent } from 'src/app/components/filter-modal/filter-modal.component'
import { ISavedFilter } from 'src/app/components/filter-modal/saved-filter/saved-filter.component'
import { LanguagesService } from 'src/app/services/languages.service'
import { AuthService } from 'src/app/services/auth.service'
import { RestService } from 'src/app/services/rest.service'
import { PermService } from 'src/app/services/perm.service'
import { environment } from 'src/environments/environment'

interface ICustomPageAction {
  pageAction: PoPageAction
  index: number
}

interface ListResponse {
  items: any[]
  hasNext: boolean
}

interface ICustomParam {
  param: string
  value: string
}

interface IRoute {
  page: number
  pageSize: number
  search?: string
  filter?: string
}

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit, OnDestroy {
  @ViewChild(PoTableComponent) table: PoTableComponent
  @ViewChild(FilterModalComponent, { static: true }) filterModal: FilterModalComponent
  public literals: any = {}
  public listLiterals: any = {}
  public fields: Array<any> = []
  public items: any = []
  private permissions: any
  public pageActions: PoPageAction[] = []
  public tableActions: PoPageAction[] = []
  public listHeight: number = 0
  private hasNext: boolean = false
  private page: number = 1
  private filter: string = ''
  public initialLoading: boolean = false
  public loading: boolean = false
  public filterSettings: PoPageFilter = {
    action: this.search.bind(this),
    placeholder: '',
    width: 4
  }
  public filterExpression: string
  public savedFilters: ISavedFilter[] = []
  public filterSelected: string
  
  @Input() pageTitle: string
  @Input() route: string
  @Input() customRoute?: string
  @Input() customParams?: ICustomParam[]
  @Input() editParams?: ICustomParam[]
  @Input() pageSize: number = 50
  @Input() initialFields: any[] = []
  @Input() customPageActions?: ICustomPageAction[]
  @Input() canSeeAllActions?: boolean = false
  @Input() filterItems?: string[]

  private subscriptions = new Subscription()

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private httpClient: HttpClient,
    private permService: PermService,
    private poDialogService: PoDialogService,
    private poNotificationService: PoNotificationService,
    private restService: RestService,
    private languagesService: LanguagesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLiterals()

    this.permService
      .getPermissions(this.route + this.activatedRoute.snapshot.routeConfig.path)
      .pipe(map(res => this.permissions = res))
      .subscribe({
        next: () => {
          const routerPreferences = this.authService.routeTablePreferences(this.route + this.activatedRoute.snapshot.routeConfig.path)
          if (routerPreferences) this.fields = routerPreferences.preferences
          else this.restoreColumn()

          this.subscriptions.add(this.getData())
        }
      })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list' })
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => {
          this.filterSettings.placeholder = this.literals.search
          this.listLiterals = { otherActions: this.literals.otherActions }
        }
      })
  }

  getRoute(): string {
    return `${environment.baseUrl}/${this.customRoute ?? this.route}/list`
  }

  getPayload({ page, pageSize, search, filter }: IRoute) {
    const payload = {
      search,
      page,
      pageSize,
      filter
    }

    if (this.customParams) {
      this.customParams.map(customParam => payload[customParam.param] = customParam.value)
    }

    return payload
  }

  getData() {
    this.initialLoading = true
    this.httpClient.post(this.getRoute(), this.getPayload({ page: 1, pageSize: 50 }))
      .pipe(tap(() => this.initialLoading = false),
        finalize(() => {
          this.loading = false
          this.getActions()
          this.calculateListHeight()
        }))
      .subscribe({
        next: (response: ListResponse) => {
          this.items = response.items
          this.hasNext = response.hasNext
        },
        error: (error) => console.log(error)
      })
  }

  getActions() {
    if (this.permissions.permitAll) {
      this.pageActions = [
        { label: this.literals.new, action: this.newItem.bind(this), icon: 'fa-solid fa-plus' },
        { label: this.literals.edit, action: this.editItem.bind(this), disabled: this.singleItemIsSelected.bind(this), icon: 'fa-solid fa-pen' },
        { label: this.literals.copy, action: this.copyItem.bind(this), disabled: this.singleItemIsSelected.bind(this), icon: 'fa-solid fa-copy' },
        { label: this.literals.view, action: this.viewItem.bind(this), disabled: this.singleItemIsSelected.bind(this), icon: 'fa-solid fa-eye' },
        { label: this.literals.delete, action: this.excludeItems.bind(this), disabled: this.multipleItemIsSelected.bind(this), icon: 'fa-solid fa-trash' },
        { label: this.literals.refresh, action: this.updateItems.bind(this), icon: 'fa-solid fa-arrows-rotate' }
      ]
      this.tableActions = [
        { label: this.literals.edit, action: this.editItem.bind(this), icon: 'fa-solid fa-pen' },
        { label: this.literals.copy, action: this.copyItem.bind(this), icon: 'fa-solid fa-copy' },
        { label: this.literals.view, action: this.viewItem.bind(this), icon: 'fa-solid fa-eye' },
        { label: this.literals.delete, action: this.excludeItem.bind(this), icon: 'fa-solid fa-trash' }
      ]
    } else {
      const pageActions = []
      if (this.permissions.permitCreate) {
        pageActions.push({ label: this.literals.new, action: this.newItem.bind(this), icon: 'fa-solid fa-plus' })
        pageActions.push({ label: this.literals.copy, action: this.copyItem.bind(this), icon: 'fa-solid fa-copy' })
      }

      if (this.permissions.permitUpdate) {
        pageActions.push({ label: this.literals.edit, action: this.editItem.bind(this), disabled: this.singleItemIsSelected.bind(this), icon: 'fa-solid fa-pen' })
        this.tableActions.push({ label: this.literals.edit, action: this.editItem.bind(this), icon: 'fa-solid fa-pen' })
      }

      if (this.permissions.permitRestore) {
        pageActions.push({ label: this.literals.view, action: this.viewItem.bind(this), disabled: this.singleItemIsSelected.bind(this), icon: 'fa-solid fa-eye' })
        this.tableActions.push({ label: this.literals.view, action: this.viewItem.bind(this), icon: 'fa-solid fa-eye' })
      }

      if (this.permissions.permitDelete) {
        pageActions.push({ label: this.literals.delete, action: this.excludeItems.bind(this), disabled: this.multipleItemIsSelected.bind(this), icon: 'fa-solid fa-trash' })
        this.tableActions.push({ label: this.literals.delete, action: this.excludeItem.bind(this), icon: 'fa-solid fa-trash' })
      }

      pageActions.push({ label: this.literals.refresh, action: this.updateItems.bind(this), icon: 'fa-solid fa-arrows-rotate' })
      this.pageActions = pageActions
    }

    this.getCustomActions()
    this.getAdvancedSearch()
  }

  getCustomActions () {
    if (this.customPageActions) {
      this.customPageActions.map(({ pageAction, index }) => {
        this.pageActions.splice(index, 0, pageAction)
      })
    }
  }

  private getAdvancedSearch() {
    if (this.filterItems) this.filterSettings.advancedAction = this.openAdvancedSearchModal.bind(this)
  }


  // Funções básicas da tabela

  search(search?: string) {
    this.filter = search
    this.page = 1
    this.loading = true
    this.subscriptions.add(
      this.httpClient
        .post(this.getRoute(), this.getPayload({ page: 1, pageSize: this.pageSize, search, filter: this.filterExpression }))
        .pipe(finalize(() => {
          this.loading = false
          this.calculateListHeight()
        }))
        .subscribe({
          next: (response: ListResponse) => this.items = response.items,
          error: () => this.items = []
        })
    )
  }

  openAdvancedSearchModal() {
    this.filterModal.openModal()
  }

  getSelectedItemsKeys() {
    if (this.items.length > 0) {
      const resources = this.items.filter(item => item.$selected)

      if (resources.length === 0) {
        return
      }
      return resources
    }
  }

  singleItemIsSelected() {
    if (this.getSelectedItemsKeys()) {
      return this.getSelectedItemsKeys().length !== 1
    }
    return true
  }

  multipleItemIsSelected() {
    return !this.getSelectedItemsKeys()
  }

  clickDisclaimers(event) {
    this.filter = ''
    if (event.length === 0) this.search('')
  }

  newItem() {
    this.router.navigate([`${this.route}/new`])
  }

  copyItem(item: any) {
    if (item.id) this.router.navigate([`${this.route}/new/${item.id}`])
    else this.router.navigate([`${this.route}/new/${this.getSelectedItemsKeys()[0].id}`])
  }

  editItem(item: any) {
    if (item) this.router.navigate([`${this.route}/edit/${item.id}`])
    else this.router.navigate([`${this.route}/edit/${this.getSelectedItemsKeys()[0].id}`])
  }

  viewItem(item: any) {
    if (item.id) this.router.navigate([`${this.route}/view/${item.id}`])
    else this.router.navigate([`${this.route}/view/${this.getSelectedItemsKeys()[0].id}`])
  }

  excludeItem(item: any) {
    this.poDialogService.confirm({
      title: this.literals.confirmExcludeTitle,
      message: this.literals.confirmExcludeMessage,
      confirm: this.removeItem.bind(this, item)
    })
  }

  excludeItems() {
    const ids = this.getSelectedItemsKeys().map(item => item.id)

    if (ids.length > 0) {
      this.poDialogService.confirm({
        title: this.literals.confirmMultiExcludeTitle,
        message: this.literals.confirmMultiExcludeMessage,
        confirm: this.removeItems.bind(this, ids)
      })
    }
  }

  removeItem(item: any) {
    this.subscriptions.add(this.httpClient.delete(`${environment.baseUrl}/${this.customRoute ?? this.route}/${item.id}`)
        .subscribe({
          next: (response: ListResponse) => {
            this.poNotificationService.success({
              message: this.literals.excludeSuccess,
              duration: environment.poNotificationDuration
            })
            this.items = response.items
          }
        })
    )
  }

  removeItems(ids: any[]) {
    this.subscriptions.add(this.restService.deleteAll(`/${this.customRoute ?? this.route}`, ids)
        .subscribe({
          next: (response: ListResponse) => {
            this.poNotificationService.success({
              message: this.literals.multiExcludeSuccess,
              duration: environment.poNotificationDuration
            })
            this.items = response.items
          }
        })
    )
  }

  updateItems() {
    this.page = 1
    this.filterExpression = null
    this.filterSelected = null
    this.getData()
  }

  showMoreItems() {
    if (this.hasNext) {
      this.loading = true
      this.subscriptions.add(this.httpClient.post(this.getRoute(), this.getPayload({ page: this.page += 1, pageSize: this.pageSize, search: this.filter, filter: this.filterExpression }))
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: (response: ListResponse) => {
              this.items = this.items.concat(response.items)
              this.hasNext = response.hasNext
            },
            error: () => this.items = []
          })
      )
    }
  }

  changeVisibleColumns() {
    this.authService.browseTablePreferences(this.activatedRoute.snapshot.routeConfig.path, this.table.columns)
  }

  submitFilter(expression: string) {
    this.filterExpression = expression === '' ? null : expression
    this.search()
  }

  changeFilter(filterId: string) {
    const filter = this.filterModal.savedFilter.savedFilters.find(savedFilter => savedFilter.value === filterId)
    this.submitFilter(filter.expression)
  }

  removeFilterExpression() {
    this.filterExpression = null
    this.filterSelected = null
    this.search()
  }

  restoreColumn() {
    this.fields = this.initialFields
  }

  private get hasSubtitle(): boolean {
    return this.initialFields.some(initialField => initialField.type === 'subtitle')
  }

  calculateListHeight() {
    const headerHeight = window.innerWidth > 1366 ? 48 : 40
    const headerPageHeight = window.innerWidth > 1366 ? 132.45 : 106.55
    const paddings = 32
    const filter = 84
    const subtitleLength = window.innerWidth > 1366 ? 42 : 30
    const subtitle = this.hasSubtitle ? subtitleLength : 0

    let reduceHeight = headerHeight + headerPageHeight + paddings + subtitle

    if (this.filterItems) reduceHeight += filter

    this.listHeight = window.innerHeight - reduceHeight
  }

  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.calculateListHeight()
  }
}
