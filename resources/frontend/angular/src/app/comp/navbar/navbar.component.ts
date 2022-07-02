import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { NavItem } from 'src/app/types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private _authService: AuthService) { 
    this._authService.loggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
  }

  ngOnInit(): void {
  }

  isLoggedIn = false;
  authRoutes: NavItem[] = [
    {name: '+Gear', url: '/gears/create'},
    {name: '+Gearset', url: '/gearsets/create'},
  ];
  dropdownAuthRoutes: NavItem[] = [
    {name: 'Profile', url: ''},
    {name: 'Dashboard', url: '/dashboard'},
    {name: 'Gears', url: '/gears'},
    {name: 'Gearsets', url: '/gearsets'},
  ];
  guestRoutes: NavItem[] = [
    {name: 'Login', url: '/login'},
    {name: 'Register', url: '/register'},
  ];

  logout() {
    this._authService.logout().subscribe(() => {
      window.location.href = '/login';
    });
  }
}
