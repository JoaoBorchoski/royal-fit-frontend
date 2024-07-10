import { Injectable } from '@angular/core'
import { PoI18nService, PoLanguage } from '@po-ui/ng-components'
import { map } from 'rxjs/operators'

const availableLanguages: PoLanguage[] = [
  { language: 'pt', description: 'Português' },
  { language: 'en', description: 'English' },
  { language: 'es', description: 'Español' }
]

interface IGetLiterals {
  type: string
  module?: string
  options?: string
}

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  constructor(private poI18nService: PoI18nService) { }

  get getLanguages () {
    return availableLanguages
  }

  public switchLanguage = (poLanguage: PoLanguage) => {
    this.poI18nService.setLanguage(poLanguage.language)
  }  

  public getLiterals = ({ type, module, options }: IGetLiterals) => {
    if (module && options) {
      return this.poI18nService
        .getLiterals()
        .pipe(map((value) => {
          return { ...value[type], ...value[`${module}_${options}`] }
        }))
    }

    return this.poI18nService
      .getLiterals()
      .pipe(map(value => value[type]))
  }

  public getMenu = () => {
    return this.poI18nService
      .getLiterals()
      .pipe(map((value) => value['menu']))
  }
}
