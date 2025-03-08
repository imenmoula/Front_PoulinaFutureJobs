import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layoutBackend/sidebar/sidebar.component';
import { AuthService } from './shared/services/auth.service';
import * as feather from 'feather-icons';
import * as bootstrap from 'bootstrap';

declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['']
})
export class AppComponent  {
  
  constructor(public authService: AuthService
    ) {}  
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

  
}