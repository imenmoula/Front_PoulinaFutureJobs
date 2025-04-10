
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import Swal from 'sweetalert2';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { CompetenceService } from '../../shared/services/competence.service';
// import { OffreEmploi } from '../../Models/offre-emploi.model';
// import { CommonModule } from '@angular/common';
// import { OffreCompetence } from '../../Models/offre-competence.model';

// @Component({
//   selector: 'app-offre-form',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './offre-form.component.html',
//   styles: ''
// })
// export class OffreFormComponent implements OnInit {
//   offreForm!: FormGroup;
//   isEditMode = false;
//   offreId?: string;
//   loading = false;
//   error = '';
//   filiales: any[] = [];
//   recruteurs: any[] = [];
//   isSearchingCompetence = false;
//   showCompetenceSuggestions = false;
//   activeSuggestionIndex = -1;
//   competenceSuggestions: any[] = [];

//   typeContrats = [
//     { id: 1, name: 'CDI' },
//     { id: 2, name: 'CDD' },
//     { id: 3, name: 'Freelance' },
//     { id: 4, name: 'Stage' }
//   ];

//   statuts = [
//     { id: 0, name: 'Ouvert' },
//     { id: 1, name: 'Fermé' }
//   ];

//   modesTravail = [
//     { id: 0, name: 'Présentiel' },
//     { id: 1, name: 'Hybride' },
//     { id: 2, name: 'Télétravail' }
//   ];

//   niveauxCompetence = [
//     { id: 'Debutant', name: 'Débutant' },
//     { id: 'Intermediaire', name: 'Intermédiaire' },
//     { id: 'Avance', name: 'Avancé' },
//     { id: 'Expert', name: 'Expert' }
//   ];

//   constructor(
//     private fb: FormBuilder,
//     private offreEmploiService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private competenceService: CompetenceService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//     this.loadFiliales();
//     this.loadRecruteurs();

//     this.route.params.subscribe(params => {
//       const id = params['id'];
//       console.log('ID dans les paramètres de route:', id);
//       if (id && this.isValidGuid(id)) {
//         this.isEditMode = true;
//         this.offreId = id;
//         if (this.offreId) {
//           this.loadOffreDetails(this.offreId);
//         }
//       } else if (id) {
//         this.showErrorToast('ID d\'offre invalide dans l\'URL');
//       }
//     });
//   }

//   initializeForm(): void {
//     this.offreForm = this.fb.group({
//       idOffreEmploi: [null],
//       titre: ['', [Validators.required, Validators.maxLength(200)]],
//       specialite: ['', [Validators.required, Validators.maxLength(100)]],
//       description: ['', [Validators.required, Validators.maxLength(2000)]],
//       datePublication: [new Date().toISOString().split('T')[0], [Validators.required]],
//       dateExpiration: ['', [Validators.required]],
//       salaire: [0, [Validators.min(0)]],
//       typeContrat: [1, [Validators.required]], // CDI par défaut
//       nombrePostes: [1, [Validators.required, Validators.min(1)]],
//       modeTravail: [0, [Validators.required]], // Présentiel par défaut
//       avantages: [''],
//       statut: [0, [Validators.required]], // Ouvert par défaut
//       niveauExperienceRequis: ['', [Validators.required, Validators.maxLength(50)]],
//       diplomeRequis: ['', [Validators.maxLength(100)]],
//       idRecruteur: ['', [Validators.required]],
//       idFiliale: ['', [Validators.required]],
//       offreCompetences: this.fb.array([this.createCompetenceFormGroup()])
//     });
//   }

//   get offreCompetences(): FormArray {
//     return this.offreForm.get('offreCompetences') as FormArray;
//   }

//   loadFiliales(): void {
//     this.filialeService.getFiliales().subscribe({
//       next: (response) => {
//         this.filiales = response;
//         if (this.filiales.length === 1) {
//           this.offreForm.patchValue({ idFiliale: this.filiales[0].idFiliale });
//         }
//       },
//       error: (error) => {
//         this.showErrorToast('Erreur lors du chargement des filiales');
//         console.error(error);
//       }
//     });
//   }

