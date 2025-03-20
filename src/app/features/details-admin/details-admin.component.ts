// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { UserService } from '../../shared/services/user.service';

// @Component({
//   selector: 'app-details-admin',
//   standalone: true,
//   imports: [],
//   templateUrl: './details-admin.component.html',
//   styleUrls: ['./details-admin.component.css']
// })
// export class DetailsAdminComponent implements OnInit {
//   admin: any = null;

//   constructor(
//     private route: ActivatedRoute,
//     private userService: UserService
//   ) {}

//   ngOnInit(): void {
//     const adminId = this.route.snapshot.paramMap.get('id');
//     if (adminId) {
//       this.userService.getUserById(adminId).subscribe({
//         next: (data) => this.admin = data,
//         error: (err) => console.error('Erreur lors du chargement:', err)
//       });
//     }
//   }
// }