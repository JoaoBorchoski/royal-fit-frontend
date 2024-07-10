import { ComponentFixture, TestBed } from "@angular/core/testing"

import { MeioPagamentoListComponent } from "./meio-pagamento-list.component"

describe("MeioPagamentoListComponent", () => {
  let component: MeioPagamentoListComponent
  let fixture: ComponentFixture<MeioPagamentoListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeioPagamentoListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MeioPagamentoListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
