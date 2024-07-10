import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'
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

interface IPermits {
  permitAll: boolean,
  permitCreate: boolean,
  permitRestore: boolean,
  permitUpdate: boolean,
  permitDelete: boolean,
  permitAdmin: boolean,
  permitSuperUser: boolean
}

@Injectable({
  providedIn: 'root'
})
export class PermService {
  private permissions: IPermissions
  private permSubject = new Subject<IPermissions>()

  constructor() { }

  savePermissions(permissions: IPermissions) {
    this.permissions = permissions
    this.permSubject.next(this.permissions)
  }

  getPermissions(route?: string) {
    if (!this.permissions) {
      return this.permSubject
        .pipe(map((permissions) => this.permissionsConstructor(permissions, route)))
    }

    return new Observable<IPermits>((observer) => {
      const result = this.permissionsConstructor(this.permissions, route)

      observer.next(result)
      observer.complete()
    })
  }

  private permissionsConstructor (permissions: IPermissions, route?: string): IPermits {
    let pagePermissions: IPermits = {
      permitAll: false,
      permitCreate: false,
      permitRestore: false,
      permitUpdate: false,
      permitDelete: false,
      permitAdmin: false,
      permitSuperUser: false
    }
    
    if (route !== 'isAdmin' && route !== 'isSuperUser' && route) {
      let subMenu: ISubMenuProps
      permissions.menus.map(menu => {
        menu.subMenuOptions.map(subMenuOption => {
          if ('/' + route === subMenuOption.route) subMenu = subMenuOption
        })
      })
      
      if (subMenu) {
        pagePermissions.permitAll = subMenu.permitAll
        pagePermissions.permitCreate = subMenu.permitCreate
        pagePermissions.permitRestore = subMenu.permitRestore
        pagePermissions.permitUpdate = subMenu.permitUpdate
        pagePermissions.permitDelete = subMenu.permitDelete
      }  
    } else {
      if (route) {
        if (route === 'isAdmin') pagePermissions.permitAdmin = permissions.isAdmin
        if (route === 'isSuperUser') pagePermissions.permitSuperUser = permissions.isSuperUser
      } else {
        pagePermissions.permitAdmin = permissions.isAdmin
        pagePermissions.permitSuperUser = permissions.isSuperUser
      }
    }

    return pagePermissions
  }
}
