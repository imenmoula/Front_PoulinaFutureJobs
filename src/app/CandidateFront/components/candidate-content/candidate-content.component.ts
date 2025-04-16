import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-content.component.html',
  styles: ``
})
export class CandidateContentComponent {
  fullName: string = '';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.fullName = this.authService.getUserFullName();
  }
}
