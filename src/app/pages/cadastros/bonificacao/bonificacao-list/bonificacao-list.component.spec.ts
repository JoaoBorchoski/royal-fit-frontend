import { ComponentFixture, TestBed } from "@angular/core/testing"

import { BonificacaoListComponent } from "./bonificacao-list.component"

describe("BonificacaoListComponent", () => {
  let component: BonificacaoListComponent
  let fixture: ComponentFixture<BonificacaoListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BonificacaoListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BonificacaoListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
