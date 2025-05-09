// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import Swal from 'sweetalert2';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { CompetenceService } from '../../shared/services/competence.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-offre-form',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './offre-form.component.html',
//   styleUrls: ['./offre-form.component.css']
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

//   typeContrats: string[] = [];
//   statuts: string[] = [];
//   modesTravail: string[] = [];
//   niveauxCompetence: string[] = [];

//   constructor(
//     private fb: FormBuilder,
//     private offreEmploiService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private competenceService: CompetenceService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadLists();
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

//   loadLists(): void {
//     this.offreEmploiService.getTypesContrat().subscribe({
//       next: (types) => {
//         this.typeContrats = types;
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des types de contrat', error);
//         this.showErrorToast('Échec du chargement des types de contrat');
//       }
//     });

//     this.offreEmploiService.getStatuts().subscribe({
//       next: (statuts) => {
//         this.statuts = statuts;
//         console.log('Statuts chargés:', this.statuts);
//         // Ensure the statuts match the expected values
//         if (!this.statuts.includes('Ouvert')) {
//           this.statuts.push('Ouvert');
//         }
//         if (!this.statuts.includes('cloturer')) {
//           this.statuts.push('cloturer');
//         }
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des statuts', error);
//         this.showErrorToast('Échec du chargement des statuts');
//       }
//     });

//     this.offreEmploiService.getModesTravail().subscribe({
//       next: (modes) => {
//         this.modesTravail = modes;
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des modes de travail', error);
//         this.showErrorToast('Échec du chargement des modes de travail');
//       }
//     });

//     this.offreEmploiService.getNiveauxRequis().subscribe({
//       next: (niveaux) => {
//         this.niveauxCompetence = niveaux;
//         this.offreCompetences.controls.forEach((control, index) => {
//           const niveau = control.get('niveauRequis')?.value;
//           if (!niveau && this.niveauxCompetence.length > 0) {
//             this.offreCompetences.at(index).patchValue({ niveauRequis: this.niveauxCompetence[0] });
//           }
//         });
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des niveaux requis', error);
//         this.showErrorToast('Échec du chargement des niveaux requis');
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
//       salaireMin: [null, [Validators.min(0)]],
//       salaireMax: [null, [Validators.min(0)]],
//       typeContrat: ['', [Validators.required]],
//       nombrePostes: [1, [Validators.required, Validators.min(1)]],
//       modeTravail: ['', [Validators.required]],
//       avantages: [''],
//       statut: ['Ouvert', [Validators.required]], // Default to 'Ouvert'
//       niveauExperienceRequis: ['', [Validators.required, Validators.maxLength(50)]],
//       diplomeRequis: ['', [Validators.maxLength(100)]],
//       idRecruteur: ['', [Validators.required]],
//       idFiliale: ['', [Validators.required]],
//       offreCompetences: this.fb.array([this.createCompetenceFormGroup()])
//     }, { validators: this.salaryRangeValidator });
//   }

//   salaryRangeValidator(form: FormGroup): { [key: string]: any } | null {
//     const salaireMin = form.get('salaireMin')?.value;
//     const salaireMax = form.get('salaireMax')?.value;
//     if (salaireMin != null && salaireMax != null && salaireMin > salaireMax) {
//       return { invalidSalaryRange: 'Le salaire minimum ne peut pas être supérieur au salaire maximum' };
//     }
//     return null;
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
//         if (response) {
//           this.recruteurs = response.data;
//           console.log('Recruteurs chargés:', this.recruteurs);
//         } else {
//           this.recruteurs = [];
//           this.showErrorToast(response.message || 'Erreur lors du chargement des recruteurs');
//         }
//       },
//       error: (error) => {
//         this.recruteurs = [];
//         this.showErrorToast(error.message || 'Erreur serveur lors du chargement des recruteurs');
//         console.error('Erreur détaillée:', error);
//       }
//     });
//   }

