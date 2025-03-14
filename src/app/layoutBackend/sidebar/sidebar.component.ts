import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import * as feather from 'feather-icons';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() sidebarOpen = false;
  menuState: { [key: string]: boolean } = { gestion: false };

  constructor( private router: Router, private AuthServicehService: AuthService) {}

  ngOnInit(): void {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleMenu(menu: string): void {
    this.menuState[menu] = !this.menuState[menu];
  }

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin'; // Vérifie si le rôle est "Admin"
  }

  onLogout(): void {
    this.AuthServicehService.deleteToken(); // Suppression du token
    this.router.navigateByUrl('/signin'); // Redirection vers /signin
  }
}