import { HttpClient } from "@angular/common/http"
import { Component, OnInit } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { PoChartOptions, PoChartSerie, PoChartType, PoNotificationService } from "@po-ui/ng-components"
import { Subscription } from "rxjs"
import { map } from "rxjs/operators"
import { LanguagesService } from "src/app/services/languages.service"
import { RestService } from "src/app/services/rest.service"

@Component({
  selector: "/fechamento-list",
  templateUrl: ".//fechamento-list.component.html",
})
export class FechamentoListComponent implements OnInit {
  public literals: any = {}
  public initialFields = []

  participationByCountryInWorldExportsType: PoChartType = PoChartType.Line
  public categories: Array<string> = ["12 Meses", "4 Semenas", "7 Dias"]
  public options: PoChartOptions = {
    axis: {
      // minRange: -20,
      // maxRange: 100,
      gridLines: 7,
    },
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

  constructor(
    private formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public restService: RestService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService,
    private languagesService: LanguagesService
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
    switch (type) {
      case "12meses":
        console.log("12meses")
        break
      case "4semanas":
        console.log("4semanas")
        break
      case "7dias":
        console.log("7dias")
        break
      case "hoje":
        console.log("hoje")
        break
      default:
        break
    }
  }
}
