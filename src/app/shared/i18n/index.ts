import { PoI18nConfig } from "@po-ui/ng-components"

import { generalPt } from './general-pt'
import { generalEn } from './general-en'
import { generalEs } from './general-es'

export const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt',
    context: 'general',
    cache: true
  },
  contexts: {
    general: {
      'pt': generalPt,
      'en': generalEn,
      'es': generalEs
    }
  }
}
