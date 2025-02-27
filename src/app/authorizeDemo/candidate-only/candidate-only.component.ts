import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-candidate-only',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-only.component.html',
  styles: ``
})
export class CandidateOnlyComponent {
  constructor(public authService: AuthService) {}
}
