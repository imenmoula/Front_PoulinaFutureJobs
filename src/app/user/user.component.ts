import { Component } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { trigger, style, transition, animate, query } from '@angular/animations';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet],
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
  constructor(private context: ChildrenOutletContexts) {}

  getRouteUrl() {
    return this.context.getContext('primary')?.route?.url;
  }
}