import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,UserComponent,RouterLink, CommonModule,FormsModule],
  standalone: true,
   templateUrl: './app.component.html',

  styles: [],
})
export class AppComponent {
  constructor(public authService: AuthService, public router: Router) {}
  title = 'Front_PoulinaFutureJobs';
}
