import { HttpClient } from "@angular/common/http"
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core"
import { PoModalComponent, PoNotificationService } from "@po-ui/ng-components"
import { Subscription, timer } from "rxjs"
import { finalize, map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"
import { environment } from "src/environments/environment"
import { v4 as uuidV4 } from "uuid"
import { ExcelService } from "src/app/services/excel.service"

@Component({
  selector: "app-import-excel-modal",
  templateUrl: "./import-excel-modal-component.html",
  styleUrls: ["./import-excel-modal-component.scss"],
})
export class ImportExcelModalComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent
  @Input() open: boolean
  @Input() title: string
  @Input() selectFileName: string
  @Input() noFileSelected: string
  @Input() download: string
  @Input() downloadInstrucao: string
  @Input() cancel: string
  @Input() import: string
  @Input() downloadRoute: string
  @Input() downloadExcelErrorRoute: string
  @Input() uploadRoute: string
  @Input() downloadExcelFileName: string
  @Input() downloadExcelErrorsFileName: string
  @Input() downloadPDFFileName: string
  @Input() viewProgressBar: boolean = false
  @Input() dataInfos: any

  @Output("import-success") importSuccess = new EventEmitter()
  @Output("result-itens") resultItens = new EventEmitter()

  public uploadUrl = `${environment.baseUrl}/import-excel`
  public progressRoute = `${environment.baseUrl}/progress-bar/get-progress`
  public literals: any = {}
  public ExcelData: any
  public selectedFileName: string
  public isLoading = false
  public uuid
  public isError = false

  timerSubscription: Subscription
  subscriptions: Subscription = new Subscription()

  constructor(
    private excelService: ExcelService,
    private httpClient: HttpClient,
    private languagesService: LanguagesService,
    private notificationService: PoNotificationService
  ) {}

  ngOnInit(): void {}

  getLiterals() {
    this.languagesService
      .getLiterals({ type: "list", module: "operation", options: "supplierProduct" })
      .pipe(map((res) => (this.literals = res)))
  }

  public openModal() {
    this.poModal.open()
  }

  public closeModal() {
    this.poModal.close()
  }

  public selectFile(event: Event): void {
    const fileInput = event.currentTarget as HTMLInputElement

    if (fileInput.files.length > 0) {
      this.selectedFileName = fileInput.files[0].name
    } else {
      this.selectedFileName = ""
    }
  }

  public subscribeTimer
  timeLeft: number = 60

  public progressPercentage: string = "0%"
  public currentProgress: number = 0

  private totalRows = null

  public startTimer(data: any) {
    const source = timer(1000, 1000)
    this.timerSubscription = source.subscribe((val) => {
      data = this.totalRows ? {} : data
      this.httpClient.post(`${this.progressRoute}?progressId=${this.uuid}`, data).subscribe((response: any) => {
        this.totalRows = response.data.total ? response.data.total : this.totalRows
        const calculatedPercentage = Math.round((response.data.progresso / this.totalRows) * 100)
        this.progressPercentage = parseFloat(calculatedPercentage.toFixed(2)) > 100 ? "99%" : calculatedPercentage + "%"
        this.currentProgress = calculatedPercentage
      })
    })
  }
  //
  public stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
  }

  public uploadFile(fileInput: HTMLInputElement): void {
    if (!fileInput.files || fileInput.files.length === 0) {
      this.notificationService.error("Selecione o arquivo a ser importado.")
      return
    }
    const data = new FormData()
    data.append("arquivos", fileInput.files[0])
    if (this.dataInfos || this.dataInfos != undefined) {
      Object.keys(this.dataInfos).forEach((key) => {
        data.append(key, this.dataInfos[key])
      })
    }
    this.isLoading = true
    if (this.viewProgressBar) this.startTimer(data)
    this.uuid = uuidV4()
    this.isError = false
    this.subscriptions.add(
      this.httpClient
        .post(`${this.uploadRoute}?progressId=${this.uuid}`, data)
        .pipe(
          finalize(() => {
            this.isLoading = false
            if (this.viewProgressBar) this.stopTimer()
          })
        )
        .subscribe(
          (response: any) => {
            if (response && !response.data.warning) {
              this.resultItens.emit(response.data)
            }
            if (!response || !response.data.warning) {
              this.notificationService.success({
                message: "Arquivo importado com sucesso.",
                duration: environment.poNotificationDuration,
              })
            }
            if (response && response.data.warning) {
              this.downloadFileErrors(response.data.errors)
            }
            if (fileInput) {
              fileInput.value = ""
            }
            this.selectedFileName = ""
            this.progressPercentage = "0%"
            this.isError = false
            this.importSuccess.emit()
            this.closeModal()
          },
          (error) => {
            this.notificationService.error({ message: "Erro ao importar o arquivo." })
            this.isError = true

            this.progressPercentage = "Erro"
          }
        )
    )
  }

  public downloadFile() {
    this.excelService.getExcel(this.downloadRoute, this.downloadExcelFileName)
  }
  public downloadFileErrors(data: any) {
    this.excelService.getExcelWithData(this.downloadExcelErrorRoute, this.downloadExcelErrorsFileName, data)
  }

  public downloadInstrucaoImport() {
    window.open(`${environment.baseUrl}/file/${this.downloadPDFFileName}.pdf`, "_blank")
  }
}
