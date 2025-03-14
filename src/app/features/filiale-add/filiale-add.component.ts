// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { CommonModule } from '@angular/common';
// import { CreateFilialeDto } from '../../Models/create-filiale-dto.model';

// @Component({
//   selector: 'app-filiale-add',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
//   templateUrl: './filiale-add.component.html',
//   styles: []
// })
// export class FilialeAddComponent implements OnInit {
//   filialeForm: FormGroup;
//   successMessage: string = '';

//   constructor(private filialeService: FilialeService, private fb: FormBuilder, private router: Router) {
//     this.filialeForm = this.fb.group({
//       nom: ['', [Validators.required, Validators.maxLength(255)]],
//       adresse: ['', [Validators.maxLength(500)]],
//       description: ['', [Validators.maxLength(1000)]],
//       photo: [''],
//       phone: ['', [Validators.required, Validators.pattern('^[0-9+ ]*$')]], 
//       fax: [''],
//       email: ['', [Validators.required, Validators.email]],
//       siteWeb: ['']
//     });
//   }

//   onSubmit(): void {
//     if (this.filialeForm.invalid) {
//       return;
//     }

//     this.filialeService.addFiliale(this.filialeForm.value).subscribe({
//       next: (response) => {
//         this.successMessage = response.message || 'Filiale ajoutée avec succès!';
//         this.filialeForm.reset(); // Réinitialise le formulaire après succès
//         setTimeout(() => {
//           this.successMessage = '';
//           this.router.navigate(['/filiales']); // Redirection vers la liste
//         }, 2000);
//       },
//       error: (error) => {
//         console.error('Erreur lors de l\'ajout', error);
//         alert('Erreur lors de l\'ajout de la filiale');
//       }
//     });
//   }

//   ngOnInit(): void {}
// }
