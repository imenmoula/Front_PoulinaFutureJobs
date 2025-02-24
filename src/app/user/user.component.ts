import { Component } from '@angular/core';
import { RegistrationComponent } from './registration/registration.component';
import { ChildrenOutletContexts, Router, RouterOutlet } from '@angular/router';
import { trigger,style,transition,animate,query } from '@angular/animations';

@Component({
  selector: 'app-user',
  imports: [RegistrationComponent,RouterOutlet],
  standalone: true,
  templateUrl: './user.component.html',
  styles: ``,
  animations: [
    trigger('routerFadeIn', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0 }),
          animate('1s ease-in-out', style({ opacity: 1 }))
        ], { optional: true }),
      ])
    ])
  ]
})
export class UserComponent {
  constructor(private context: ChildrenOutletContexts) { }
  getRouteUrl() {
    return this.context.getContext('primary')?.route?.url;
  }
}
