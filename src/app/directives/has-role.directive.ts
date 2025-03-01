// // src/app/directives/has-role.directive.ts
// import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
// import { AuthService } from '../shared/services/auth.service';
// @Directive({
//   selector: '[hasRole]',
//   standalone: true
// })
// export class HasRoleDirective {
//   constructor(
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private authService: AuthService
//   ) {}

//   @Input() set hasRole(role: string) {
//     if (this.authService.hasRole(role)) {
//       this.viewContainer.createEmbeddedView(this.templateRef);
//     } else {
//       this.viewContainer.clear();
//     }
//   }
// }