import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/p-core/services/auth.service';

@Component({
  selector: 'pencil-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss'],
})
export class HeaderNavComponent implements OnInit {
  currentUser: any;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    this.currentUser = userString ? JSON.parse(userString) : null;
  }

  logOut() {
    this.authService.SignOut();
  }
}
