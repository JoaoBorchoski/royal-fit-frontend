import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { AuthService } from "src/app/services/auth.service"

interface Props {
  id: string
  newPassword: string
}

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  public id: string

  constructor(public route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params.id
    })
  }

  onSubmit(event: Props) {
    event.newPassword = btoa(event.newPassword)
    event.id = this.id

    this.authService.resetPassword(event)
    this.router.navigate(['login'])
  }
}
