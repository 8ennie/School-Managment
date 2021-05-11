import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;
  message: string;

  private returnUrl: string;


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transationService: TranslateService,
    private readonly messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
    if (this.authService.getUser()) {
      //Already LoggedIn
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || ['photoshow', 'monitors'];
  }

  private createLoginForm(username: string = ''): FormGroup {
    return this.formBuilder.group({
      username: [username, [this.nonBlankReuired]],
      password: ['', [this.nonBlankReuired]]
    });
  }

  private nonBlankReuired: Function = (control: FormControl): Object | null => {
    const isWhitespace: boolean = (control.value || '').trim().length === 0;
    const isValid: boolean = !isWhitespace;
    return isValid ? null : { required: true };
  }
  
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.message = null;
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const credentials = { username: this.loginForm.value.username, password: this.loginForm.value.password };
    this.authService.login(credentials).then(
      (data: any) => {
        this.messageService.add({ severity: 'success', summary: 'Successful Login', detail: 'Logged in as ' + data.username });
        this.router.navigateByUrl(this.returnUrl);
      },
      err => {
        console.log(err);
        this.message = 'login.error.login';
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: err.error?.message });
        this.loginForm = this.createLoginForm(this.loginForm.value.username);
      }
    );
  }

}
