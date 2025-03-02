import { UserComponent } from './../../user/user.component';
// import { Component } from '@angular/core';
// import { AuthService } from '../../shared/services/auth.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-only',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './admin-only.component.html',
//   styles: ``
// })
// export class AdminOnlyComponent {
//   constructor(public authService: AuthService) {}
// }


   // admin-only.component.ts
// admin-only.component.ts
// src/app/authorizeDemo/admin-only/admin-only.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ajouté pour ngClass
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    };
  }
}

@Component({
  selector: 'app-admin-only',
  standalone: true, // Confirme que c’est standalone
  imports: [CommonModule], // Ajouté pour ngClass
  templateUrl: './admin-only.component.html',
  styleUrls: ['./admin-only.component.css']
})
export class AdminOnlyComponent implements OnInit, AfterViewInit {
  sidebarOpen = false;
  currentTime: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(public authService: AuthService,private userService: UserService, private router: Router) {}
  
  goToGestionDepartements() { // Nouvelle méthode
    this.router.navigate(['/gestion-departements']);
  }
  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  ngAfterViewInit() {
    if (window.feather) {
      window.feather.replace();
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }
}