import { ComponentFixture, TestBed } from "@angular/core/testing"

import { PedidoItemEditComponent } from "./pedido-item-edit.component"

describe("PedidoItemEditComponent", () => {
  let component: PedidoItemEditComponent
  let fixture: ComponentFixture<PedidoItemEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PedidoItemEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoItemEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
