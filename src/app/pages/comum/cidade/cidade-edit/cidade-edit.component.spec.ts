import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CidadeEditComponent } from "./cidade-edit.component"

describe("CidadeEditComponent", () => {
  let component: CidadeEditComponent
  let fixture: ComponentFixture<CidadeEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CidadeEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CidadeEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
