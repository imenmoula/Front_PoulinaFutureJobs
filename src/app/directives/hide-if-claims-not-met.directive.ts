// import { Directive, ElementRef, Input, OnInit } from '@angular/core';
// import { AuthService } from '../shared/services/auth.service';

// @Directive({
//   selector: '[appHideIfClaimsNotMet]',
//   standalone: true
// })
// export class HideIfClaimsNotMetDirective implements OnInit {
//   @Input("appHideIfClaimsNotMet") claimReq!: Function;

//       constructor(private authService: AuthService,
//         private elementRef: ElementRef) { }

//       ngOnInit(): void {
//         const claims = this.authService.getClaims();
        
//         if (!this.claimReq(claims))
//           this.elementRef.nativeElement.style.display = "none";
//       }

// }
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
@Directive({
  selector: '[appHideIfClaimsNotMet]',
  standalone: true
})
export class HideIfClaimsNotMetDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set appHideIfClaimsNotMet(requiredRole: string | (() => boolean)) {
    let hasClaim = false;

    // Vérifier si l'entrée est une string (rôle) ou une fonction
    if (typeof requiredRole === 'string') {
      hasClaim = this.authService.hasRole(requiredRole);
    } else if (typeof requiredRole === 'function') {
      hasClaim = requiredRole();
    }

    if (hasClaim) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}