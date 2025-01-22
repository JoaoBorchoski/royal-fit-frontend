import { ComponentFixture, TestBed } from "@angular/core/testing"

import { FechamentoEditComponent } from "./fechamento-edit.component"

describe("FechamentoEditComponent", () => {
  let component: FechamentoEditComponent
  let fixture: ComponentFixture<FechamentoEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FechamentoEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FechamentoEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