//   loadRecruteurs(): void {
//     this.offreEmploiService.getRecruteurIds().subscribe({
//       next: (response) => {
//         if (response.success) {
//           this.recruteurs = response.data;
//         } else {
//           this.recruteurs = [];
//           this.showErrorToast(response.message || 'Erreur lors du chargement des recruteurs');
//         }
//       },
//       error: (error) => {
//         this.recruteurs = [];
//         this.showErrorToast(error.message || 'Erreur serveur lors du chargement des recruteurs');
//         console.error('Erreur détaillée :', error);
//       }
//     });
//   }

//   loadOffreDetails(id: string): void {
//     console.log('ID passé à loadOffreDetails:', id);
//     if (!id || !this.isValidGuid(id)) {
//       this.showErrorToast('ID d\'offre invalide');
//       this.loading = false;
//       return;
//     }
//     this.loading = true;
//     this.offreEmploiService.getOffreEmploi(id).subscribe({
//       next: (response) => {
//         if (response.success) {
//           this.populateFormWithOffre(response.offreEmploi);
//         } else {
//           this.showErrorToast(response.message || 'Offre non trouvée');
//         }
//         this.loading = false;
//       },
//       error: (error) => {
//         this.showErrorToast(error.message || 'Erreur lors du chargement de l\'offre');
//         this.loading = false;
//       }
//     });
//   }

//   private isValidGuid(value: string): boolean {
//     const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//     return guidRegex.test(value);
//   }

//   populateFormWithOffre(offre: any): void {
//     while (this.offreCompetences.length) {
//       this.offreCompetences.removeAt(0);
//     }

//     const datePublication = offre.datePublication ? new Date(offre.datePublication).toISOString().split('T')[0] : '';
//     const dateExpiration = offre.dateExpiration ? new Date(offre.dateExpiration).toISOString().split('T')[0] : '';

//     this.offreForm.patchValue({
//       idOffreEmploi: offre.idOffreEmploi,
//       titre: offre.titre,
//       specialite: offre.specialite,
//       description: offre.description,
//       datePublication,
//       dateExpiration,
//       salaire: offre.salaire,
//       typeContrat: offre.typeContrat,
//       nombrePostes: offre.nombrePostes,
//       modeTravail: offre.modeTravail,
//       avantages: offre.avantages,
//       statut: offre.statut,
//       niveauExperienceRequis: offre.niveauExperienceRequis,
//       diplomeRequis: offre.diplomeRequis,
//       idRecruteur: offre.idRecruteur,
//       idFiliale: offre.idFiliale
//     });

//     if (offre.offreCompetences && offre.offreCompetences.length > 0) {
//       offre.offreCompetences.forEach((oc: any) => this.offreCompetences.push(this.createCompetenceFormGroup(oc)));
//     } else {
//       this.offreCompetences.push(this.createCompetenceFormGroup());
//     }
//   }

//   createCompetenceFormGroup(competence?: any): FormGroup {
//     return this.fb.group({
//       idOffreEmploi: [competence?.idOffreEmploi || null],
//       idCompetence: [competence?.idCompetence || null],
//       niveauRequis: [competence?.niveauRequis || 'Debutant', Validators.required],
//       nom: [competence?.competence?.nom || '', Validators.required],
//       description: [competence?.competence?.description || ''],
//       estTechnique: [competence?.competence?.estTechnique || false],
//       estSoftSkill: [competence?.competence?.estSoftSkill || false]
//     });
//   }

//   addCompetence(): void {
//     this.offreCompetences.push(this.createCompetenceFormGroup());
//   }

//   removeCompetence(index: number): void {
//     if (this.offreCompetences.length > 1) {
//       Swal.fire({
//         title: 'Confirmer la suppression',
//         text: 'Voulez-vous vraiment supprimer cette compétence ?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Oui, supprimer',
//         cancelButtonText: 'Annuler'
//       }).then((result) => {
//         if (result.isConfirmed) {
//           this.offreCompetences.removeAt(index);
//           this.showSuccessToast('Compétence supprimée avec succès');
//         }
//       });
//     } else {
//       this.showWarningToast('Au moins une compétence est requise');
//     }
//   }

//   searchCompetence(event: any, index: number): void {
//     const term = event.target.value.trim();
//     if (!term || term.length < 2) {
//       this.competenceSuggestions = [];
//       this.showCompetenceSuggestions = false;
//       return;
//     }

