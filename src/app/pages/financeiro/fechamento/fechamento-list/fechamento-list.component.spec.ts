import { ComponentFixture, TestBed } from "@angular/core/testing"

import { FechamentoListComponent } from "./fechamento-list.component"

describe("FechamentoListComponent", () => {
  let component: FechamentoListComponent
  let fixture: ComponentFixture<FechamentoListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FechamentoListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FechamentoListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
