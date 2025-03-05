import { AuthService } from './../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
AuthService
@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './content.component.html',
  styles: ``
})
export class ContentComponent implements OnInit {
  currentTime: string='';

  constructor(public authService: AuthService) {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  ngOnInit(): void {}

  private updateTime(): void {
    this.currentTime = new Date().toLocaleTimeString();
  }

  goToProfile(): void {
    // Redirection vers le profil (exemple)
    console.log('Redirection vers le profil');
  }
}