//   loadOffreDetails(id: string): void {
//     console.log('Chargement des détails de l\'offre ID:', id);
//     if (!id || !this.isValidGuid(id)) {
//       this.showErrorToast('ID d\'offre invalide');
//       this.loading = false;
//       return;
//     }
//     this.loading = true;
//     this.offreEmploiService.getOffreEmploi(id).subscribe({
//       next: (response) => {
//         console.log('Réponse complète de getOffreEmploi:', response);
//         if (response && response.idOffreEmploi) {
//           this.populateFormWithOffre(response);
//         } else {
//           this.showErrorToast('Offre non trouvée');
//         }
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Erreur détaillée lors du chargement:', error);
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
//     console.log('Données de l\'offre pour édition:', offre);
//     while (this.offreCompetences.length) {
//       this.offreCompetences.removeAt(0);
//     }

//     const datePublication = offre.datePublication ? new Date(offre.datePublication).toISOString().split('T')[0] : '';
//     const dateExpiration = offre.dateExpiration ? new Date(offre.dateExpiration).toISOString().split('T')[0] : '';

//     const typeContratReverseMap: { [key: number]: string } = {
//       1: 'CDI',
//       2: 'CDD',
//       3: 'Freelance',
//       4: 'Stage'
//     };

//     const statutReverseMap: { [key: number]: string } = {
//       0: 'Ouvert',
//       1: 'cloturer'
//     };

//     const modeTravailReverseMap: { [key: number]: string } = {
//       1: 'Presentiel',
//       2: 'Hybride',
//       3: 'Teletravail'
//     };

//     const typeContratValue = typeContratReverseMap[offre.typeContrat] || '';
//     const statutValue = statutReverseMap[offre.statut] || offre.statut || 'Ouvert';
//     const modeTravailValue = modeTravailReverseMap[offre.modeTravail] || '';

//     if (!typeContratValue) {
//       console.warn(`TypeContrat non mappé: ${offre.typeContrat}`);
//     }
//     if (!statutValue) {
//       console.warn(`Statut non mappé: ${offre.statut}`);
//     }
//     if (!modeTravailValue) {
//       console.warn(`ModeTravail non mappé: ${offre.modeTravail}`);
//     }

//     this.offreForm.patchValue({
//       idOffreEmploi: offre.idOffreEmploi,
//       titre: offre.titre || '',
//       specialite: offre.specialite || '',
//       description: offre.description || '',
//       datePublication,
//       dateExpiration,
//       salaireMin: offre.salaireMin || null,
//       salaireMax: offre.salaireMax || null,
//       typeContrat: typeContratValue,
//       nombrePostes: offre.nombrePostes || 1,
//       modeTravail: modeTravailValue,
//       avantages: offre.avantages || '',
//       statut: statutValue,
//       niveauExperienceRequis: offre.niveauExperienceRequis || '',
//       diplomeRequis: offre.diplomeRequis || '',
//       idRecruteur: offre.idRecruteur || '',
//       idFiliale: offre.idFiliale || ''
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
//       niveauRequis: [competence?.niveauRequis || (this.niveauxCompetence.length > 0 ? this.niveauxCompetence[0] : ''), Validators.required],
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
//         this.isSearchingCompetence = false;
//         if (response.success) {
//           this.competenceSuggestions = response.data;
//           if (this.competenceSuggestions.length === 0) {
//             this.competenceSuggestions.push({
//               nom: `Ajouter "${term}" comme nouvelle compétence`,
//               isNew: true,
//               term: term
//             });
//           }
//           this.showCompetenceSuggestions = true;
//           this.activeSuggestionIndex = -1;
//         } else {
//           this.competenceSuggestions = [{
//             nom: `Ajouter "${term}" comme nouvelle compétence`,
//             isNew: true,
//             term: term
//           }];
//           this.showCompetenceSuggestions = true;
//           this.activeSuggestionIndex = -1;
//         }
//       },
//       error: (error) => {
//         console.error('Erreur recherche compétence:', error);
//         this.isSearchingCompetence = false;
//         this.competenceSuggestions = [{
//           nom: `Ajouter "${term}" comme nouvelle compétence`,
//           isNew: true,
//           term: term
//         }];
//         this.showCompetenceSuggestions = true;
//         this.activeSuggestionIndex = -1;
//       }
//     });
//   }

