import { ComponentFixture, TestBed } from "@angular/core/testing"

import { RelatorioFuncionarioEditComponent } from "./relatorio-funcionario-edit.component"

describe("RelatorioFuncionarioEditComponent", () => {
  let component: RelatorioFuncionarioEditComponent
  let fixture: ComponentFixture<RelatorioFuncionarioEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatorioFuncionarioEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioFuncionarioEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
