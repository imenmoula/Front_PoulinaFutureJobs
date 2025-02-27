import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,UserComponent,RouterLink, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'Front_PoulinaFutureJobs';
}