//   selectCompetence(competence: any, index: number): void {
//     const competenceFormGroup = this.offreCompetences.at(index) as FormGroup;

//     if (competence.isNew) {
//       this.addNewCompetence(index, competence.term);
//       return;
//     }

//     competenceFormGroup.patchValue({
//       nom: competence.nom,
//       description: competence.description,
//       estTechnique: competence.estTechnique,
//       estSoftSkill: competence.estSoftSkill,
//       idCompetence: competence.id
//     });
//     this.showCompetenceSuggestions = false;
//   }

//   addNewCompetence(index: number, term: string): void {
//     const competenceFormGroup = this.offreCompetences.at(index) as FormGroup;
//     const nom = term;

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
//           competenceFormGroup.patchValue({
//             idCompetence: response.data.id,
//             nom: response.data.nom,
//             description: response.data.description,
//             estTechnique: response.data.estTechnique,
//             estSoftSkill: response.data.estSoftSkill
//           });
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

//     if (!offreData) {
//       this.loading = false;
//       return;
//     }

//     if (this.isEditMode) {
//       this.updateOffre(offreData);
//     } else {
//       this.createOffre(offreData);
//     }
//   }

//   prepareFormData(): any {
//     const formValue = this.offreForm.value;

//     const typeContratMap: { [key: string]: number } = {
//       'CDI': 1,
//       'CDD': 2,
//       'Freelance': 3,
//       'Stage': 4
//     };

//     const statutMap: { [key: string]: number } = {
//       'Ouvert': 0,
//       'cloturer': 1
//     };

//     const modeTravailMap: { [key: string]: number } = {
//       'Presentiel': 1,
//       'Hybride': 2,
//       'Teletravail': 3
//     };

//     const validCompetences = formValue.offreCompetences
//       .filter((oc: any) => oc.nom && oc.nom.trim() !== '')
//       .map((oc: any) => {
//         if (!oc.idCompetence) {
//           console.warn('Compétence sans idCompetence:', oc);
//         }
//         return {
//           idCompetence: oc.idCompetence,
//           niveauRequis: oc.niveauRequis,
//           competence: {
//             nom: oc.nom,
//             description: oc.description,
//             estTechnique: oc.estTechnique,
//             estSoftSkill: oc.estSoftSkill
//           }
//         };
//       });

//     if (validCompetences.length === 0) {
//       this.showWarningToast('Au moins une compétence valide est requise');
//       return null;
//     }

//     const typeContratNumeric = typeContratMap[formValue.typeContrat];
//     if (!typeContratNumeric) {
//       this.showWarningToast('Type de contrat invalide. Veuillez sélectionner une valeur valide.');
//       return null;
//     }

//     const statutNumeric = statutMap[formValue.statut];
//     if (statutNumeric === undefined) {
//       this.showWarningToast('Statut invalide. Veuillez sélectionner une valeur valide.');
//       return null;
//     }

//     const modeTravailNumeric = modeTravailMap[formValue.modeTravail];
//     if (!modeTravailNumeric) {
//       this.showWarningToast('Mode de travail invalide. Veuillez sélectionner une valeur valide.');
//       return null;
//     }

