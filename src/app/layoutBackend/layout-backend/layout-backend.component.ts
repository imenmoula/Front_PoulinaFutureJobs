import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ContentComponent } from '../content/content.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-layout-backend',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, ContentComponent, FooterComponent],  
  templateUrl: './layout-backend.component.html',
  styles: ``
})
export class LayoutBackendComponent {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}