//     this.isSearchingCompetence = true;
//     this.competenceService.searchCompetences(term).subscribe({
//       next: (response) => {
//         if (response.success) {
//           this.competenceSuggestions = response.data;
//           this.showCompetenceSuggestions = true;
//           this.activeSuggestionIndex = -1;

//           if (this.competenceSuggestions.length === 0) {
//             Swal.fire({
//               icon: 'info',
//               title: 'Compétence introuvable',
//               text: `La compétence "${term}" n'existe pas. Voulez-vous l'ajouter ?`,
//               showCancelButton: true,
//               confirmButtonText: 'Oui, ajouter',
//               cancelButtonText: 'Annuler'
//             }).then((result) => {
//               if (result.isConfirmed) {
//                 this.addNewCompetence(index);
//               }
//             });
//           }
//         } else {
//           this.competenceSuggestions = [];
//           this.showCompetenceSuggestions = true;

//           Swal.fire({
//             icon: 'info',
//             title: 'Aucune correspondance',
//             text: `Aucune compétence trouvée pour "${term}". Voulez-vous l’ajouter ?`,
//             showCancelButton: true,
//             confirmButtonText: 'Oui, ajouter',
//             cancelButtonText: 'Annuler'
//           }).then((result) => {
//             if (result.isConfirmed) {
//               this.addNewCompetence(index);
//             }
//           });
//         }
//         this.isSearchingCompetence = false;
//       },
//       error: (error) => {
//         console.error('Search error:', error);
//         this.competenceSuggestions = [];
//         this.showCompetenceSuggestions = true;
//         this.isSearchingCompetence = false;

//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur de recherche',
//           text: `Erreur lors de la recherche de "${term}". Voulez-vous l’ajouter manuellement ?`,
//           showCancelButton: true,
//           confirmButtonText: 'Oui, ajouter',
//           cancelButtonText: 'Annuler'
//         }).then((result) => {
//           if (result.isConfirmed) {
//             this.addNewCompetence(index);
//           }
//         });
//       }
//     });
//   }

//   selectCompetence(competence: any, index: number): void {
//     const competenceFormGroup = this.offreCompetences.at(index) as FormGroup;
//     competenceFormGroup.patchValue({
//       nom: competence.nom,
//       description: competence.description,
//       estTechnique: competence.estTechnique,
//       estSoftSkill: competence.estSoftSkill,
//       idCompetence: competence.id
//     });
//     this.showCompetenceSuggestions = false;
//   }

//   addNewCompetence(index: number): void {
//     const competenceFormGroup = this.offreCompetences.at(index) as FormGroup;
//     const nom = competenceFormGroup.get('nom')?.value;

//     if (!nom) {
//       this.showWarningToast('Le nom de la compétence est requis');
//       return;
//     }

//     const newCompetence = {
//       nom,
//       description: competenceFormGroup.get('description')?.value || '',
//       estTechnique: competenceFormGroup.get('estTechnique')?.value || false,
//       estSoftSkill: competenceFormGroup.get('estSoftSkill')?.value || false
//     };

//     this.competenceService.createCompetence(newCompetence).subscribe({
//       next: (response) => {
//         if (response.success) {
//           competenceFormGroup.patchValue({ idCompetence: response.data.id });
//           this.showSuccessToast('Compétence ajoutée avec succès');
//           this.showCompetenceSuggestions = false;
//         } else {
//           this.showErrorToast(response.message || 'Erreur lors de l\'ajout de la compétence');
//         }
//       },
//       error: (error) => {
//         this.showErrorToast('Erreur serveur lors de l\'ajout');
//         console.error(error);
//       }
//     });
//   }

//   handleKeyDown(event: KeyboardEvent, index: number): void {
//     if (!this.showCompetenceSuggestions || this.competenceSuggestions.length === 0) return;

