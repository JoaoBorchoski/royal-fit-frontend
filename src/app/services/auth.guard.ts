import { Injectable } from "@angular/core"
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router"
import { map } from "rxjs/operators"

import { AuthService } from "./auth.service"
import { PermService } from './perm.service'

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private permService: PermService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authService.userValue
    let permissions

    if (route.routeConfig.path.slice(-4) === '/new') {
      this.permService
        .getPermissions(route.routeConfig.path.slice(0, -4))
        .pipe(map(res => permissions = res))
        .subscribe({
          next: () => {
            if (!(permissions.permitAll || permissions.permitCreate)) {
              this.router.navigate(["/not-authorized"], {
                queryParams: { returnUrl: state.url },
              })
              return false
            }
          }
        })
    }

    if (route.routeConfig.path.slice(-9) === '/edit/:id') {
      this.permService
        .getPermissions(route.routeConfig.path.slice(0, -9))
        .pipe(map(res => permissions = res))
        .subscribe({
          next: () => {
            if (!(permissions.permitAll || permissions.permitUpdate)) {
              this.router.navigate(["/not-authorized"], {
                queryParams: { returnUrl: state.url },
              })
              return false
            }
          }
        })     
    }   

    if (user) {
      return true
    }

    this.router.navigate(["/login"], {
      queryParams: { returnUrl: state.url },
    })
    return false
  }
}
