import { PoMenuItem, PoMenuItemBadge } from "@po-ui/ng-components"

export interface CustomMenu extends PoMenuItem {
  badge?: PoMenuItemBadge
  label: string
  link?: any
  action?: () => void
  icon?: string
  shortLabel?: string
  subItems?: Array<CustomMenu>
  data?: any
}
