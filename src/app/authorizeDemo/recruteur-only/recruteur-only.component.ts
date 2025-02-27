import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-recruteur-only',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruteur-only.component.html',
  styles: `` 
})
export class RecruteurOnlyComponent {
  constructor(public authService: AuthService) {}
}
