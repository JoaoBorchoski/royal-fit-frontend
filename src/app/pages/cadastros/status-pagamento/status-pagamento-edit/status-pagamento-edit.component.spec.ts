import { ComponentFixture, TestBed } from "@angular/core/testing"

import { StatusPagamentoEditComponent } from "./status-pagamento-edit.component"

describe("StatusPagamentoEditComponent", () => {
  let component: StatusPagamentoEditComponent
  let fixture: ComponentFixture<StatusPagamentoEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusPagamentoEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusPagamentoEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
