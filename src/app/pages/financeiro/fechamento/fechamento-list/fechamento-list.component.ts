import { HttpClient } from "@angular/common/http"
import { Component, OnInit, ViewChild } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import {
    PoChartOptions,
    PoChartSerie,
    PoChartType,
    PoLookupColumn,
    PoModalAction,
    PoModalComponent,
    PoNotificationService,
} from "@po-ui/ng-components"
import { Subscription } from "rxjs"
import { map } from "rxjs/operators"
import { ExcelService } from "src/app/services/excel.service"
import { LanguagesService } from "src/app/services/languages.service"
import { RestService } from "src/app/services/rest.service"
import { environment } from "src/environments/environment"

@Component({
    selector: "/fechamento-list",
    templateUrl: ".//fechamento-list.component.html",
})
export class FechamentoListComponent implements OnInit {
    public literals: any = {}
    public initialFields = []
    public modalType: string = ""
    public modalTypeName: string = ""

    public produtoIdService = `${environment.baseUrl}/produtos/select-without-desabilitado`
    public clienteIdService = `${environment.baseUrl}/clientes/select`
    columnsFornecedor: Array<PoLookupColumn> = [{ property: "label", label: "Nome" }]

    participationByCountryInWorldExportsType: PoChartType = PoChartType.Line
    public categories: Array<string> = ["12 Meses", "4 Semenas", "7 Dias"]
    public options: PoChartOptions = {
        axis: {
            // minRange: -20,
            // maxRange: 100,
            gridLines: 7,
        },
    }

    @ViewChild("modal", { static: true }) modal: PoModalComponent

    public getFechamentoPrimaryAction: PoModalAction = {
        label: "Gerar Relatório",
        action: () => this.getFechamentoPersonalizado(),
    }

    public getFechamentoSecondaryAction: PoModalAction = {
        label: "Cancelar",
        action: this.closeModal.bind(this),
    }

    public participationByCountryInWorldExports: Array<PoChartSerie> = [
        // { label: 'Brazil', data: [35, 32, 25, 29, 33, 33], color: 'color-10' },
        // { label: 'Vietnam', data: [15, 17, 23, 19, 22, 18] },
        // { label: 'Colombia', data: [8, 7, 6, 9, 10, 11] },
        // { label: 'India', data: [5, 6, 5, 4, 5, 5] },
        // { label: 'Indonesia', data: [7, 6, 10, 10, 4, 6] }
    ]

    public fechamentoForm = this.formBuilder.group({
        caixa12meses: null,
        controle_despesas12meses: null,
        fechamento12meses: null,
        caixa4Semanas: null,
        controle_despesas4Semanas: null,
        fechamento4Semanas: null,
        caixa7dias: null,
        controle_despesas7dias: null,
        fechamento7dias: null,
        caixaHoje: null,
        controle_despesasHoje: null,
        fechamentoHoje: null,
    })

    public relatorioPeriodoForm = this.formBuilder.group({
        dataInicio: null,
        dataFim: null,
    })

    public relatorioProdutoForm = this.formBuilder.group({
        produtoId: null,
        dataInicio: null,
        dataFim: null,
    })

    public relatorioClienteForm = this.formBuilder.group({
        clienteId: null,
        dataInicio: null,
        dataFim: null,
    })

    constructor(
        private formBuilder: FormBuilder,
        public httpClient: HttpClient,
        public restService: RestService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private poNotification: PoNotificationService,
        private languagesService: LanguagesService,
        private excelService: ExcelService
    ) {}

    subscriptions = new Subscription()

    ngOnInit() {
        this.getLiterals()
        this.getData()
    }

    getLiterals() {
        this.languagesService
            .getLiterals({ type: "list", module: "financeiro", options: "fechamento" })
            .pipe(map((res) => (this.literals = res)))
            .subscribe({
                next: () => (this.initialFields = [{ property: "id", key: true, visible: false }]),
            })
    }

    public getData = () => {
        // console.log("getData")

        this.restService.get("/fechamentos").subscribe({
            next: (res: any) => {
                this.fechamentoForm.patchValue({
                    caixa12meses: res.ultimos_12_meses.caixa,
                    controle_despesas12meses: res.ultimos_12_meses.controle_despesas,
                    fechamento12meses: res.ultimos_12_meses.fechamento,
                    caixa4Semanas: res.ultimas_4_semanas.caixa,
                    controle_despesas4Semanas: res.ultimas_4_semanas.controle_despesas,
                    fechamento4Semanas: res.ultimas_4_semanas.fechamento,
                    caixa7dias: res.ultimos_7_dias.caixa,
                    controle_despesas7dias: res.ultimos_7_dias.controle_despesas,
                    fechamento7dias: res.ultimos_7_dias.fechamento,
                    caixaHoje: res.hoje.caixa,
                    controle_despesasHoje: res.hoje.controle_despesas,
                    fechamentoHoje: res.hoje.fechamento,
                })
            },
        })
    }

    public getFechamento(type: string) {
        let docTitle = ""

        switch (type) {
            case "ultimos_12_meses":
                docTitle = "Relatório de Fechamento dos Últimos 12 Meses"
                break
            case "ultimas_4_semanas":
                docTitle = "Relatório de Fechamento das Últimas 4 Semanas"
                break
            case "ultimos_7_dias":
                docTitle = "Relatório de Fechamento dos Últimos 7 Dias"
                break
            case "hoje":
                docTitle = "Relatório de Fechamento Diário"
                break
            default:
                break
        }

        this.restService.post("/fechamentos/relatorio", { type: type }).subscribe({
            next: (res: any) => {
                this.excelService.createDownload(res, docTitle)
                this.poNotification.success({
                    message: "Relatório gerado com sucesso",
                    duration: environment.poNotificationDuration,
                })
            },
            error: (error) => {
                console.error(error)
            },
        })
    }

    public openModal(type: string) {
        switch (type) {
            case "periodo":
                this.modalTypeName = "Fechamento por Período"
                break
            case "produto":
                this.modalTypeName = "Fechamento por Produto"
                break
            case "cliente":
                this.modalTypeName = "Fechamento por Cliente"
                break
            default:
                break
        }

        this.modalType = type
        this.modal.open()
    }

    public closeModal() {
        this.modalType = ""
        this.modalTypeName = ""
        this.modal.close()
    }

    public getFechamentoPersonalizado() {
        let docTitle = ""
        let payload = {}

        switch (this.modalType) {
            case "periodo":
                docTitle = "Relatório de Fechamento por Período"
                payload = this.relatorioPeriodoForm.value
                break
            case "produto":
                docTitle = "Relatório de Fechamento por Produto"
                payload = this.relatorioProdutoForm.value
                break
            case "cliente":
                docTitle = "Relatório de Fechamento por Cliente"
                payload = this.relatorioClienteForm.value
                break
            default:
                break
        }

        this.restService.post("/fechamentos/relatorio", { type: this.modalType, payload: payload }).subscribe({
            next: (res: any) => {
                this.excelService.createDownload(res, docTitle)
                this.poNotification.success({
                    message: "Relatório gerado com sucesso",
                    duration: environment.poNotificationDuration,
                })
            },
            error: (error) => {
                console.error(error)
            },
        })
    }
}
