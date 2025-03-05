 import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styles: `` 
})
export class SidebarComponent {
  @Input() sidebarOpen = false;

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

