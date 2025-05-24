import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service'; // Adjust path as needed

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  isAuthenticated = false;
  userInitial: string = '';
  dropdownOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is authenticated using the AuthService
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    this.isAuthenticated = this.authService.isLoggedIn();
    
    if (this.isAuthenticated) {
      // Get user info from token or service
      const userInfo = this.authService.getUserInfo(); // You'll need to implement this method
      
      if (userInfo && userInfo.name) {
        this.userInitial = userInfo.name.charAt(0).toUpperCase();
      } else if (userInfo && userInfo.email) {
        this.userInitial = userInfo.email.charAt(0).toUpperCase();
      } else {
        this.userInitial = 'U'; // Default initial
      }
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout(); // Use AuthService logout method
    this.isAuthenticated = false;
    this.userInitial = '';
    this.dropdownOpen = false;
    this.router.navigateByUrl('/acceuil');
  }
}