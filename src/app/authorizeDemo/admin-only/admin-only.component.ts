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
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

declare global {
  interface Window {
    feather: { replace: () => void };
  }
}

@Component({
  selector: 'app-admin-only',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-only.component.html',
  styleUrls: ['./admin-only.component.css']
})
export class AdminOnlyComponent implements OnInit, AfterViewInit {
  sidebarOpen = false; // Par défaut, la barre latérale est fermée
  currentTime: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentTime = new Date().toLocaleTimeString();
  }

  ngAfterViewInit() {
    if (window.feather) {
      window.feather.replace();
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen; // Inverse l'état de la barre latérale
    console.log('Sidebar toggled:', this.sidebarOpen); // Pour déboguer
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
    this.router.navigate(['/signup']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToGestionDepartements() {
    this.router.navigate(['/gestion-departements']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}