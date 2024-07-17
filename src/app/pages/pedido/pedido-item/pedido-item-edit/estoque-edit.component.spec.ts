import { ComponentFixture, TestBed } from "@angular/core/testing"

import { EstoqueEditComponent } from "./estoque-edit.component"

describe("PedidoItemEditComponent", () => {
  let component: EstoqueEditComponent
  let fixture: ComponentFixture<EstoqueEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstoqueEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EstoqueEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
