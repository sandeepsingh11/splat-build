import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private _authService: AuthService) { 
    this._authService.loggedIn.subscribe((res) => {
      this.loggedIn = res;
    });
  }

  ngOnInit(): void {
  }

  loggedIn = false;

}
