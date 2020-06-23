import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Credentials, ERR_INVALID_CREDENTIALS, SessionService} from "../state/session.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    // must match signature of "Credentials"
    username: ['', Validators.required],
    password: ['', Validators.required],
    remember: true,
  })

  errorMsg = '';

  constructor(
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit(): void {

  }

  onSubmit(data: Credentials) {
    console.log('data', data);

    this.errorMsg = '';

    this.sessionService.login(data).subscribe({
      complete: () => this.router.navigate(['stats/overview']),
      error: err => {
        console.error('Can not login', err);
        if (err.reason === ERR_INVALID_CREDENTIALS) {
          this.errorMsg = 'Invalid user/password.';
        } else {
          this.errorMsg = `Unknown login error ${err.reason}`;
        }
      }
    });
  }

}
