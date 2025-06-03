import { Router, RouterModule } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {

@Output() toggleSidebarEvent = new EventEmitter<void>();

constructor(public authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  toggleFullScreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode'); // À implémenter dans CSS
  }

  goToProfile(): void {
this.router.navigateByUrl('/profile-update');
  }

  onLogout(): void {
    this.authService.deleteToken(); // Suppression du token
    this.router.navigateByUrl('/signin'); // Redirection vers /signin
  }
}
