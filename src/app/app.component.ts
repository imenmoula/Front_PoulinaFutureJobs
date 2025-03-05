import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as feather from 'feather-icons';
import * as bootstrap from 'bootstrap'; // Ajout de l'import de Bootstrap
import { RouterModule } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['']
})
export class AppComponent implements AfterViewInit, OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    feather.replace();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $(document).ready(() => {
        console.log("jQuery et Bootstrap sont bien chargés !");
        if (typeof bootstrap !== 'undefined') {
          const dropdowns = document.querySelectorAll('.dropdown-toggle');
          dropdowns.forEach(el => new bootstrap.Dropdown(el));
        }
      });
    }, 100); // Delay to ensure DOM is ready
  }
  navigateToFiliale() {
    this.router.navigate(['/filiale']);
  }

  navigateToDepartement() {
    this.router.navigate(['/departement']);
  }
  
}