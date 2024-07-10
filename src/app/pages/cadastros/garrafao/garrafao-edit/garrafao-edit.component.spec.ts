import { ComponentFixture, TestBed } from "@angular/core/testing"

import { GarrafaoEditComponent } from "./garrafao-edit.component"

describe("GarrafaoEditComponent", () => {
  let component: GarrafaoEditComponent
  let fixture: ComponentFixture<GarrafaoEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GarrafaoEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GarrafaoEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
