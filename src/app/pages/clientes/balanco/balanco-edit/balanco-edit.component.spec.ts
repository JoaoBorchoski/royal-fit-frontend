import { ComponentFixture, TestBed } from "@angular/core/testing"

import { BalancoEditComponent } from "./balanco-edit.component"

describe("BalancoEditComponent", () => {
  let component: BalancoEditComponent
  let fixture: ComponentFixture<BalancoEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BalancoEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BalancoEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
