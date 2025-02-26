import { UserService } from './../shared/services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router,
              private autheService:AuthService,
            private userService:UserService){ }
fullName: string = ''

ngOnInit(): void {
              this.userService.getUserProfile().subscribe({
                next: (res: any) => this.fullName = res.fullName,
                error: (err: any) => console.log('error while retrieving user profile:\n', err)
              })
}
  onlogout() {
    this.autheService.deleteToken();
    this.router.navigateByUrl('/signin');
  }

}
