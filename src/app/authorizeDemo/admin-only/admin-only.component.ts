import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-only',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-only.component.html',
  styles: ``
})
export class AdminOnlyComponent {
  constructor(public authService: AuthService) {}
}
