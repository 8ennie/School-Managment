import { UserStore } from './user/user.store';
import { RoleStore } from './role/role.store';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { MessageService } from 'primeng/api';
import { from } from 'rxjs';




@Component({
  selector: 'app-auth',
  providers: [],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  return = '';

  constructor(private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.route.queryParams
      .subscribe(params => this.return = params['return']);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const credentials = { username: form.value.username, password: form.value.password };
      this.authService.login(credentials).then(
        (data: any) => {
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.messageService.add({ severity: 'success', summary: 'Successful Login', detail: 'Logged in as ' + data.username });
          if (this.return && this.return !== '') {
            this.router.navigateByUrl(this.return);
          } else {
            this.router.navigate(['photoshow', 'monitors']);
          }
        },
        err => {
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: err.error?.message });
          this.errorMessage = err.error?.message;
          form.resetForm();
          form.reset({ username: form.value.username, password: '' });
          this.isLoginFailed = true;
        }
      );
    } else {
      console.log(form.form.controls['username'].errors);
      console.log(form.form.controls['username'].invalid);

    }

  }


}
