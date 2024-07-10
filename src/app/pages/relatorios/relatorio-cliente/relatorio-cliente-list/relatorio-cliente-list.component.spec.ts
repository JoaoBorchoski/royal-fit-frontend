import { ComponentFixture, TestBed } from "@angular/core/testing"

import { RelatorioClienteListComponent } from "./relatorio-cliente-list.component"

describe("RelatorioClienteListComponent", () => {
  let component: RelatorioClienteListComponent
  let fixture: ComponentFixture<RelatorioClienteListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatorioClienteListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioClienteListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
