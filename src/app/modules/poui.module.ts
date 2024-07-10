import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { PoCodeEditorModule } from "@po-ui/ng-code-editor"
import {
  PoAccordionModule,
  PoButtonModule,
  PoContainerModule,
  PoDividerModule,
  PoDropdownModule,
  PoFieldModule,
  PoInfoModule,
  PoListViewModule,
  PoModalModule,
  PoPopoverModule,
  PoPopupModule,
  PoTableModule,
  PoTabsModule,
  PoTagModule,
  PoTooltipModule,
} from "@po-ui/ng-components"
import {
  PoPageDynamicSearchModule,
  PoTemplatesModule,
} from "@po-ui/ng-templates"

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PoTabsModule,
    PoButtonModule,
    PoTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    PoFieldModule,
    PoDividerModule,
    PoTableModule,
    PoModalModule,
    PoTagModule,
    PoPopoverModule,
    PoCodeEditorModule,
    PoTemplatesModule,
    PoAccordionModule,
    PoDropdownModule,
    PoPageDynamicSearchModule,
    PoPopupModule,
    PoListViewModule,
    PoInfoModule,
    PoContainerModule,
  ],
  exports: [],
  providers: [],
})
export class PouiModule {}
