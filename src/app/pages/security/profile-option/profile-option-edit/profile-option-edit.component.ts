import { Component, OnInit } from "@angular/core"
import { PoDynamicFormField } from "@po-ui/ng-components"
import { PoPageDynamicEditActions } from "@po-ui/ng-templates"
import { environment } from "src/environments/environment"

@Component({
  selector: "app-profile-option-edit",
  templateUrl: "./profile-option-edit.component.html",
  styleUrls: ["./profile-option-edit.component.scss"],
})
export class ProfileOptionEditComponent implements OnInit {
  public readonly serviceApi = `${environment.baseUrl}/profile-options`

  public readonly actions: PoPageDynamicEditActions = {
    save: "/profile-options",
    saveNew: "/profile-options",
  }

  public readonly fields: Array<PoDynamicFormField> = [
    {
      property: "profileId",
      label: "Perfil",
      optionsService: `${environment.baseUrl}/profiles/select`,
      required: true,
    },
    {
      property: "menuOptionId",
      label: "Opção de Menu",
      optionsService: `${environment.baseUrl}/menu-options/select`,
      required: true,
    },
    {
      property: "permitAll",
      label: "Todos",
      type: 'boolean'
    },
    {
      property: "permitCreate",
      label: "Incluir",
      type: 'boolean'
    },
    {
      property: "permitRestore",
      label: "Recuperar",
      type: 'boolean'
    },
    {
      property: "permitUpdate",
      label: "Alterar",
      type: 'boolean'
    },
    {
      property: "permitDelete",
      label: "Deletar",
      type: 'boolean'
    },
    {
      property: "disabled",
      label: "Inativo",
      type: 'boolean'
    },
  ]

  constructor() {}

  ngOnInit(): void {}
}
