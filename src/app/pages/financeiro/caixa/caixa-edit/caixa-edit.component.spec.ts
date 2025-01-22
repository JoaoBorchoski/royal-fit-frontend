import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CaixaEditComponent } from "./caixa-edit.component"

describe("CaixaEditComponent", () => {
  let component: CaixaEditComponent
  let fixture: ComponentFixture<CaixaEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaixaEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixaEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
