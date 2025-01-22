import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CaixaListComponent } from "./caixa-list.component"

describe("CaixaListComponent", () => {
  let component: CaixaListComponent
  let fixture: ComponentFixture<CaixaListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaixaListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixaListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
