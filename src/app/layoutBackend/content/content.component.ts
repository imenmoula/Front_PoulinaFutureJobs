import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: [''],
  standalone: true,
  imports: [CommonModule, RouterModule]
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