// import { User } from './../../Models/user.model';
// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
// // import { MatSnackBar } from '@angular/material/snack-bar';
// // import { Router, RouterLink } from '@angular/router';
// // import { UserService } from '../../shared/services/user.service';
// // import { FooterComponent } from '../../layoutBackend/footer/footer.component';
// // import { HeaderComponent } from '../../layoutBackend/header/header.component';
// // import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
// // import { CommonModule } from '@angular/common';
// // import { User } from '../../Models/user.model';

// // @Component({
// //   selector: 'app-recruiter-list',
// //   standalone: true,
// //   imports: [FooterComponent, HeaderComponent, SidebarComponent, ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
// //   templateUrl: './recruiter-list.component.html',
// //   styles: ``
// // })
// // export class RecruiterListComponent implements OnInit {
// //   recruiters: User[] = [];
// //   filteredRecruiters: User[] = [];
// //   searchForm: FormGroup;
// //   sidebarOpen: boolean = false;
// //   loading: boolean = false;

// //   constructor(
// //     private userService: UserService,
// //     private router: Router,
// //     private snackBar: MatSnackBar,
// //     private fb: FormBuilder
// //   ) {
// //     this.searchForm = this.fb.group({
// //       searchTerm: [''],
// //       poste: ['']
// //     });
// //   }

// //   ngOnInit(): void {
// //     this.getRecruiters();
// //     this.searchForm.valueChanges.subscribe(value => this.applyFilters(value));
// //   }

// //   getRecruiters(): void {
// //     this.loading = true;
// //     this.userService.getUsersByRole('Recruteur').subscribe({
// //       next: (response) => {
// //         if (response.success) {
// //           this.recruiters = response.data;
// //           this.filteredRecruiters = this.recruiters;
// //         } else {
// //           this.snackBar.open(response.message, 'Fermer', { duration: 3000 });
// //         }
// //         this.loading = false;
// //       },
// //       error: (error) => {
// //         console.error('Erreur lors du chargement des recruteurs', error);
// //         this.snackBar.open('Erreur lors du chargement des recruteurs.', 'Fermer', { duration: 3000 });
// //         this.loading = false;
// //       }
// //     });
// //   }

// //   deleteRecruiter(id: string): void {
// //     if (confirm('Voulez-vous vraiment supprimer ce recruteur ?')) {
// //       this.userService.deleteUser(id).subscribe({
// //         next: () => {
// //           this.getRecruiters();
// //           this.showSnackbar('Recruteur supprimé avec succès !', 'Fermer');
// //         },
// //         error: (err) => {
// //           console.error('Erreur lors de la suppression:', err);
// //           this.showSnackbar('Erreur lors de la suppression.', 'Fermer');
// //         }
// //       });
// //     }
// //   }

// //   applyFilters(value: { searchTerm: string, poste: string }): void {
// //     const searchTerm = value.searchTerm ? value.searchTerm.toLowerCase() : '';
// //     const poste = value.poste ? value.poste.toLowerCase() : '';

// //     this.filteredRecruiters = this.recruiters.filter(recruiter => {
// //       const matchesSearchTerm = !searchTerm ||
// //         (recruiter.fullName && recruiter.fullName.toLowerCase().includes(searchTerm)) ||
// //         (recruiter.email && recruiter.email.toLowerCase().includes(searchTerm));

// //       const matchesVille = !poste||
// //         (recruiter.poste && recruiter.poste.toLowerCase().includes(poste));

// //       return matchesSearchTerm && matchesVille;
// //     });
// //   }

// //   toggleSidebar(): void {
// //     this.sidebarOpen = !this.sidebarOpen;
// //   }

// //   showSnackbar(message: string, action: string) {
// //     this.snackBar.open(message, action, {
// //       duration: 3000,
// //       verticalPosition: 'top',
// //       horizontalPosition: 'right',
// //     });
// //   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router, RouterLink } from '@angular/router';
// import { UserService } from '../../shared/services/user.service';
// import { FooterComponent } from '../../layoutBackend/footer/footer.component';
// import { HeaderComponent } from '../../layoutBackend/header/header.component';
// import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
// import { CommonModule } from '@angular/common';
// import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
// import { v4 as uuidv4 } from 'uuid';

// @Component({
//   selector: 'app-recruiter-list',
//   standalone: true,
//   imports: [
//     FooterComponent,
//     HeaderComponent,
//     SidebarComponent,
//     ReactiveFormsModule,
//     CommonModule,
//     FormsModule,
//     RouterLink,
//     PaginationComponent // Added PaginationComponent for pagination
//   ],
//   templateUrl: './recruiter-list.component.html',
//   styleUrls: ['./recruiter-list.component.css']
// })
// export class RecruiterListComponent implements OnInit {
//   recruiters: User[] = [];
//   filteredRecruiters: User[] = [];
//   paginatedRecruiters: User[] = []; // Added for pagination
//   searchForm: FormGroup;
//   sidebarOpen: boolean = false;
//   loading: boolean = false;

