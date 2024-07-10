import { ComponentFixture, TestBed } from "@angular/core/testing"

import { BonificacaoEditComponent } from "./bonificacao-edit.component"

describe("BonificacaoEditComponent", () => {
  let component: BonificacaoEditComponent
  let fixture: ComponentFixture<BonificacaoEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BonificacaoEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BonificacaoEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
