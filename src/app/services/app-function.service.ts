import { Injectable } from "@angular/core"
import { PoDialogService, PoNotificationService } from "@po-ui/ng-components"
import { environment } from "src/environments/environment"

import { LibFunctionService } from "./lib-function.service"
import { RestService } from "./rest.service"

@Injectable({
  providedIn: "root",
})
export class AppFunctionService {
  constructor(
    private libfnc: LibFunctionService,
    public restService: RestService,
    public poNotification: PoNotificationService,
    public poDialog: PoDialogService
  ) {
    this.libfnc.setExternalService(this)
    this.restService.setBaseUrl(environment.baseUrl)
    this.poNotification.setDefaultDuration(5000)
  }

  /**
   * @description
   * Retorna a label do service libfnc
   */
  // tslint:disable-next-line: member-ordering
  public getLabel = this.libfnc.getLabel

  /**
   * @description
   * Mapeamento da função da biblioteca para conversão do objecto CustomMenu para PoMenu
   */
  public customMenuToPoMenu = this.libfnc.customMenuToPoMenu
}
