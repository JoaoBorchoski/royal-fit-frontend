import { ComponentFixture, TestBed } from "@angular/core/testing"

import { MenuOptionEditComponent } from "./menu-option-edit.component"

describe("MenuOptionEditComponent", () => {
  let component: MenuOptionEditComponent
  let fixture: ComponentFixture<MenuOptionEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuOptionEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOptionEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
