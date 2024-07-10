import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CepEditComponent } from "./cep-edit.component"

describe("CepEditComponent", () => {
  let component: CepEditComponent
  let fixture: ComponentFixture<CepEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CepEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CepEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
