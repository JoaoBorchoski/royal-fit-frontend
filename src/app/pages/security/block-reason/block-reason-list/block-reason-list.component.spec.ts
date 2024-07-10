import { ComponentFixture, TestBed } from "@angular/core/testing"

import { BlockReasonListComponent } from "./block-reason-list.component"

describe("BlockReasonListComponent", () => {
  let component: BlockReasonListComponent
  let fixture: ComponentFixture<BlockReasonListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockReasonListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockReasonListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
