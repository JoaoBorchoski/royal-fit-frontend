import { ComponentFixture, TestBed } from "@angular/core/testing"

import { RelatorioFuncionarioListComponent } from "./relatorio-funcionario-list.component"

describe("RelatorioFuncionarioListComponent", () => {
  let component: RelatorioFuncionarioListComponent
  let fixture: ComponentFixture<RelatorioFuncionarioListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatorioFuncionarioListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioFuncionarioListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
