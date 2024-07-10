import { ComponentFixture, TestBed } from "@angular/core/testing"

import { PagamentoEditComponent } from "./pagamento-edit.component"

describe("PagamentoEditComponent", () => {
  let component: PagamentoEditComponent
  let fixture: ComponentFixture<PagamentoEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagamentoEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PagamentoEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
