import { Component, OnInit, ViewChild } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'
import { environment } from 'src/environments/environment'
import { PoInputComponent, PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components'
import { FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators'
import { PermService } from 'src/app/services/perm.service'

interface IResponse {
  avatarUrl: string
}

interface IQrCodeResponse {
  dataURL: string
}

interface HttpResponse {
  statusCode: number
  data: any
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) twoFactorModal: PoModalComponent
  @ViewChild('input0') input0: PoInputComponent
  @ViewChild('input1') input1: PoInputComponent
  @ViewChild('input2') input2: PoInputComponent
  @ViewChild('input3') input3: PoInputComponent
  @ViewChild('input4') input4: PoInputComponent
  @ViewChild('input5') input5: PoInputComponent
  public user: any
  public tfa: any
  public isActiveTFA: boolean
  public active: PoModalAction = {
    label: 'Ativar',
    action: this.twoFactorAuthenticationVerify.bind(this)
  }
  public close: PoModalAction = {
    label: 'Cancelar',
    action: this.twoFactorModalClose.bind(this)
  }
  public canChangeEmail = false

  tfaForm = this.formBuilder.group({
    code0: '',
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: ''
  })

  emailProps = this.formBuilder.group({
    service: null,
    smtpHost: null,
    smtpPort: null,
    smtpUser: null,
    smtpPass: null
  })

  subscriptions: Subscription = new Subscription()

  constructor(
    private authService: AuthService,
    private permService: PermService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private poNotificationService: PoNotificationService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.userValue
    this.isActiveTFA = this.user.user.tfa

    this.permService
      .getPermissions()
      .pipe(map(res => this.canChangeEmail = res.permitAdmin || res.permitSuperUser))
      .subscribe({
        next: () => {
          if (this.canChangeEmail) this.getEmailProps()
        }
      })
  }

  getEmailProps() {
    this.subscriptions.add(
      this.httpClient
        .post(`${environment.baseUrl}/configs/get`, { title: 'email' })
        .subscribe({
          next: (res: HttpResponse) => {
            const { description } = res.data
            this.emailProps.patchValue({
              service: description.service,
              smtpHost: description.smtpHost,
              smtpPort: description.smtpPort,
              smtpUser: description.smtpUser,
              smtpPass: description.smtpPass,
            })
          }
        })
    )
  }

  updateEmail() {
    console.log(this.emailProps.valid)
    if (this.emailProps.valid) {
      const payload = {
        title: 'email',
        description: {
          service: this.emailProps.value.service,
          smtpHost: this.emailProps.value.smtpHost,
          smtpPort: this.emailProps.value.smtpPort,
          smtpUser: this.emailProps.value.smtpUser,
          smtpPass: this.emailProps.value.smtpPass,
        },
      }

      this.subscriptions.add(
        this.httpClient
          .put(`${environment.baseUrl}/configs`, payload)
          .subscribe({
            next: (res: HttpResponse) => {
              this.poNotificationService.success({
                message: 'E-Mail alterado com sucesso!',
                duration: environment.poNotificationDuration
              })
            },
            error: (err) => {
              this.poNotificationService.warning({
                message: err,
                duration: environment.poNotificationDuration
              })
            }
          })
      )
    }
  }

  uploadAvatar(event: Event) {
    const target = event.target as HTMLInputElement
    
    if (target.files) {
      const data = new FormData()

      data.append('avatar', target.files[0])

      this.subscriptions.add(
        this.httpClient
          .patch(`${environment.baseUrl}/users/avatar`, data)
          .subscribe({
            next: (response: IResponse) => {
              this.user.user.avatar = response.avatarUrl

              this.authService.updateUser(this.user)
            },
            error: (err) => console.log(err)
          })
      )
    }
  }

  twoFactorModalOpen() {
    this.subscriptions.add(this.twoFactorAuthenticationSetup()
    )
  }

  twoFactorModalClose() {
    this.twoFactorAuthenticationDisable()
    this.tfaForm.reset()
    this.twoFactorModal.close()
  }

  modelChange(index: string) {
    if (this.tfaForm.value[`code${index}`].length === 0 && index !== '0') this[`input${Number(index) - 1}`].focus()
    if (this.tfaForm.value[`code${index}`].length === 1 && index !== '5') this[`input${Number(index) + 1}`].focus()
  }

  twoFactorAuthenticationSetup() {
    this.httpClient.post(`${environment.baseUrl}/tfa/setup`, null)
      .subscribe({
        next: (response: IQrCodeResponse) => {
          this.tfa = response
          this.twoFactorModal.open()
        },
        error: (error) => console.log(error)
      })
  }

  twoFactorAuthenticationVerify() {
    const payload = {
      code: this.tfaForm.value.code0 + 
        this.tfaForm.value.code1 +
        this.tfaForm.value.code2 +
        this.tfaForm.value.code3 +
        this.tfaForm.value.code4 +
        this.tfaForm.value.code5,
      login: this.user.user.login
    }

    this.subscriptions.add(
      this.httpClient
        .post(`${environment.baseUrl}/tfa/verify`, payload)
        .subscribe({
          next: () => {
            this.isActiveTFA = true
            this.user.user.tfa = true
            this.authService.updateUser(this.user)
            this.twoFactorModal.close()
            this.poNotificationService.success({
              message: 'Proteção de dois fatores ativada com sucesso',
              duration: environment.poNotificationDuration
            })
          }
        })
    )
  }  

  twoFactorAuthenticationDisable() {
    this.httpClient.post(`${environment.baseUrl}/tfa/disable`, null)
      .subscribe({
        next: () => {
          this.isActiveTFA = false
          this.user.user.tfa = false
          this.authService.updateUser(this.user)
        },
        error: (error) => console.log(error)
      })
  }
}
