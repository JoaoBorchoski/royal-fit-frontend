import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ProfileOptionListComponent } from "./profile-option-list.component"

describe("ProfileOptionListComponent", () => {
  let component: ProfileOptionListComponent
  let fixture: ComponentFixture<ProfileOptionListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileOptionListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileOptionListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
