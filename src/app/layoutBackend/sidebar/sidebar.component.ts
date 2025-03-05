import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [' '],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  @Input() sidebarOpen = false;
  constructor(private router: Router) { }

  menuState: Record<string, boolean> = {
    gestion: false
  };

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;

  }

  toggleMenu(menu: keyof typeof this.menuState) {
    this.menuState[menu] = !this.menuState[menu];
  }
 
}

