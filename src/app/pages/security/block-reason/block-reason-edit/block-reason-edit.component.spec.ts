import { ComponentFixture, TestBed } from "@angular/core/testing"

import { BlockReasonEditComponent } from "./block-reason-edit.component"

describe("BlockReasonEditComponent", () => {
  let component: BlockReasonEditComponent
  let fixture: ComponentFixture<BlockReasonEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockReasonEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockReasonEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
