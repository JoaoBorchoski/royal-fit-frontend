import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ControleDespesaEditComponent } from "./controle-despesa-edit.component"

describe("ControleDespesaEditComponent", () => {
  let component: ControleDespesaEditComponent
  let fixture: ComponentFixture<ControleDespesaEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControleDespesaEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleDespesaEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
