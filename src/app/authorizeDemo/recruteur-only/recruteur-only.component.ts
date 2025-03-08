import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { LayoutBackendComponent } from '../../layoutBackend/layout-backend/layout-backend.component';

@Component({
  selector: 'app-recruteur-only',
  standalone: true,
  imports: [CommonModule, LayoutBackendComponent],
  templateUrl: './recruteur-only.component.html',
  styles: `` 
})
export class RecruteurOnlyComponent {

constructor(
  public authService: AuthService,
  private userService: UserService,
  private router: Router
) {}  
onLogout(): void {
    this.authService.deleteToken(); // Suppression du token
    this.router.navigateByUrl('/signin'); // Redirection vers /signin
  }
}
