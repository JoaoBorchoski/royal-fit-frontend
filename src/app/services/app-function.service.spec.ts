import { TestBed } from "@angular/core/testing"

import { AppFunctionService } from "./app-function.service"

describe("AppFunctionService", () => {
  let service: AppFunctionService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AppFunctionService)
  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })
})
