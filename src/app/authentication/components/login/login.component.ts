import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/p-core/services/auth.service';

@Component({
  selector: 'pencil-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authS: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authS.isLoggedIn) {
      this.router.navigateByUrl('/p-canvas');
    }
  }

  loginGoogle() {
    this.authS.GoogleAuth().then((result) => {
      console.log(result);
    });
  }
}
