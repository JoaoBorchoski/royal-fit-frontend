import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ProfileOptionEditComponent } from "./profile-option-edit.component"

describe("ProfileOptionEditComponent", () => {
  let component: ProfileOptionEditComponent
  let fixture: ComponentFixture<ProfileOptionEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileOptionEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileOptionEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
