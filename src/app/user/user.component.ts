import { Component } from '@angular/core';
import { RegistrationComponent } from './registration/registration.component';

@Component({
  selector: 'app-user',
  imports: [RegistrationComponent],
  standalone: true,
  templateUrl: './user.component.html',
  styles: ``
})
export class UserComponent {

}
