import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import feather from 'feather-icons';
declare var $: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink, CommonModule,FormsModule],
  standalone: true,
   templateUrl: './app.component.html',

  styles: [],
})
export class AppComponent implements AfterViewInit {
  constructor(public authService: AuthService, public router: Router) {}
  title = 'Front_PoulinaFutureJobs';
  ngAfterViewInit() {
    feather.replace(); // Remplace les balises <i data-feather="icon-name">
  }
  ngOnInit() {
    $(document).ready(function () {
      console.log("jQuery et Bootstrap sont bien chargés !");
    });
}
}


