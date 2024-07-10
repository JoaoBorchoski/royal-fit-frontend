import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import {
  PoDialogService,
  PoMenuItem,
  PoNotificationService,
} from "@po-ui/ng-components"

/**
 * @description
 * Serviço de função principal do sistema.
 * @selector
 * libfnc
 */
@Injectable({
  providedIn: "root",
})
export class LibFunctionService {
  private externalService: any

  constructor(
    public poNotification: PoNotificationService,
    public poDialog: PoDialogService
  ) {}

  /**
   * @description
   * Serve para apontar um serviço fora da lib que contenha funções para executar
   * dentro do lib.
   */
  public setExternalService(srv: any): void {
    this.externalService = srv
  }

  /**
   * @description
   * Define a linguagem e grava a informação no localstorage.
   */
  public setLanguage(value: string): void {
    localStorage.setItem("language", value === "pt" ? "pt-BR" : value)
  }

  /**
   * @description
   * Retona a linguagem da aplicação definida no localstorage.
   */
  public getLanguage(): string {
    return localStorage.getItem("language") || navigator.language
  }

  /**
   * @description
   * Retorna a label a ser utilizada no sistema para componentes, interfaces, etc.
   * Adicionado o suporte a utilizar a linguagem definida no storage. Por exemplo na interface de login
   */
  public getLabel(labelbr: string, labelen: string): string {
    const language = localStorage.getItem("language") || navigator.language
    return language.includes("pt-BR") ? labelbr : labelen ? labelen : labelbr
  }

  public isJson(item) {
    item = typeof item !== "string" ? JSON.stringify(item) : item

    try {
      item = JSON.parse(item)
    } catch (e) {
      return false
    }

    if (typeof item === "object" && item !== null) {
      return true
    }

    return false
  }

  /**
   * @description
   * Função destinada a realizar filtros nas interfaces padrões
   */
  public filterByAll(label, items): any {
    const filter = label.toLowerCase().trim()

    return items.filter((item) => {
      const findByProperty = (property) => {
        return (
          (typeof item[property] === "string" &&
            item[property].toLowerCase().includes(filter)) ||
          (typeof item[property] !== "string" &&
            String(item[property]).toLowerCase().includes(filter))
        )
      }
      return Object.keys(item).some(findByProperty)
    })
  }

  /**
   * @description
   * Função destinada a realizar filtros nas interfaces padrões
   */
  public filter(filters, items) {
    Object.keys(filters).forEach((filter) => {
      items = items.filter((register) => {
        return register[filter]
          .toLocaleLowerCase()
          .includes(filters[filter].toLocaleLowerCase())
      })
    })
    return items
  }

  public openExternalLink(url): void {
    window.open(url, "_blank")
  }

  public isExternalLink(url): boolean {
    return url ? url.startsWith("http") : false
  }

  /**
   * @description
   * Função para arredondamento em javascript.
   * Melhor forma já encontrada com menos bugs que round, floor, etc.
   */
  public roundTo(value, decimal = 2) {
    return +(Math.round(parseFloat(value + "e+" + decimal)) + "e-" + decimal)
  }

  /**
   * @description
   * Função responsável para converter CustomMenu em PoMenuItem
   * Retirada a atribuição do link do objecto e atribui na ação do menu.
   * Solução realizada para passar queryParams ao menu.
   */
  public customMenuToPoMenu(
    menus: Array<any>,
    router: Router
  ): Array<PoMenuItem> {
    const poDialog = this.poDialog
    const getLabel = this.getLabel
    // Força carregar a página.
    router.routeReuseStrategy.shouldReuseRoute = () => false
    /**
     * @description
     * Função para realizar a navegação.
     */
    function goTo(link) {
      if (link) {
        router.navigate([link])
      } else {
        poDialog.alert({
          title: getLabel("Informação", "Information"),
          message: getLabel(
            "Menu sem a propriedade link definida.",
            "Menu without link property defined."
          ),
        })
      }
    }
    /**
     * @description
     * Função recursiva para realizar a conversão de submenus para PoMenuItem.
     */
    function getSubItems(subItems: Array<any>): Array<PoMenuItem> {
      const menuResult: Array<PoMenuItem> = []
      for (const menu of subItems) {
        if (menu.subItems) {
          menuResult.push({
            label: menu.label,
            subItems: getSubItems(menu.subItems),
          })
        } else {
          menuResult.push({
            label: menu.label,
            action: () => {
              sessionStorage.setItem("MENU", JSON.stringify(menu.data))
              // Correção para atribuição da informação do metadados.
              if (menu?.data?.idsystables) {
                sessionStorage.setItem(
                  "METADATA",
                  `/metadata/${menu.data.idsystables}`
                )
              } else {
                sessionStorage.removeItem("METADATA")
              }
              goTo(menu.link)
            },
            link: menu.link,
          })
        }
      }
      return menuResult
    }
    const result: Array<PoMenuItem> = []
    for (const menu of menus) {
      if (menu.subItems) {
        result.push({
          label: menu.label,
          subItems: getSubItems(menu.subItems),
        })
      } else {
        result.push({
          label: menu.label,
          action: () => {
            sessionStorage.setItem("MENU", JSON.stringify(menu.data))
            // Correção para atribuição da informação do metadados.
            if (menu?.data?.idsystables) {
              sessionStorage.setItem(
                "METADATA",
                `/metadata/${menu.data.idsystables}`
              )
            } else {
              sessionStorage.removeItem("METADATA")
            }
            goTo(menu.link)
          },
          link: menu.link,
        })
      }
    }
    return result
  }
}
