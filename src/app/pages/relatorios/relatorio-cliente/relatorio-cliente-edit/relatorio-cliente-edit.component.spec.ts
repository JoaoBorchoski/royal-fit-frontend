import { ComponentFixture, TestBed } from "@angular/core/testing"

import { RelatorioClienteEditComponent } from "./relatorio-cliente-edit.component"

describe("RelatorioClienteEditComponent", () => {
  let component: RelatorioClienteEditComponent
  let fixture: ComponentFixture<RelatorioClienteEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatorioClienteEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioClienteEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
