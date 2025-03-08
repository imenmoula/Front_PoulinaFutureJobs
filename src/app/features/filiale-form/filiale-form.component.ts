// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Filiale } from '../../../Models/filiale.model';
// import { Router, ActivatedRoute } from '@angular/router';
// import { Observable, of } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { FilialeService } from '../../shared/services/filiale.service';

// @Component({
//   selector: 'app-filiale-form',
//   templateUrl: './filiale-form.component.html',
//   styleUrls: ['./filiale-form.component.css']
// })
// export class FilialeFormComponent implements OnInit {
//   filialeForm: FormGroup;
//   isEditMode = false;
//   filialeId: string | null = null;
//   errorMessage: string | null = null;
//   successMessage: string | null = null;
//   selectedFile: File | null = null; // Pour stocker le fichier sélectionné
//   photoUrl: string | null = null; // Pour stocker l'URL de la photo après upload

//   constructor(
//     private fb: FormBuilder,
//     private filialeService: FilialeService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.filialeForm = this.fb.group({
//       nom: ['', [Validators.required, Validators.minLength(2)]],
//       adresse: ['', [Validators.required, Validators.minLength(5)]],
//       description: [''],
//       dateCreation: ['', Validators.required]
//     });
//   }

//   ngOnInit(): void {
//     this.filialeId = this.route.snapshot.paramMap.get('id');
//     if (this.filialeId) {
//       this.isEditMode = true;
//       this.loadFilialeData(this.filialeId);
//     }
//   }

//   loadFilialeData(id: string): void {
//     this.filialeService.getFiliale(id).subscribe({
//       next: (filiale: Filiale) => {
//         this.filialeForm.patchValue({
//           nom: filiale.nom,
//           adresse: filiale.adresse,
//           description: filiale.description,
//           dateCreation: filiale.dateCreation.toISOString().split('T')[0] // Format YYYY-MM-DD
//         });
//         this.photoUrl = filiale.photo ?? null; // Pré-remplir l'URL de la photo si existante
//       },
//       error: (err: any) => { // Gestion des erreurs
//         this.errorMessage = `Erreur lors du chargement de la filiale : ${err.message || err.statusText || 'Une erreur est survenue'}`;
//       }
//     });
//   }

//   // Gestion du changement de fichier
//   onFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFile = input.files[0];
//       this.previewPhoto(); // Prévisualiser l'image sélectionnée
//     }
//   }

//   previewPhoto(): void {
//     if (this.selectedFile) {
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.photoUrl = e.target.result;
//       };
//       reader.readAsDataURL(this.selectedFile);
//     }
//   }

//   // Fonction pour uploader la photo
//   uploadPhoto(): Observable<string> {
//     if (!this.selectedFile) {
//       return of(''); // Retourner une valeur vide si aucune photo n'est sélectionnée
//     }

//     const formData = new FormData(); // Correct instantiation of FormData
//     formData.append('photo', this.selectedFile);

//     return this.filialeService.uploadPhoto(formData).pipe(
//       catchError((err: any) => {
//         this.errorMessage = `Erreur lors du téléchargement de la photo : ${err.message || err.statusText || 'Une erreur est survenue'}`;
//         return of(''); // Retourner une chaîne vide en cas d'erreur
//       })
//     );
//   }

//   onSubmit(): void {
//     if (this.filialeForm.valid) {
//       const filiale: Filiale = {
//         idFiliale: this.isEditMode ? this.filialeId! : '',
//         nom: this.filialeForm.get('nom')?.value,
//         adresse: this.filialeForm.get('adresse')?.value,
//         description: this.filialeForm.get('description')?.value,
//         dateCreation: new Date(this.filialeForm.get('dateCreation')?.value),
//         photo: this.photoUrl // L'URL ou nom de fichier après upload
//       };

//       // Upload de la photo avant d'enregistrer ou de mettre à jour
//       if (this.selectedFile) {
//         this.uploadPhoto().subscribe({
//           next: (photoUrl) => {
//             if (photoUrl) {
//               filiale.photo = photoUrl;
//             }
//             this.saveFiliale(filiale); // Enregistrer ou mettre à jour la filiale
//           },
//           error: (err: any) => {
//             this.errorMessage = `Erreur lors de l'upload de la photo : ${err.message || err.statusText || 'Une erreur est survenue'}`;
//             this.successMessage = null;
//           }
//         });
//       } else {
//         this.saveFiliale(filiale); // Pas de photo, enregistrer directement
//       }
//     }
//   }

//   saveFiliale(filiale: Filiale): void {
//     const action = this.isEditMode
//       ? this.filialeService.updateFiliale(this.filialeId!, filiale)
//       : this.filialeService.addFiliale(filiale);

//     action.subscribe({
//       next: () => {
//         this.successMessage = this.isEditMode
//           ? 'Filiale mise à jour avec succès !'
//           : 'Filiale ajoutée avec succès !';
//         this.errorMessage = null;
//         setTimeout(() => this.router.navigate(['/']), 1500);
//       },
//       error: (err: any) => {
//         this.errorMessage = `Erreur lors de ${this.isEditMode ? 'la mise à jour' : "l'ajout"} : ${err.message || err.statusText || 'Une erreur est survenue'}`;
//         this.successMessage = null;
//       }
//     });
//   }

//   get nom() { return this.filialeForm.get('nom'); }
//   get adresse() { return this.filialeForm.get('adresse'); }
//   get dateCreation() { return this.filialeForm.get('dateCreation'); }
// }
