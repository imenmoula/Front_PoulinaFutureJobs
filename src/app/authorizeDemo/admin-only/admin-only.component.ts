import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { LayoutBackendComponent } from '../../layoutBackend/layout-backend/layout-backend.component';

declare global {
  interface Window {
    feather: { replace: () => void };
  }
}

@Component({
  selector: 'app-admin-only',
  standalone: true,
  imports: [CommonModule, LayoutBackendComponent],
  templateUrl: './admin-only.component.html',
  styleUrls: ['./admin-only.component.css']
})
export class AdminOnlyComponent implements OnInit, AfterViewInit {
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    window.feather?.replace();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.deleteToken();
    this.navigateTo('/signin');
  }
}