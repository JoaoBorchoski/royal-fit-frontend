import { ComponentFixture, TestBed } from "@angular/core/testing"

describe("ImportExcelModalComponent", () => {
  let component: ImportExcelModalComponent
  let fixture: ComponentFixture<ImportExcelModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportExcelModalComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ImportExcelModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
