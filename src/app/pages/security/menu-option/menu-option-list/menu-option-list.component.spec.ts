import { ComponentFixture, TestBed } from "@angular/core/testing"

import { MenuOptionListComponent } from "./menu-option-list.component"

describe("MenuOptionListComponent", () => {
  let component: MenuOptionListComponent
  let fixture: ComponentFixture<MenuOptionListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuOptionListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOptionListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
