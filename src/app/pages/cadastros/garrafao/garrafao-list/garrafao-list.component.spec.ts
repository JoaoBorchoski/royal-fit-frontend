import { ComponentFixture, TestBed } from "@angular/core/testing"

import { GarrafaoListComponent } from "./garrafao-list.component"

describe("GarrafaoListComponent", () => {
  let component: GarrafaoListComponent
  let fixture: ComponentFixture<GarrafaoListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GarrafaoListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GarrafaoListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
