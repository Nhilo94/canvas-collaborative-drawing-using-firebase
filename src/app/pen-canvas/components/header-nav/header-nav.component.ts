import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/p-core/services/auth.service';

@Component({
  selector: 'pencil-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss'],
})
export class HeaderNavComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  logOut() {
    this.authService.SignOut();
  }
}
