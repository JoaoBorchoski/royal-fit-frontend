import { ComponentFixture, TestBed } from "@angular/core/testing"

import { StatusPagamentoListComponent } from "./status-pagamento-list.component"

describe("StatusPagamentoListComponent", () => {
  let component: StatusPagamentoListComponent
  let fixture: ComponentFixture<StatusPagamentoListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusPagamentoListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusPagamentoListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
