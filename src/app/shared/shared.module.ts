import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import {
  PoDialogModule,
  PoHttpInterceptorModule,
  PoModule,
  PoPageModule,
} from "@po-ui/ng-components"
import {
  PoModalPasswordRecoveryModule,
  PoPageChangePasswordModule,
  PoPageDynamicEditModule,
  PoPageDynamicTableModule,
  PoPageLoginModule,
  PoTemplatesModule,
} from "@po-ui/ng-templates"

import { PouiModule } from "../modules/poui.module"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    PoTemplatesModule,
    PouiModule,
    PoDialogModule,
    PoPageLoginModule,
    PoHttpInterceptorModule,
    PoModalPasswordRecoveryModule,
    PoPageModule,
    PoPageChangePasswordModule,
    PoPageDynamicTableModule,
    PoPageDynamicEditModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    PoModule,
    PoTemplatesModule,
    PouiModule,
    PoDialogModule,
    PoPageLoginModule,
    PoHttpInterceptorModule,
    PoModalPasswordRecoveryModule,
    PoPageModule,
    PoPageChangePasswordModule,
    PoPageDynamicTableModule,
    PoPageDynamicEditModule,
  ],
})
export class SharedModule {}