//   pageSize = 3; // Added for pagination
//   currentPage = 0; // Added for pagination
//   totalItems = 0; // Added for pagination

//   constructor(
//     private userService: UserService,
//     private router: Router,
//     private snackBar: MatSnackBar,
//     private fb: FormBuilder
//   ) {
//     this.searchForm = this.fb.group({
//       searchTerm: [''],
//       poste: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.getRecruiters();
//     this.searchForm.valueChanges.subscribe(value => this.applyFilters(value));
//   }

//   getRecruiters(): void {
//     this.loading = true;
//     this.userService.getUsersByRole('Recruteur').subscribe({
//       next: (response) => {
//         if (response.success) {
//           if (Array.isArray(response.data)) {
//             this.recruiters = response.data.map((recruiter:any) => ({
//               id: recruiter.id,
//               email: recruiter.email,
//               fullName: recruiter.fullName || `${recruiter.firstName || ''} ${recruiter.lastName || ''}`.trim() || 'N/A',
//               nom: recruiter.lastName || recruiter.nom || 'N/A',
//               prenom: recruiter.firstName || recruiter.prenom || 'N/A',
//               photo: recruiter.photo,
//               PhoneNumber: recruiter.phone,
             
//               entreprise:  recruiter.entreprise,
//               poste:  recruiter.poste,
//               role: typeof recruiter.role === 'string' ? { id: uuidv4(), name: recruiter.role, normalizedName: recruiter.role.toUpperCase() } : recruiter.role,
//               UserRoles: recruiter.UserRoles
//             } as User));
//             this.filteredRecruiters = [...this.recruiters];
//             this.totalItems = this.filteredRecruiters.length;
//             this.updatePaginatedRecruiters();
//           } else {
//             console.error('response.data is not an array:', response.data);
//             this.snackBar.open('Les données des recruteurs ne sont pas valides.', 'Fermer', { duration: 3000 });
//             this.recruiters = [];
//             this.filteredRecruiters = [];
//             this.totalItems = 0;
//             this.updatePaginatedRecruiters();
//           }
//         } else {
//           this.snackBar.open(response.message, 'Fermer', { duration: 3000 });
//           this.recruiters = [];
//           this.filteredRecruiters = [];
//           this.totalItems = 0;
//           this.updatePaginatedRecruiters();
//         }
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des recruteurs', error);
//         this.snackBar.open('Erreur lors du chargement des recruteurs.', 'Fermer', { duration: 3000 });
//         this.recruiters = [];
//         this.filteredRecruiters = [];
//         this.totalItems = 0;
//         this.updatePaginatedRecruiters();
//         this.loading = false;
//       }
//     });
//   }

//   deleteRecruiter(id: string): void {
//     if (confirm('Voulez-vous vraiment supprimer ce recruteur ?')) {
//       this.userService.deleteUser(id).subscribe({
//         next: () => {
//           this.getRecruiters();
//           this.showSnackbar('Recruteur supprimé avec succès !', 'Fermer');
//         },
//         error: (err) => {
//           console.error('Erreur lors de la suppression:', err);
//           this.showSnackbar('Erreur lors de la suppression.', 'Fermer');
//         }
//       });
//     }
//   }

//   applyFilters(value: { searchTerm: string, poste: string }): void {
//     const searchTerm = value.searchTerm ? value.searchTerm.toLowerCase() : '';
//     const poste = value.poste ? value.poste.toLowerCase() : '';

//     this.filteredRecruiters = this.recruiters.filter(recruiter => {
//       const matchesSearchTerm = !searchTerm ||
//         (recruiter.fullName && recruiter.fullName.toLowerCase().includes(searchTerm)) ||
//         (recruiter.email && recruiter.email.toLowerCase().includes(searchTerm));

//       const matchesPoste = !poste ||
//         (recruiter.poste && recruiter.poste.toLowerCase().includes(poste));

//       return matchesSearchTerm && matchesPoste;
//     });

//     this.totalItems = this.filteredRecruiters.length;
//     this.currentPage = 0; // Reset to first page on filter change
//     this.updatePaginatedRecruiters();
//   }

//   updatePaginatedRecruiters(): void {
//     const startIndex = this.currentPage * this.pageSize;
//     const endIndex = Math.min(startIndex + this.pageSize, this.filteredRecruiters.length);
//     this.paginatedRecruiters = this.filteredRecruiters.slice(startIndex, endIndex);
//   }

