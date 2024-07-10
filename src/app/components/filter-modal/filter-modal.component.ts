import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { PoButtonGroupItem, PoModalAction, PoModalComponent, PoSelectOption } from '@po-ui/ng-components'
import { map } from 'rxjs/operators'
import { SavedFilterComponent } from './saved-filter/saved-filter.component'
import { LanguagesService } from 'src/app/services/languages.service'

export interface IFilterModalItem {
  label: string
  query: string
  type: 'varchar' | 'numeric' | 'boolean'
}

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent
  @ViewChild(SavedFilterComponent, { static: true }) savedFilter: SavedFilterComponent

  public literals: any = {}

  public modalTitle: string = 'Filtro'
  public primaryAction: PoModalAction = {
    label: 'Filter',
    action: this.applyFilter.bind(this)
  }
  public secondaryAction: PoModalAction = {
    label: 'Close',
    action: this.closeModal.bind(this)
  }

  public itemsSelect: PoSelectOption[] = []
  public selectedField: IFilterModalItem
  public operatorsSelect: PoSelectOption[] = []

  public operatorButtons: PoButtonGroupItem[] = [
    { label: '(', action: this.addValue.bind(this, '(') },
    { label: 'E', action: this.addValue.bind(this, 'AND') },
    { label: 'OU', action: this.addValue.bind(this, 'OR') },
    { label: ')', action: this.addValue.bind(this, ')') }
  ]

  @Input() filterItems: IFilterModalItem[]
  @Input() filterTable: string
  
  @Output() submitFilter = new EventEmitter<string>()

  filterForm = this.formBuilder.group({
    field: null,
    operator: null,
    value: null,
    expression: ''
  })

  constructor(private formBuilder: FormBuilder, private languagesService: LanguagesService) { }

  ngOnInit(): void {
    this.getLiterals()
    if (this.filterItems) {
      this.inputsConstructor(this.filterItems)
    }
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'list' })
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: (_) => {
          this.primaryAction.label = this.literals.filterApplyModal
          this.secondaryAction.label = this.literals.filterCloseModal

          this.operatorButtons[1].label = this.literals.filterAnd
          this.operatorButtons[2].label = this.literals.filterOr
        }
      })
  }

  // Modal Functions

  private applyFilter() {
    this.submitFilter.emit(this.filterForm.value.expression)
    this.closeModal()
  }

  public openModal() {
    this.poModal.open()
  }

  private closeModal() {
    this.resetInitialFields()
    this.clearExpression()
    this.selectedField = null
    this.poModal.close()
  }

  // Inputs Functions

  private inputsConstructor(items: IFilterModalItem[]) {
    items.map((item, index) => this.itemsSelect.push({ value: index + 1, label: item.label }))
  }

  public selectField(value: number) {
    this.selectedField = this.filterItems[value - 1]
    this.operatorsSelectConstructor(this.selectedField)
  }

  private operatorsSelectConstructor({ type }: IFilterModalItem) {
    this.operatorsSelect = []

    switch (type) {
      case 'varchar':
        this.operatorsSelect.push({ label: 'ilike', value: 'ilike' })
        this.operatorsSelect.push({ label: 'like', value: 'like' })
        this.operatorsSelect.push({ label: '=', value: '=' })
        break
      case 'numeric':
        this.operatorsSelect.push({ label: '<', value: '<' })
        this.operatorsSelect.push({ label: '=', value: '=' })
        this.operatorsSelect.push({ label: '>', value: '>' })
        break
      case 'boolean':
        this.operatorsSelect.push({ label: 'É verdadeiro', value: 'IS TRUE' })
        this.operatorsSelect.push({ label: 'É falso', value: 'IS FALSE' })
        break
    }
  }
  
  private resetInitialFields() {
    this.filterForm.patchValue({ field: null, operator: null, value: null })
    this.unmarkAsDirty()
  }

  private markAsDirty() {
    this.filterForm.controls.field.markAsDirty()
    this.filterForm.controls.operator.markAsDirty()
    this.filterForm.controls.value.markAsDirty()
  }

  private unmarkAsDirty() {
    this.filterForm.controls.field.markAsPristine()
    this.filterForm.controls.field.markAsUntouched()
    this.filterForm.controls.operator.markAsPristine()
    this.filterForm.controls.operator.markAsUntouched()
    this.filterForm.controls.value.markAsPristine()
    this.filterForm.controls.value.markAsUntouched()
  }

  // Expression Functions

  public addExpression() {
    let { field, operator, value, expression } = this.filterForm.value

    if (this.filterForm.valid) {
      const selectedField = this.filterItems[Number(field) - 1]
  
      switch (selectedField.type) {
        case 'varchar':
          expression += `${selectedField.query} ${operator} '${value}' `
          break
        case 'boolean':
          expression += `${selectedField.query} ${operator} `
          break
        default:
          expression += `${selectedField.query} ${operator} ${value} `
      }
  
      this.filterForm.patchValue({ expression })

      this.resetInitialFields()
    } else {
      this.markAsDirty()
    }    
  }

  private addValue(value: string) {
    let { expression } = this.filterForm.value

    expression += `${value} `

    this.loadExpression(expression)
  }

  public clearExpression() {
    this.loadExpression('')
  }

  public loadExpression(expression: string) {
    this.filterForm.patchValue({ expression })
  }
  
}
