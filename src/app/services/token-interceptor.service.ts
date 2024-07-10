import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { environment } from "src/environments/environment"

import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = this.authService.userValue
    const isLoggedIn = user && user.token
    const isApiUrl = req.url.startsWith(environment.baseUrl)

    if (isLoggedIn && isApiUrl) {
      req = req.clone({
        headers: req.headers.append("Authorization", `Bearer ${user.token}`),
      })
    }

    return next.handle(req)
  }
}