//   onPageChange(page: number): void {
//     this.currentPage = page;
//     this.updatePaginatedRecruiters();
//   }

//   toggleSidebar(): void {
//     this.sidebarOpen = !this.sidebarOpen;
//   }

//   showSnackbar(message: string, action: string) {
//     this.snackBar.open(message, action, {
//       duration: 3000,
//       verticalPosition: 'bottom', // Change to 'top' or 'bottom' (no exact 'middle' option)
//       horizontalPosition: 'center' // Center horizontally
//     });
//   }
  
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { User } from '../../Models/user.model';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-recruiter-list',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterLink,
    PaginationComponent
  ],
  templateUrl: './recruiter-list.component.html',
  styleUrls: ['./recruiter-list.component.css']
})
export class RecruiterListComponent implements OnInit {
  recruiters: User[] = [];
  filteredRecruiters: User[] = [];
  paginatedRecruiters: User[] = [];
  searchForm: FormGroup;
  sidebarOpen: boolean = false;
  loading: boolean = false;

  pageSize = 3;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      poste: ['']
    });
  }

  ngOnInit(): void {
    this.getRecruiters();
    this.searchForm.valueChanges.subscribe(value => this.applyFilters(value));
  }

  getRecruiters(): void {
    this.loading = true;
    this.userService.getUsersByRole('Recruteur').subscribe({
      next: (response) => {
        if (response.success) {
          if (Array.isArray(response.data)) {
            this.recruiters = response.data.map((recruiter: any) => ({
              id: recruiter.id,
              email: recruiter.email,
              fullName: recruiter.fullName || `${recruiter.firstName || ''} ${recruiter.lastName || ''}`.trim() || 'N/A',
              nom: recruiter.lastName || recruiter.nom || 'N/A',
              prenom: recruiter.firstName || recruiter.prenom || 'N/A',
              photo: recruiter.photo,
              PhoneNumber: recruiter.phone,
              entreprise: recruiter.entreprise,
              poste: recruiter.poste,
              role: typeof recruiter.role === 'string' ? { id: uuidv4(), name: recruiter.role, normalizedName: recruiter.role.toUpperCase() } : recruiter.role,
              UserRoles: recruiter.UserRoles
            } as User));
            this.filteredRecruiters = [...this.recruiters];
            this.totalItems = this.filteredRecruiters.length;
            this.updatePaginatedRecruiters();
          } else {
            console.error('response.data is not an array:', response.data);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Les données des recruteurs ne sont pas valides.',
            });
            this.recruiters = [];
            this.filteredRecruiters = [];
            this.totalItems = 0;
            this.updatePaginatedRecruiters();
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: response.message,
          });
          this.recruiters = [];
          this.filteredRecruiters = [];
          this.totalItems = 0;
          this.updatePaginatedRecruiters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des recruteurs', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Erreur lors du chargement des recruteurs.',
        });
        this.recruiters = [];
        this.filteredRecruiters = [];
        this.totalItems = 0;
        this.updatePaginatedRecruiters();
        this.loading = false;
      }
    });
  }

  deleteRecruiter(id: string): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer ce recruteur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.recruiters = this.recruiters.filter(r => r.id !== id);
            this.filteredRecruiters = this.filteredRecruiters.filter(r => r.id !== id);
            this.totalItems = this.filteredRecruiters.length;
            this.updatePaginatedRecruiters();
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Recruteur supprimé avec succès',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur de Suppression',
              text: 'Erreur lors de la suppression du recruteur.',
            });
          }
        });
      }
    });
  }

  applyFilters(value: { searchTerm: string, poste: string }): void {
    const searchTerm = value.searchTerm ? value.searchTerm.toLowerCase() : '';
    const poste = value.poste ? value.poste.toLowerCase() : '';

    this.filteredRecruiters = this.recruiters.filter(recruiter => {
      const matchesSearchTerm = !searchTerm ||
        (recruiter.fullName && recruiter.fullName.toLowerCase().includes(searchTerm)) ||
        (recruiter.email && recruiter.email.toLowerCase().includes(searchTerm));

      const matchesPoste = !poste ||
        (recruiter.poste && recruiter.poste.toLowerCase().includes(poste));

      return matchesSearchTerm && matchesPoste;
    });

    this.totalItems = this.filteredRecruiters.length;
    this.currentPage = 0;
    this.updatePaginatedRecruiters();
  }

  updatePaginatedRecruiters(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredRecruiters.length);
    this.paginatedRecruiters = this.filteredRecruiters.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedRecruiters();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}