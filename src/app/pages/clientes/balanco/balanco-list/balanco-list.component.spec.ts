import { ComponentFixture, TestBed } from "@angular/core/testing"

import { BalancoListComponent } from "./balanco-list.component"

describe("BalancoListComponent", () => {
  let component: BalancoListComponent
  let fixture: ComponentFixture<BalancoListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BalancoListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BalancoListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