//     const offreData: any = {
//       titre: formValue.titre,
//       specialite: formValue.specialite,
//       description: formValue.description,
//       datePublication: new Date(formValue.datePublication).toISOString(),
//       dateExpiration: new Date(formValue.dateExpiration).toISOString(),
//       salaireMin: formValue.salaireMin,
//       salaireMax: formValue.salaireMax,
//       typeContrat: typeContratNumeric,
//       nombrePostes: formValue.nombrePostes,
//       modeTravail: modeTravailNumeric,
//       avantages: formValue.avantages,
//       statut: statutNumeric,
//       niveauExperienceRequis: formValue.niveauExperienceRequis,
//       diplomeRequis: formValue.diplomeRequis,
//       idRecruteur: formValue.idRecruteur,
//       idFiliale: formValue.idFiliale,
//       offreCompetences: validCompetences
//     };

//     if (this.isEditMode) {
//       offreData.idOffreEmploi = this.offreId;
//     }

//     console.log('Données préparées pour envoi:', JSON.stringify(offreData, null, 2));
//     return offreData;
//   }

//   createOffre(offreData: any): void {
//     console.log('Création de l\'offre avec données:', offreData);
//     this.offreEmploiService.createOffreEmploi(offreData).subscribe({
//       next: (response) => {
//         console.log('Réponse création:', response);
//         if (response.success) {
//           this.showSuccessToast('Offre créée avec succès');
//           this.router.navigate(['/offres']);
//         } else {
//           this.showErrorToast(response.message || 'Erreur lors de la création');
//         }
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Erreur création:', JSON.stringify(error, null, 2));
//         this.showErrorToast(error.error?.message || 'Erreur lors de la création');
//         this.loading = false;
//       }
//     });
//   }

//   updateOffre(offreData: any): void {
//     if (!this.offreId) {
//       this.showErrorToast('ID de l\'offre manquant');
//       this.loading = false;
//       return;
//     }
//     console.log('Mise à jour de l\'offre ID:', this.offreId, 'avec données:', offreData);
//     this.offreEmploiService.updateOffreEmploi(this.offreId, offreData).subscribe({
//       next: (response) => {
//         console.log('Réponse mise à jour:', response);
//         if (response.success) {
//           this.showSuccessToast('Offre mise à jour avec succès');
//           this.router.navigate(['/offres']);
//         } else {
//           this.showErrorToast(response.message || 'Erreur lors de la mise à jour');
//         }
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Erreur mise à jour:', JSON.stringify(error, null, 2));
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
//       cancelButtonText: 'Annuler',
//       position: 'center',
//       width: '500px',
//       customClass: {
//         popup: 'swal-large'
//       }
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
//       position: 'center',
//       showConfirmButton: false,
//       timer: 3000,
//       width: '500px',
//       customClass: {
//         popup: 'swal-large'
//       }
//     });
//   }

//   showErrorToast(message: string): void {
//     Swal.fire({
//       icon: 'error',
//       title: 'Erreur',
//       text: message,
//       position: 'center',
//       showConfirmButton: false,
//       timer: 3000,
//       width: '500px',
//       customClass: {
//         popup: 'swal-large'
//       }
//     });
//   }

//   showWarningToast(message: string): void {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Attention',
//       text: message,
//       position: 'center',
//       showConfirmButton: false,
//       timer: 3000,
//       width: '500px',
//       customClass: {
//         popup: 'swal-large'
//       }
//     });
//   }

//   getFieldError(fieldName: string): string {
//     const control = this.offreForm.get(fieldName);
//     if (control?.invalid && (control.dirty || control.touched)) {
//       if (control.errors?.['required']) return 'Ce champ est requis';
//       if (control.errors?.['maxlength']) return `La longueur maximale est de ${control.errors['maxlength'].requiredLength} caractères`;
//       if (control.errors?.['min']) return `La valeur minimale est ${control.errors['min'].min}`;
//     }
//     if (this.offreForm.errors?.['invalidSalaryRange'] && (fieldName === 'salaireMin' || fieldName === 'salaireMax')) {
//       return 'Le salaire minimum ne peut pas être supérieur au salaire maximum';
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