//     switch (event.key) {
//       case 'ArrowDown':
//         event.preventDefault();
//         this.activeSuggestionIndex = Math.min(this.activeSuggestionIndex + 1, this.competenceSuggestions.length - 1);
//         break;
//       case 'ArrowUp':
//         event.preventDefault();
//         this.activeSuggestionIndex = Math.max(this.activeSuggestionIndex - 1, -1);
//         break;
//       case 'Enter':
//         event.preventDefault();
//         if (this.activeSuggestionIndex >= 0 && this.activeSuggestionIndex < this.competenceSuggestions.length) {
//           this.selectCompetence(this.competenceSuggestions[this.activeSuggestionIndex], index);
//         }
//         break;
//       case 'Escape':
//         event.preventDefault();
//         this.showCompetenceSuggestions = false;
//         break;
//     }
//   }

//   onSubmit(): void {
//     if (this.offreForm.invalid) {
//       this.markFormGroupTouched(this.offreForm);
//       this.showWarningToast('Veuillez corriger les erreurs du formulaire');
//       return;
//     }

//     this.loading = true;
//     const offreData = this.prepareFormData();

//     if (this.isEditMode) {
//       this.updateOffre(offreData);
//     } else {
//       this.createOffre(offreData);
//     }
//   }

//   prepareFormData(): any {
//     const formValue = this.offreForm.value;
  
//     const validCompetences = formValue.offreCompetences
//       .filter((oc: any) => oc.nom && oc.nom.trim() !== '')
//       .map((oc: any) => ({
//         idCompetence: oc.idCompetence,
//         niveauRequis: oc.niveauRequis,
//         competence: {
//           nom: oc.nom,
//           description: oc.description,
//           estTechnique: oc.estTechnique,
//           estSoftSkill: oc.estSoftSkill
//         }
//       }));
  
//     if (validCompetences.length === 0) {
//       this.showWarningToast('Au moins une compétence valide est requise');
//       this.loading = false;
//       return null;
//     }
  
//     // Construire offreData sans inclure idOffreEmploi par défaut
//     const offreData: any = {
//       titre: formValue.titre,
//       specialite: formValue.specialite,
//       description: formValue.description,
//       datePublication: formValue.datePublication,
//       dateExpiration: formValue.dateExpiration,
//       salaire: formValue.salaire,
//       typeContrat: formValue.typeContrat,
//       nombrePostes: formValue.nombrePostes,
//       modeTravail: formValue.modeTravail,
//       avantages: formValue.avantages,
//       statut: formValue.statut,
//       niveauExperienceRequis: formValue.niveauExperienceRequis,
//       diplomeRequis: formValue.diplomeRequis,
//       idRecruteur: formValue.idRecruteur,
//       idFiliale: formValue.idFiliale,
//       offreCompetences: validCompetences
//     };
  
//     // Ajouter idOffreEmploi uniquement en mode édition
//     if (this.isEditMode) {
//       offreData.idOffreEmploi = this.offreId;
//     }
  
//     console.log('Données envoyées au backend:', JSON.stringify(offreData, null, 2));
//     return offreData;
//   }

//   createOffre(offreData: any): void {
//     if (!offreData) return;

//     this.offreEmploiService.createOffreEmploi(offreData).subscribe({
//       next: (response) => {
//         if (response.success) {
//           this.showSuccessToast('Offre créée avec succès');
//           this.router.navigate(['/offres']);
//         } else {
//           this.showErrorToast(response.message || 'Erreur lors de la création');
//         }
//         this.loading = false;
//       },
//       error: (error) => {
//         this.showErrorToast(error.error?.message || 'Erreur lors de la création');
//         this.loading = false;
//       }
//     });
//   }

//   updateOffre(offreData: any): void {
//     if (!offreData) return;

//     this.offreEmploiService.updateOffreEmploi(this.offreId!, offreData).subscribe({
//       next: (response) => {
//         if (response.success) {
//           this.showSuccessToast('Offre mise à jour avec succès');
//           this.router.navigate(['/offres']);
//         } else {
//           this.showErrorToast(response.message || 'Erreur lors de la mise à jour');
//         }
//         this.loading = false;
//       },
//       error: (error) => {
//         this.showErrorToast(error.error?.message || 'Erreur lors de la mise à jour');
//         this.loading = false;
//       }
//     });
//   }

//   markFormGroupTouched(formGroup: FormGroup | FormArray): void {
//     Object.keys(formGroup.controls).forEach(key => {
//       const control = formGroup.get(key);
//       if (control instanceof FormGroup || control instanceof FormArray) {
//         this.markFormGroupTouched(control);
//       } else {
//         control?.markAsTouched();
//       }
//     });
//   }

