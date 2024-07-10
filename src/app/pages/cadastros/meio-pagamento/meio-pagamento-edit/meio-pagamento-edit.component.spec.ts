import { ComponentFixture, TestBed } from "@angular/core/testing"

import { MeioPagamentoEditComponent } from "./meio-pagamento-edit.component"

describe("MeioPagamentoEditComponent", () => {
  let component: MeioPagamentoEditComponent
  let fixture: ComponentFixture<MeioPagamentoEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeioPagamentoEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MeioPagamentoEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
