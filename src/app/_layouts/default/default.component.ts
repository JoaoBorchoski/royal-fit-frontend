import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PoMenuItem, PoToolbarAction } from '@po-ui/ng-components'
import { map } from 'rxjs/operators'
import { AppFunctionService } from 'src/app/services/app-function.service'
import { AuthService } from 'src/app/services/auth.service'
import { RestService } from 'src/app/services/rest.service'
import { PermService } from 'src/app/services/perm.service'
import { LanguagesService } from 'src/app/services/languages.service'

interface ISubMenuProps {
  id: string
  icon: string
  text: string
  route: string
  permitAll: boolean
  permitCreate: boolean
  permitRestore: boolean
  permitUpdate: boolean
  permitDelete: boolean
}

interface IMenuProps {
  id: string
  icon: string
  route: string
  text: string
  subMenuOptions?: ISubMenuProps[]
}

interface IPermissions {
  isAdmin: boolean
  isSuperUser: boolean
  menus: IMenuProps[]
}

interface IPostMenuResponse {
  statusCode: number
  data: IPermissions
}

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit {
  public user: any
  public literals: any = {}
  public menus: Array<PoMenuItem> = []
  public actions: Array<PoToolbarAction> = []

  constructor(
    public appFunc: AppFunctionService,
    public router: Router,
    private authService: AuthService,
    private restService: RestService,
    private permService: PermService,
    private languagesService: LanguagesService
  ) { }

  ngOnInit(): void {
    this.getLiterals()
    
    this.user = this.authService.userValue.user

    this.restService.post('/users-security/get-menu', {}).subscribe({
      next: (response: IPostMenuResponse) => {
        this.permService.savePermissions(response.data)
        this.renderMenu(response.data.menus)
      },
      error: (error) => console.log(error)
    })
  }

  getLiterals() {
    this.languagesService
      .getMenu()
      .pipe(map(res => this.literals = res))
      .subscribe({
        next: () => {
          this.menus = [
            {
              label: this.literals.home,
              shortLabel: this.literals.home,
              icon: 'fa-solid fa-house-chimney',
              action: () => this.router.navigate(['home'])
            }
          ]

          this.actions = [
            {
              label: this.literals.profile,
              icon: "fa-solid fa-user",
              disabled: true,
              action: () => this.router.navigate(['profile'])
            },
            {
              label: this.literals.signOut,
              icon: "fa-solid fa-door-open",
              action: () => this.authService.signOut(),
            }
          ]
        }
      })
  }

  renderMenu(menuList: IMenuProps[]) {
    menuList.map(menu => {
      if (menu.route === "") {
        this.menus.push({
          label: this.literals[menu.text] ?? menu.text,
          shortLabel: this.literals[menu.text] ?? menu.text,
          icon: menu.icon,
          subItems: this.renderSubMenu(menu.subMenuOptions)
        })
      } else {
        this.menus.push({
          label: this.literals[menu.text] ?? menu.text,
          shortLabel: this.literals[menu.text] ?? menu.text,
          icon: menu.icon,
          action: () => this.router.navigate([`${menu.route}`])
        })
      }
    })
  }

  renderSubMenu(subMenuList: ISubMenuProps[]): PoMenuItem[] {
    const subMenus = []

    subMenuList.map(subMenu => {
      if (
        subMenu.permitAll ||
        subMenu.permitCreate ||
        subMenu.permitRestore ||
        subMenu.permitUpdate ||
        subMenu.permitDelete
      ) {
        subMenus.push({
          label: this.literals[subMenu.text] ?? subMenu.text,
          shortLabel: this.literals[subMenu.text] ?? subMenu.text,
          icon: subMenu.icon,
          action: () => this.router.navigate([`${subMenu.route}`])
        })
      }      
    })

    return subMenus
  }
}