//   cancel(): void {
//     Swal.fire({
//       title: 'Êtes-vous sûr?',
//       text: 'Toutes les modifications non enregistrées seront perdues.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Oui, quitter',
//       cancelButtonText: 'Annuler'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.router.navigate(['/offres']);
//       }
//     });
//   }

//   showSuccessToast(message: string): void {
//     Swal.fire({
//       icon: 'success',
//       title: 'Succès!',
//       text: message,
//       toast: true,
//       position: 'top-end',
//       showConfirmButton: false,
//       timer: 3000
//     });
//   }

//   showErrorToast(message: string): void {
//     Swal.fire({
//       icon: 'error',
//       title: 'Erreur',
//       text: message,
//       toast: true,
//       position: 'top-end',
//       showConfirmButton: false,
//       timer: 3000
//     });
//   }

//   showWarningToast(message: string): void {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Attention',
//       text: message,
//       toast: true,
//       position: 'top-end',
//       showConfirmButton: false,
//       timer: 3000
//     });
//   }

//   getFieldError(fieldName: string): string {
//     const control = this.offreForm.get(fieldName);
//     if (control?.invalid && (control.dirty || control.touched)) {
//       if (control.errors?.['required']) return 'Ce champ est requis';
//       if (control.errors?.['maxlength']) return `La longueur maximale est de ${control.errors['maxlength'].requiredLength} caractères`;
//       if (control.errors?.['min']) return `La valeur minimale est ${control.errors['min'].min}`;
//     }
//     return '';
//   }

//   getCompetenceFieldError(index: number, fieldName: string): string {
//     const control = this.offreCompetences.at(index).get(fieldName);
//     if (control?.invalid && (control.dirty || control.touched)) {
//       if (control.errors?.['required']) return 'Ce champ est requis';
//     }
//     return '';
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { CompetenceService } from '../../shared/services/competence.service';
import { OffreEmploi } from '../../Models/offre-emploi.model';
import { CommonModule } from '@angular/common';
import { OffreCompetence } from '../../Models/offre-competence.model';

@Component({
  selector: 'app-offre-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './offre-form.component.html',
  styles: ''
})
export class OffreFormComponent implements OnInit {
  offreForm!: FormGroup;
  isEditMode = false;
  offreId?: string;
  loading = false;
  error = '';
  filiales: any[] = [];
  recruteurs: any[] = [];
  isSearchingCompetence = false;
  showCompetenceSuggestions = false;
  activeSuggestionIndex = -1;
  competenceSuggestions: any[] = [];

  typeContrats = [
    { id: 1, name: 'CDI' },
    { id: 2, name: 'CDD' },
    { id: 3, name: 'Freelance' },
    { id: 4, name: 'Stage' }
  ];

  statuts = [
    { id: 0, name: 'Ouvert' },
    { id: 1, name: 'Fermé' }
  ];

  modesTravail = [
    { id: 0, name: 'Présentiel' },
    { id: 1, name: 'Hybride' },
    { id: 2, name: 'Télétravail' }
  ];

  niveauxCompetence = [
    { id: 'Debutant', name: 'Débutant' },
    { id: 'Intermediaire', name: 'Intermédiaire' },
    { id: 'Avance', name: 'Avancé' },
    { id: 'Expert', name: 'Expert' }
  ];

