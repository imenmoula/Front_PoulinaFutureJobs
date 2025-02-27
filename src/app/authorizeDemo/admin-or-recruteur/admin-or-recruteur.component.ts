import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-or-recruteur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-or-recruteur.component.html',
  styles: ``
})
export class AdminOrRecruteurComponent {
  constructor(public authService: AuthService) {}

}
