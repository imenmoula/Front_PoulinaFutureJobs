import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as feather from 'feather-icons';
import * as bootstrap from 'bootstrap';
import { AuthService } from './shared/services/auth.service';

declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['']
})
export class AppComponent implements AfterViewInit, OnInit {
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    feather.replace();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $(document).ready(() => {
        if (typeof bootstrap !== 'undefined') {
          const dropdowns = document.querySelectorAll('.dropdown-toggle');
          dropdowns.forEach(el => new bootstrap.Dropdown(el));
        }
      });
    }, 100); // Delay to ensure DOM is ready
  }

  logout() {
    this.authService.deleteToken();
    this.router.navigate(['/signin']);
  }
}