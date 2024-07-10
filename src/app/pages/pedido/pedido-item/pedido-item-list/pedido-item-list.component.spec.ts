import { ComponentFixture, TestBed } from "@angular/core/testing"

import { PedidoItemListComponent } from "./pedido-item-list.component"

describe("PedidoItemListComponent", () => {
  let component: PedidoItemListComponent
  let fixture: ComponentFixture<PedidoItemListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PedidoItemListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoItemListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