  constructor(
    private fb: FormBuilder,
    private offreEmploiService: OffreEmploiService,
    private filialeService: FilialeService,
    private competenceService: CompetenceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadFiliales();
    this.loadRecruteurs();

    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('ID dans les paramètres de route:', id);
      if (id && this.isValidGuid(id)) {
        this.isEditMode = true;
        this.offreId = id;
        if (this.offreId) {
          this.loadOffreDetails(this.offreId);
        }
      } else if (id) {
        this.showErrorToast('ID d\'offre invalide dans l\'URL');
      }
    });
  }

  initializeForm(): void {
    this.offreForm = this.fb.group({
      idOffreEmploi: [null],
      titre: ['', [Validators.required, Validators.maxLength(200)]],
      specialite: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      datePublication: [new Date().toISOString().split('T')[0], [Validators.required]],
      dateExpiration: ['', [Validators.required]],
      salaire: [0, [Validators.min(0)]],
      typeContrat: [1, [Validators.required]], // CDI par défaut
      nombrePostes: [1, [Validators.required, Validators.min(1)]],
      modeTravail: [0, [Validators.required]], // Présentiel par défaut
      avantages: [''],
      statut: [0, [Validators.required]], // Ouvert par défaut
      niveauExperienceRequis: ['', [Validators.required, Validators.maxLength(50)]],
      diplomeRequis: ['', [Validators.maxLength(100)]],
      idRecruteur: ['', [Validators.required]],
      idFiliale: ['', [Validators.required]],
      offreCompetences: this.fb.array([this.createCompetenceFormGroup()])
    });
  }

  get offreCompetences(): FormArray {
    return this.offreForm.get('offreCompetences') as FormArray;
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (response) => {
        this.filiales = response;
        if (this.filiales.length === 1) {
          this.offreForm.patchValue({ idFiliale: this.filiales[0].idFiliale });
        }
      },
      error: (error) => {
        this.showErrorToast('Erreur lors du chargement des filiales');
        console.error(error);
      }
    });
  }

  loadRecruteurs(): void {
    this.offreEmploiService.getRecruteurIds().subscribe({
      next: (response) => {
        if (response.success) {
          this.recruteurs = response.data;
        } else {
          this.recruteurs = [];
          this.showErrorToast(response.message || 'Erreur lors du chargement des recruteurs');
        }
      },
      error: (error) => {
        this.recruteurs = [];
        this.showErrorToast(error.message || 'Erreur serveur lors du chargement des recruteurs');
        console.error('Erreur détaillée :', error);
      }
    });
  }

  loadOffreDetails(id: string): void {
    console.log('ID passé à loadOffreDetails:', id);
    if (!id || !this.isValidGuid(id)) {
      this.showErrorToast('ID d\'offre invalide');
      this.loading = false;
      return;
    }
    this.loading = true;
    this.offreEmploiService.getOffreEmploi(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.populateFormWithOffre(response.offreEmploi);
        } else {
          this.showErrorToast(response.message || 'Offre non trouvée');
        }
        this.loading = false;
      },
      error: (error) => {
        this.showErrorToast(error.message || 'Erreur lors du chargement de l\'offre');
        this.loading = false;
      }
    });
  }

  private isValidGuid(value: string): boolean {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(value);
  }

  populateFormWithOffre(offre: any): void {
    while (this.offreCompetences.length) {
      this.offreCompetences.removeAt(0);
    }

    const datePublication = offre.datePublication ? new Date(offre.datePublication).toISOString().split('T')[0] : '';
    const dateExpiration = offre.dateExpiration ? new Date(offre.dateExpiration).toISOString().split('T')[0] : '';

    this.offreForm.patchValue({
      idOffreEmploi: offre.idOffreEmploi,
      titre: offre.titre,
      specialite: offre.specialite,
      description: offre.description,
      datePublication,
      dateExpiration,
      salaire: offre.salaire,
      typeContrat: offre.typeContrat,
      nombrePostes: offre.nombrePostes,
      modeTravail: offre.modeTravail,
      avantages: offre.avantages,
      statut: offre.statut,
      niveauExperienceRequis: offre.niveauExperienceRequis,
      diplomeRequis: offre.diplomeRequis,
      idRecruteur: offre.idRecruteur,
      idFiliale: offre.idFiliale
    });

    if (offre.offreCompetences && offre.offreCompetences.length > 0) {
      offre.offreCompetences.forEach((oc: any) => this.offreCompetences.push(this.createCompetenceFormGroup(oc)));
    } else {
      this.offreCompetences.push(this.createCompetenceFormGroup());
    }
  }

  createCompetenceFormGroup(competence?: any): FormGroup {
    return this.fb.group({
      idOffreEmploi: [competence?.idOffreEmploi || null],
      idCompetence: [competence?.idCompetence || null],
      niveauRequis: [competence?.niveauRequis || 'Debutant', Validators.required],
      nom: [competence?.competence?.nom || '', Validators.required],
      description: [competence?.competence?.description || ''],
      estTechnique: [competence?.competence?.estTechnique || false],
      estSoftSkill: [competence?.competence?.estSoftSkill || false]
    });
  }

  addCompetence(): void {
    this.offreCompetences.push(this.createCompetenceFormGroup());
  }

  removeCompetence(index: number): void {
    if (this.offreCompetences.length > 1) {
      Swal.fire({
        title: 'Confirmer la suppression',
        text: 'Voulez-vous vraiment supprimer cette compétence ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.offreCompetences.removeAt(index);
          this.showSuccessToast('Compétence supprimée avec succès');
        }
      });
    } else {
      this.showWarningToast('Au moins une compétence est requise');
    }
  }

  searchCompetence(event: any, index: number): void {
    const term = event.target.value.trim();
    if (!term || term.length < 2) {
      this.competenceSuggestions = [];
      this.showCompetenceSuggestions = false;
      return;
    }

    this.isSearchingCompetence = true;
    this.competenceService.searchCompetences(term).subscribe({
      next: (response) => {
        if (response.success) {
          this.competenceSuggestions = response.data;
          this.showCompetenceSuggestions = true;
          this.activeSuggestionIndex = -1;

          if (this.competenceSuggestions.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Compétence introuvable',
              text: `La compétence "${term}" n'existe pas. Voulez-vous l'ajouter ?`,
              showCancelButton: true,
              confirmButtonText: 'Oui, ajouter',
              cancelButtonText: 'Annuler'
            }).then((result) => {
              if (result.isConfirmed) {
                this.addNewCompetence(index);
              }
            });
          }
        } else {
          this.competenceSuggestions = [];
          this.showCompetenceSuggestions = true;

          Swal.fire({
            icon: 'info',
            title: 'Aucune correspondance',
            text: `Aucune compétence trouvée pour "${term}". Voulez-vous l’ajouter ?`,
            showCancelButton: true,
            confirmButtonText: 'Oui, ajouter',
            cancelButtonText: 'Annuler'
          }).then((result) => {
            if (result.isConfirmed) {
              this.addNewCompetence(index);
            }
          });
        }
        this.isSearchingCompetence = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.competenceSuggestions = [];
        this.showCompetenceSuggestions = true;
        this.isSearchingCompetence = false;

        Swal.fire({
          icon: 'error',
          title: 'Erreur de recherche',
          text: `Erreur lors de la recherche de "${term}". Voulez-vous l’ajouter manuellement ?`,
          showCancelButton: true,
          confirmButtonText: 'Oui, ajouter',
          cancelButtonText: 'Annuler'
        }).then((result) => {
          if (result.isConfirmed) {
            this.addNewCompetence(index);
          }
        });
      }
    });
  }

  selectCompetence(competence: any, index: number): void {
    const competenceFormGroup = this.offreCompetences.at(index) as FormGroup;
    competenceFormGroup.patchValue({
      nom: competence.nom,
      description: competence.description,
      estTechnique: competence.estTechnique,
      estSoftSkill: competence.estSoftSkill,
      idCompetence: competence.id
    });
    this.showCompetenceSuggestions = false;
  }

  addNewCompetence(index: number): void {
    const competenceFormGroup = this.offreCompetences.at(index) as FormGroup;
    const nom = competenceFormGroup.get('nom')?.value;

    if (!nom) {
      this.showWarningToast('Le nom de la compétence est requis');
      return;
    }

    const newCompetence = {
      nom,
      description: competenceFormGroup.get('description')?.value || '',
      estTechnique: competenceFormGroup.get('estTechnique')?.value || false,
      estSoftSkill: competenceFormGroup.get('estSoftSkill')?.value || false
    };

    this.competenceService.createCompetence(newCompetence).subscribe({
      next: (response) => {
        if (response.success) {
          competenceFormGroup.patchValue({ idCompetence: response.data.id });
          this.showSuccessToast('Compétence ajoutée avec succès');
          this.showCompetenceSuggestions = false;
        } else {
          this.showErrorToast(response.message || 'Erreur lors de l\'ajout de la compétence');
        }
      },
      error: (error) => {
        this.showErrorToast('Erreur serveur lors de l\'ajout');
        console.error(error);
      }
    });
  }

  handleKeyDown(event: KeyboardEvent, index: number): void {
    if (!this.showCompetenceSuggestions || this.competenceSuggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeSuggestionIndex = Math.min(this.activeSuggestionIndex + 1, this.competenceSuggestions.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeSuggestionIndex = Math.max(this.activeSuggestionIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.activeSuggestionIndex >= 0 && this.activeSuggestionIndex < this.competenceSuggestions.length) {
          this.selectCompetence(this.competenceSuggestions[this.activeSuggestionIndex], index);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.showCompetenceSuggestions = false;
        break;
    }
  }

  onSubmit(): void {
    if (this.offreForm.invalid) {
      this.markFormGroupTouched(this.offreForm);
      this.showWarningToast('Veuillez corriger les erreurs du formulaire');
      return;
    }

    this.loading = true;
    const offreData = this.prepareFormData();

    if (this.isEditMode) {
      this.updateOffre(offreData);
    } else {
      this.createOffre(offreData);
    }
  }

  prepareFormData(): any {
    const formValue = this.offreForm.value;

    const validCompetences = formValue.offreCompetences
      .filter((oc: any) => oc.nom && oc.nom.trim() !== '')
      .map((oc: any) => ({
        idCompetence: oc.idCompetence,
        niveauRequis: oc.niveauRequis,
        competence: {
          nom: oc.nom,
          description: oc.description,
          estTechnique: oc.estTechnique,
          estSoftSkill: oc.estSoftSkill
        }
      }));

    if (validCompetences.length === 0) {
      this.showWarningToast('Au moins une compétence valide est requise');
      this.loading = false;
      return null;
    }

    const offreData: any = {
      titre: formValue.titre,
      specialite: formValue.specialite,
      description: formValue.description,
      datePublication: formValue.datePublication,
      dateExpiration: formValue.dateExpiration,
      salaire: formValue.salaire,
      typeContrat: formValue.typeContrat,
      nombrePostes: formValue.nombrePostes,
      modeTravail: formValue.modeTravail,
      avantages: formValue.avantages,
      statut: formValue.statut,
      niveauExperienceRequis: formValue.niveauExperienceRequis,
      diplomeRequis: formValue.diplomeRequis,
      idRecruteur: formValue.idRecruteur,
      idFiliale: formValue.idFiliale,
      offreCompetences: validCompetences
    };

    if (this.isEditMode) {
      offreData.idOffreEmploi = this.offreId;
    }

    console.log('Données envoyées au backend:', JSON.stringify(offreData, null, 2));
    return offreData;
  }

  createOffre(offreData: any): void {
    if (!offreData) return;

    this.offreEmploiService.createOffreEmploi(offreData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccessToast('Offre créée avec succès');
          this.router.navigate(['/offres']);
        } else {
          this.showErrorToast(response.message || 'Erreur lors de la création');
        }
        this.loading = false;
      },
      error: (error) => {
        this.showErrorToast(error.error?.message || 'Erreur lors de la création');
        this.loading = false;
      }
    });
  }

  updateOffre(offreData: any): void {
    if (!offreData) return;

    this.offreEmploiService.updateOffreEmploi(this.offreId!, offreData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccessToast('Offre mise à jour avec succès');
          this.router.navigate(['/offres']);
        } else {
          this.showErrorToast(response.message || 'Erreur lors de la mise à jour');
        }
        this.loading = false;
      },
      error: (error) => {
        this.showErrorToast(error.error?.message || 'Erreur lors de la mise à jour');
        this.loading = false;
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  cancel(): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Toutes les modifications non enregistrées seront perdues.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, quitter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/offres']);
      }
    });
  }

  showSuccessToast(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Succès!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showErrorToast(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showWarningToast(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Attention',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.offreForm.get(fieldName);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return 'Ce champ est requis';
      if (control.errors?.['maxlength']) return `La longueur maximale est de ${control.errors['maxlength'].requiredLength} caractères`;
      if (control.errors?.['min']) return `La valeur minimale est ${control.errors['min'].min}`;
    }
    return '';
  }

  getCompetenceFieldError(index: number, fieldName: string): string {
    const control = this.offreCompetences.at(index).get(fieldName);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return 'Ce champ est requis';
    }
    return '';
  }
}