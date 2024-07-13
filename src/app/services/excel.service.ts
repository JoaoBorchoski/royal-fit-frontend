import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { RestService } from "./rest.service"

@Injectable({
  providedIn: "root",
})
export class ExcelService {
  constructor(private restService: RestService, private http: HttpClient) {}

  getExcel(url: string, filename: string) {
    console.log(url, filename)
    return this.restService.get(`${url}`).subscribe({
      next: (res: any) => this.createDownload(res, filename),
      error: (error: any) => console.error(error),
    })
  }

  getExcelWithData(url: string, filename: string, data: any) {
    console.log(url, filename, data)
    const newData = { errors: data }
    return this.restService.post(`${url}`, newData).subscribe({
      next: (res: any) => this.createDownload(res, filename),
      error: (error: any) => console.error(error),
    })
  }

  postExcel(url: string, filename: string, body: any) {
    return this.restService.post(`${url}`, body).subscribe({
      next: (res: any) => this.createDownload(res, filename),
      error: (error: any) => console.error(error),
    })
  }

  uploadExcel(url: string, file: File) {
    const formData = new FormData()
    formData.append("file", file, file.name)
    return this.restService.post(`${url}`, formData)
  }

  createDownload(res: any, filename: string) {
    const data = new Blob([this.s2ab(res)], { type: "xlsx" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(data)
    link.download = `${filename}.xlsx`
    link.click()
  }

  private s2ab(s: any) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff
    }

    return buf
  }
}
