import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,UserComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'Front_PoulinaFutureJobs';
}
