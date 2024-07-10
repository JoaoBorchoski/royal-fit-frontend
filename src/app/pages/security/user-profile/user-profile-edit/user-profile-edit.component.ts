import { HttpClient } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from '@angular/router'
import { PoPageAction, PoNotificationService, PoNotification } from '@po-ui/ng-components'
import { FormBuilder } from '@angular/forms'
import { Subscription } from 'rxjs'
import { environment } from "src/environments/environment"
import { RestService } from "src/app/services/rest.service"
import { LanguagesService } from 'src/app/services/languages.service'

@Component({
  selector: "app-user-profile-edit",
  templateUrl: "./user-profile-edit.component.html",
  styleUrls: ["./user-profile-edit.component.scss"],
})
export class UserProfileEditComponent implements OnInit {
  public id: string
  public readonly = false
  public result: any
  public literals: any = {}

  userProfileForm = this.formBuilder.group({
    userId: null,
    profileId: null,
  })

  public readonly serviceApi = `${environment.baseUrl}/users-profiles`
  public userIdService = `${environment.baseUrl}/users-security/select`
  public profileIdService = `${environment.baseUrl}/profiles/select`

  subscriptions = new Subscription()

  public readonly pageActions: Array<PoPageAction> = []

  constructor(
    private formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public restService: RestService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService,
    private languagesService: LanguagesService
  ) { }

  ngOnInit(): void {
    this.getLiterals()

    this.id = this.activatedRoute.snapshot.paramMap.get("id")

    this.pageButtonsBuilder(this.getPageType(this.activatedRoute.snapshot.routeConfig.path))

    if (this.id) {
      this.subscriptions.add(this.getUserProfile(this.id))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  getLiterals() {
    this.languagesService
      .getLiterals({ type: 'edit', module: 'security', options: 'userProfile'})
      .subscribe({
        next: res => this.literals = res
      })
  }

  getPageType(route: string): string {
    switch (route) {
      case 'new':
        return 'new'
      case 'new/:id':
        return 'new'
      case 'edit':
        return 'edit'
      case 'edit/:id':
        return 'edit'
      case 'view/:id':
        return 'view'
    }
  }

  pageButtonsBuilder(pageType: string): null {
    if (pageType === 'view') {
      this.readonly = true

      this.pageActions.push(
        {
          label: this.literals.return,
          action: this.goBack.bind(this),
        }
      )
      return
    }

    this.pageActions.push(
      {
        label: this.literals.save,
        action: () => this.save(this.userProfileForm.value)
      },
      {
        label: this.literals.saveAndNew,
        action: () => this.save(this.userProfileForm.value, true)
      },
      {
        label: this.literals.cancel,
        action: this.goBack.bind(this),
      }
    )

    return
  }

  getUserProfile(id: string) {
    this.restService
      .get(`/users-profiles/${id}`)
      .subscribe({
        next: (result) => {
          this.userProfileForm.patchValue({
            userId: result.userId,
            profileId: result.profileId
          })
        },
        error: (error) => console.log(error)
      })
  }

  save(data, willCreateAnother?: boolean) {
    if (this.userProfileForm.valid) {
      if (this.id && this.getPageType(this.activatedRoute.snapshot.routeConfig.path) === 'edit') {
        this.subscriptions.add(
          this.restService
            .put(`/users-profiles/${this.id}`, data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.userProfileForm.reset()
                  this.router.navigate(["users-profiles/new"])
                } else {
                  this.router.navigate(["users-profiles"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      } else {
        this.subscriptions.add(
          this.restService
            .post("/users-profiles", data)
            .subscribe({
              next: () => {
                this.poNotification.success({
                  message: this.literals.saveSuccess,
                  duration: environment.poNotificationDuration
                })

                if (willCreateAnother) {
                  this.userProfileForm.reset()
                  this.router.navigate(["users-profiles/new"])
                } else {
                  this.router.navigate(["users-profiles"])
                }
              },
              error: (error) => console.log(error),
            })
        )
      }
    } else {
      this.markAsDirty()
      this.poNotification.warning({
        message: this.literals.formError,
        duration: environment.poNotificationDuration
      })
    }
  }

  markAsDirty() {
    this.userProfileForm.controls.userId.markAsDirty()
    this.userProfileForm.controls.profileId.markAsDirty()
  }

  goBack() {
    this.router.navigate(["users-profiles"])
  }
}
