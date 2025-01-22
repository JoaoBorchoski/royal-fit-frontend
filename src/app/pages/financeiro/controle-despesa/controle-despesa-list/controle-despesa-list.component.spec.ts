import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ControleDespesaListComponent } from "./controle-despesa-list.component"

describe("Controle DespesaListComponent", () => {
  let component: ControleDespesaListComponent
  let fixture: ComponentFixture<ControleDespesaListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControleDespesaListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleDespesaListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
