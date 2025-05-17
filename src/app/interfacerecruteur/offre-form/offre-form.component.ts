// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { DepartementService } from '../../shared/services/departement.service';
// import { OffreMissionService } from '../../shared/services/offre-mission.service';
// import { LangueService } from '../../shared/services/langue.service';
// import { OffreCompetenceService } from '../../shared/services/offre-competence.service';
// import { DiplomeService } from '../../shared/services/diplome.service';
// import { AuthService } from '../../shared/services/auth.service';

// import { ModeTravail, StatutOffre, TypeContratEnum, NiveauRequisType } from '../../Models/enums.model';
// import Swal from 'sweetalert2';
// import { AppUser } from '../../Models/Candidature.model';
// import { Filiale } from '../../Models/filiale.model';
// import { Departement } from '../../Models/departement';
// import { Diplome, OffreLangue, OffreMission, Poste } from '../../Models/offre-emploi.model';
// import { OffreCompetence } from '../../Models/offre-competence.model';
// import { HttpHeaders } from '@angular/common/http';
// import { User } from '../../Models/user.model';
// import { Recruiter } from '../../Models/recruiter.model';

// @Component({
//   selector: 'app-offre-form',
//   standalone: true,
//   imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './offre-form.component.html',
//   styleUrls: ['./offre-form.component.css']
// })
// export class OffreFormComponent implements OnInit {
//   offreForm: FormGroup;
//   filiales: Filiale[] = [];
//   departements: Departement[] = [];
//   recruteurs: AppUser[] = [];
//   diplomes: Diplome[] = [];
//   competences: any[] = [];
//   typeContrats = Object.values(TypeContratEnum);
//   statuts = Object.values(StatutOffre);
//   modesTravail = Object.values(ModeTravail);
//   niveauxRequis = Object.values(NiveauRequisType);
//   isEditMode = false;
//   offerId: string | null = null;
// recruteursTemp: any[] = []; // Utilisez any temporairement
// recruteurstemp: { id: any; fullName: string; }[] = [];

//   constructor(
//     private fb: FormBuilder,
//     private offreService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private departementService: DepartementService,
//     private missionService: OffreMissionService,
//     private langueService: LangueService,
//     private competenceService: OffreCompetenceService,
//     private diplomeService: DiplomeService,
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.offreForm = this.fb.group({
//       specialite: ['', Validators.required],
//       dateExpiration: ['', Validators.required],
//       salaireMin: [0, [Validators.required, Validators.min(0)]],
//       salaireMax: [0, [Validators.required, Validators.min(0)]],
//       niveauExperienceRequis: ['', Validators.required],
//       typeContrat: ['', Validators.required],
//       statut: ['', Validators.required],
//       modeTravail: ['', Validators.required],
//       estActif: [true],
//       avantages: [''],
//       idFiliale: ['', Validators.required],
//       idDepartement: ['', Validators.required],
//       idRecruteur: ['', Validators.required],
//       postes: this.fb.array([]),
//       offreMissions: this.fb.array([]),
//       offreLangues: this.fb.array([]),
//       offreCompetences: this.fb.array([]),
//       diplomeIds: this.fb.array([], Validators.required)
//     });
//   }

//   ngOnInit(): void {
//     this.loadInitialData();
//     this.offerId = this.route.snapshot.paramMap.get('id');
//     if (this.offerId) {
//       this.isEditMode = true;
//       this.loadOffre(this.offerId);
//     } else {
//       this.addPoste();
//       this.addMission();
//       this.addLangue();
//       this.addCompetence();
//       this.addDiplome();
//     }
//   }

//   private loadInitialData(): void {
//     this.loadFiliales();
//     this.loadDepartements();
//     this.loadRecruteursSimple();
//     this.loadDiplomes();
//     this.loadCompetences();
//   }

//   private getAuthHeader(): HttpHeaders {
//     return new HttpHeaders({
//       'Authorization': `Bearer ${this.authService.getToken()}`
//     });
//   }

//   loadFiliales(): void {
//     this.filialeService.getFiliales().subscribe({
//       next: (filiales) => this.filiales = filiales,
//       error: (error) => this.handleError('Échec du chargement des filiales', error)
//     });
//   }

//   loadDepartements(): void {
//     this.departementService.getDepartements().subscribe({
//       next: (departements) => this.departements = departements,
//       error: (error) => this.handleError('Échec du chargement des départements', error)
//     });
//   }

// loadRecruteursSimple(): void {
//   this.offreService.getRecruitersSimple().subscribe({
//     next: (data) => {
//      this.recruteurstemp = data.map(item => ({
//   id: item.Id,
//   fullName: item.FullName
// }));
//     }
//   });
// }
//   loadDiplomes(): void {
//     this.diplomeService.getAll().subscribe({
//       next: (response) => {
//         if (response?.data) {
//           this.diplomes = response.data;
//         } else {
//           this.diplomes = [];
//           console.warn('Aucune donnée de diplôme reçue');
//         }
//       },
//       error: (error) => this.handleError('Échec du chargement des diplômes', error)
//     });
//   }

//   loadCompetences(): void {
//     this.competenceService.getAll().subscribe({
//       next: (competences) => this.competences = competences,
//       error: (error) => this.handleError('Échec du chargement des compétences', error)
//     });
//   }

//   loadOffre(id: string): void {
//     this.offreService.getById(id).subscribe({
//       next: (offre) => {
//         this.patchFormValues(offre);
//         this.loadFormArrays(offre);
//       },
//       error: (error) => this.handleError('Échec du chargement de l\'offre', error)
//     });
//   }

//   private patchFormValues(offre: any): void {
//     this.offreForm.patchValue({
//       specialite: offre.specialite,
//       dateExpiration: offre.dateExpiration,
//       salaireMin: offre.salaireMin,
//       salaireMax: offre.salaireMax,
//       niveauExperienceRequis: offre.niveauExperienceRequis,
//       typeContrat: offre.typeContrat,
//       statut: offre.statut,
//       modeTravail: offre.modeTravail,
//       estActif: offre.estActif,
//       avantages: offre.avantages,
//       idFiliale: offre.idFiliale,
//       idDepartement: offre.idDepartement,
//       idRecruteur: offre.idRecruteur
//     });
//   }

//   private loadFormArrays(offre: any): void {
//     // Postes
//     const postesArray = this.postes;
//     postesArray.clear();
//     offre.postes.forEach((poste: Poste) => {
//       postesArray.push(this.createPosteFormGroup(poste));
//     });

//     // Missions
//     const missionsArray = this.offreMissions;
//     missionsArray.clear();
//     offre.offreMissions.forEach((mission: OffreMission) => {
//       missionsArray.push(this.createMissionFormGroup(mission));
//     });

//     // Langues
//     const languesArray = this.offreLangues;
//     languesArray.clear();
//     offre.offreLangues.forEach((langue: OffreLangue) => {
//       languesArray.push(this.createLangueFormGroup(langue));
//     });

//     // Compétences
//     const competencesArray = this.offreCompetences;
//     competencesArray.clear();
//     offre.offreCompetences.forEach((competence: OffreCompetence) => {
//       competencesArray.push(this.createCompetenceFormGroup(competence));
//     });

//     // Diplômes
//     const diplomesArray = this.diplomeIds;
//     diplomesArray.clear();
//     if (offre.diplomeIds && offre.diplomeIds.length > 0) {
//       offre.diplomeIds.forEach((diplomeId: string) => {
//         diplomesArray.push(this.fb.control(diplomeId));
//       });
//     } else {
//       this.addDiplome();
//     }
//   }

//   // Form Array Getters
//   get postes(): FormArray {
//     return this.offreForm.get('postes') as FormArray;
//   }

//   get offreMissions(): FormArray {
//     return this.offreForm.get('offreMissions') as FormArray;
//   }

//   get offreLangues(): FormArray {
//     return this.offreForm.get('offreLangues') as FormArray;
//   }

//   get offreCompetences(): FormArray {
//     return this.offreForm.get('offreCompetences') as FormArray;
//   }

//   get diplomeIds(): FormArray {
//     return this.offreForm.get('diplomeIds') as FormArray;
//   }

//   // Form Group Creators
//   createPosteFormGroup(poste?: Poste): FormGroup {
//     return this.fb.group({
//       titrePoste: [poste?.titrePoste || '', Validators.required],
//       description: [poste?.description || '', Validators.required],
//       nombrePostes: [poste?.nombrePostes || 1, [Validators.required, Validators.min(1)]],
//       experienceSouhaitee: [poste?.experienceSouhaitee || '', Validators.required],
//       niveauHierarchique: [poste?.niveauHierarchique || '', Validators.required]
//     });
//   }

//   createMissionFormGroup(mission?: OffreMission): FormGroup {
//     return this.fb.group({
//       descriptionMission: [mission?.descriptionMission || '', Validators.required],
//       priorite: [mission?.priorite || 0, [Validators.required, Validators.min(0)]]
//     });
//   }

//   createLangueFormGroup(langue?: OffreLangue): FormGroup {
//     return this.fb.group({
//       langue: [langue?.langue || '', Validators.required],
//       niveauRequis: [langue?.niveauRequis || '', Validators.required]
//     });
//   }

//   createCompetenceFormGroup(competence?: OffreCompetence): FormGroup {
//     return this.fb.group({
//       idCompetence: [competence?.idCompetence || '', Validators.required],
//       niveauRequis: [competence?.niveauRequis || '', Validators.required]
//     });
//   }

//   // Add/Remove Methods
//   addPoste(): void {
//     this.postes.push(this.createPosteFormGroup());
//   }

//   removePoste(index: number): void {
//     if (this.postes.length > 1) {
//       this.postes.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Vous devez avoir au moins un poste', 'info');
//     }
//   }

//   addMission(): void {
//     this.offreMissions.push(this.createMissionFormGroup());
//   }

//   removeMission(index: number): void {
//     if (this.offreMissions.length > 1) {
//       this.offreMissions.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Vous devez avoir au moins une mission', 'info');
//     }
//   }

//   addLangue(): void {
//     this.offreLangues.push(this.createLangueFormGroup());
//   }

//   removeLangue(index: number): void {
//     this.offreLangues.removeAt(index);
//   }

//   addCompetence(): void {
//     this.offreCompetences.push(this.createCompetenceFormGroup());
//   }

//   removeCompetence(index: number): void {
//     this.offreCompetences.removeAt(index);
//   }

//   addDiplome(): void {
//     this.diplomeIds.push(this.fb.control('', Validators.required));
//   }

//   removeDiplome(index: number): void {
//     if (this.diplomeIds.length > 1) {
//       this.diplomeIds.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Vous devez avoir au moins un diplôme', 'info');
//     }
//   }

//   // Form Submission
//   onSubmit(): void {
//     if (this.offreForm.invalid) {
//       this.markAllAsTouched();
//       Swal.fire('Erreur', 'Veuillez remplir tous les champs requis correctement.', 'error');
//       return;
//     }

//     const formValue = this.prepareSubmitData();
    
//     if (this.isEditMode) {
//       this.updateOffre(formValue);
//     } else {
//       this.createOffre(formValue);
//     }
//   }

//   private markAllAsTouched(): void {
//     Object.values(this.offreForm.controls).forEach(control => {
//       control.markAsTouched();
//       if (control instanceof FormArray) {
//         control.controls.forEach(group => {
//           if (group instanceof FormGroup) {
//             Object.values(group.controls).forEach(c => c.markAsTouched());
//           }
//         });
//       }
//     });
//   }

//   private prepareSubmitData(): any {
//     const formValue = this.offreForm.value;
//     const currentDate = new Date().toISOString();
    
//     return {
//       idOffreEmploi: this.offerId || undefined,
//       specialite: formValue.specialite,
//       datePublication: this.isEditMode ? undefined : currentDate,
//       dateExpiration: new Date(formValue.dateExpiration).toISOString(),
//       salaireMin: formValue.salaireMin,
//       salaireMax: formValue.salaireMax,
//       niveauExperienceRequis: formValue.niveauExperienceRequis,
//       typeContrat: formValue.typeContrat,
//       statut: formValue.statut,
//       modeTravail: formValue.modeTravail,
//       estActif: formValue.estActif,
//       avantages: formValue.avantages,
//       idFiliale: formValue.idFiliale,
//       idDepartement: formValue.idDepartement,
//       idRecruteur: formValue.idRecruteur,
//       postes: formValue.postes,
//       offreMissions: formValue.offreMissions,
//       offreLangues: formValue.offreLangues,
//       offreCompetences: formValue.offreCompetences,
//       diplomeIds: formValue.diplomeIds
//     };
//   }

//   private createOffre(data: any): void {
//     this.offreService.addOffre({ dto: data }).subscribe({
//       next: () => this.handleSuccess('Offre créée avec succès'),
//       error: (error) => this.handleError('Échec de la création', error)
//     });
//   }

//   private updateOffre(data: any): void {
//     this.offreService.update(this.offerId!, data).subscribe({
//       next: () => this.handleSuccess('Offre mise à jour avec succès'),
//       error: (error) => this.handleError('Échec de la mise à jour', error)
//     });
//   }

//   private handleSuccess(message: string): void {
//     Swal.fire('Succès', message, 'success').then(() => {
//       this.router.navigate(['/offres']);
//     });
//   }

//   private handleError(message: string, error: any): void {
//     console.error(message, error);
//     Swal.fire('Erreur', `${message}: ${error.message}`, 'error');
//   }

//   cancel(): void {
//     this.router.navigate(['/offres']);
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { DepartementService } from '../../shared/services/departement.service';
// import { OffreMissionService } from '../../shared/services/offre-mission.service';
// import { LangueService } from '../../shared/services/langue.service';
// import { OffreCompetenceService } from '../../shared/services/offre-competence.service';
// import { DiplomeService } from '../../shared/services/diplome.service';
// import { AuthService } from '../../shared/services/auth.service';
// import { HttpHeaders } from '@angular/common/http';
// import Swal from 'sweetalert2';

// // Models
// import { ModeTravail, StatutOffre, TypeContratEnum, NiveauRequisType } from '../../Models/enums.model';
// import { Filiale } from '../../Models/filiale.model';
// import { Departement } from '../../Models/departement';
// import { Diplome, OffreLangue, OffreMission, Poste } from '../../Models/offre-emploi.model';
// import { OffreCompetence } from '../../Models/offre-competence.model';
// import { Recruiter } from '../../Models/recruiter.model';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-offre-form',
//   standalone: true,
//   imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './offre-form.component.html',
//   styleUrls: ['./offre-form.component.css']
// })
// export class OffreFormComponent implements OnInit {
//   offreForm: FormGroup;
//   filiales: Filiale[] = [];
//   departements: Departement[] = [];
//   recruteurs: Recruiter[] = [];
//   diplomes: Diplome[] = [];
//   competences: any[] = [];
//   langues: string[] = ['Français', 'Anglais', 'Arabe', 'Allemand', 'Espagnol'];
//   typeContrats = Object.values(TypeContratEnum);
//   statuts = Object.values(StatutOffre);
//   modesTravail = Object.values(ModeTravail);
//   niveauxRequis = Object.values(NiveauRequisType);
//   isEditMode = false;
//   offerId: string | null = null;
//   recruteurstemp: { id: any; fullName: string; }[] = [];

//   constructor(
//     private fb: FormBuilder,
//     private offreService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private departementService: DepartementService,
//     private missionService: OffreMissionService,
//     private langueService: LangueService,
//     private competenceService: OffreCompetenceService,
//     private diplomeService: DiplomeService,
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.offreForm = this.fb.group({
//       specialite: ['', Validators.required],
//       datePublication: [{ value: new Date().toISOString().substring(0, 16), disabled: true }],
//       dateExpiration: ['', Validators.required],
//       salaireMin: [0, [Validators.required, Validators.min(0)]],
//       salaireMax: [0, [Validators.required, Validators.min(0)]],
//       niveauExperienceRequis: ['', Validators.required],
//       typeContrat: ['', Validators.required],
//       statut: ['', Validators.required],
//       modeTravail: ['', Validators.required],
//       estActif: [true],
//       avantages: [''],
//       idFiliale: ['', Validators.required],
//       idDepartement: ['', Validators.required],
//       idRecruteur: ['', Validators.required],
//       postes: this.fb.array([]),
//       offreMissions: this.fb.array([]),
//       offreLangues: this.fb.array([]),
//       offreCompetences: this.fb.array([]),
//       diplomeIds: this.fb.array([], Validators.required)
//     });
//   }

//   ngOnInit(): void {
//     if (!this.authService.isAuthenticated()) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     this.loadInitialData();
//     this.offerId = this.route.snapshot.paramMap.get('id');
    
//     if (this.offerId) {
//       this.isEditMode = true;
//       this.loadOffre(this.offerId);
//     } else {
//       this.addPoste();
//       this.addMission();
//       this.addLangue();
//       this.addCompetence();
//       this.addDiplome();
//     }
//   }

//   private loadInitialData(): void {
//     this.loadFiliales();
//     this.loadDepartements();
//     this.loadRecruteursSimple();
//     this.loadDiplomes();
//     this.loadCompetences();
//   }

//   private getAuthHeader(): HttpHeaders {
//     const token = this.authService.getToken();
//     if (!token) {
//       console.error('No token available');
//       this.authService.logout();
//       throw new Error('Authentication required');
//     }
//     return new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
//   }

//   loadFiliales(): void {
//     this.filialeService.getFiliales().subscribe({
//       next: (filiales) => this.filiales = filiales,
//       error: (error) => this.handleError('Échec du chargement des filiales', error)
//     });
//   }

//   loadDepartements(): void {
//     this.departementService.getDepartements().subscribe({
//       next: (departements) => this.departements = departements,
//       error: (error) => this.handleError('Échec du chargement des départements', error)
//     });
//   }

//   // 2. Chargement des recruteurs - version améliorée
// loadRecruteursSimple(): void {
//   this.offreService.getRecruiters().subscribe({
//     next: (response: any) => {
//       if (response?.success && response.data) {
//         this.recruteurs = response.data.map((recruteur: any) => ({
//           id: recruteur.id,
//           fullName: recruteur.fullName || `${recruteur.firstName} ${recruteur.lastName}`,
//           email: recruteur.email
//         }));
//       } else {
//         console.error('Format de réponse inattendu:', response);
//         this.recruteurs = [];
//       }
//     },
//     error: (error) => this.handleError('Échec du chargement des recruteurs', error)
//   });
// }

//   loadDiplomes(): void {
//     this.diplomeService.getAll().subscribe({
//       next: (response) => {
//         if (response?.data) {
//           this.diplomes = response.data;
//         } else {
//           this.diplomes = [];
//           console.warn('Aucune donnée de diplôme reçue');
//         }
//       },
//       error: (error) => this.handleError('Échec du chargement des diplômes', error)
//     });
//   }

//  // 1. Chargement des compétences
// loadCompetences(): void {
//   this.competenceService.getCompetencesDisponibles().subscribe({
//     next: (competences) => {
//       this.competences = competences;
//     },
//     error: (error) => this.handleError('Échec du chargement des compétences', error)
//   });
// }

//   loadOffre(id: string): void {
//     this.offreService.getById(id).subscribe({
//       next: (offre) => {
//         this.patchFormValues(offre);
//         this.loadFormArrays(offre);
//       },
//       error: (error) => this.handleError('Échec du chargement de l\'offre', error)
//     });
//   }

//   private patchFormValues(offre: any): void {
//     this.offreForm.patchValue({
//       specialite: offre.specialite,
//       datePublication: offre.datePublication ? new Date(offre.datePublication).toISOString().substring(0, 16) : new Date().toISOString().substring(0, 16),
//       dateExpiration: offre.dateExpiration ? new Date(offre.dateExpiration).toISOString().substring(0, 16) : '',
//       salaireMin: offre.salaireMin,
//       salaireMax: offre.salaireMax,
//       niveauExperienceRequis: offre.niveauExperienceRequis,
//       typeContrat: offre.typeContrat,
//       statut: offre.statut,
//       modeTravail: offre.modeTravail,
//       estActif: offre.estActif,
//       avantages: offre.avantages,
//       idFiliale: offre.idFiliale,
//       idDepartement: offre.idDepartement,
//       idRecruteur: offre.idRecruteur
//     });
//   }

//   private loadFormArrays(offre: any): void {
//     // Postes
//     const postesArray = this.postes;
//     postesArray.clear();
//     if (offre.postes) {
//       offre.postes.forEach((poste: Poste) => {
//         postesArray.push(this.createPosteFormGroup(poste));
//       });
//     }

//     // Missions
//     const missionsArray = this.offreMissions;
//     missionsArray.clear();
//     if (offre.offreMissions) {
//       offre.offreMissions.forEach((mission: OffreMission) => {
//         missionsArray.push(this.createMissionFormGroup(mission));
//       });
//     }

//     // Langues
//     const languesArray = this.offreLangues;
//     languesArray.clear();
//     if (offre.offreLangues) {
//       offre.offreLangues.forEach((langue: OffreLangue) => {
//         languesArray.push(this.createLangueFormGroup(langue));
//       });
//     }

//     // Compétences
//     const competencesArray = this.offreCompetences;
//     competencesArray.clear();
//     if (offre.offreCompetences) {
//       offre.offreCompetences.forEach((competence: OffreCompetence) => {
//         competencesArray.push(this.createCompetenceFormGroup(competence));
//       });
//     }

//     // Diplômes
//     const diplomesArray = this.diplomeIds;
//     diplomesArray.clear();
//     if (offre.diplomeIds && offre.diplomeIds.length > 0) {
//       offre.diplomeIds.forEach((diplomeId: string) => {
//         diplomesArray.push(this.fb.control(diplomeId));
//       });
//     } else {
//       this.addDiplome();
//     }
//   }

//   // Form Array Getters
//   get postes(): FormArray {
//     return this.offreForm.get('postes') as FormArray;
//   }

//   get offreMissions(): FormArray {
//     return this.offreForm.get('offreMissions') as FormArray;
//   }

//   get offreLangues(): FormArray {
//     return this.offreForm.get('offreLangues') as FormArray;
//   }

//   get offreCompetences(): FormArray {
//     return this.offreForm.get('offreCompetences') as FormArray;
//   }

//   get diplomeIds(): FormArray {
//     return this.offreForm.get('diplomeIds') as FormArray;
//   }

//   // Form Group Creators
//   createPosteFormGroup(poste?: Poste): FormGroup {
//     return this.fb.group({
//       titrePoste: [poste?.titrePoste || '', Validators.required],
//       description: [poste?.description || '', Validators.required],
//       nombrePostes: [poste?.nombrePostes || 1, [Validators.required, Validators.min(1)]],
//       experienceSouhaitee: [poste?.experienceSouhaitee || '', Validators.required],
//       niveauHierarchique: [poste?.niveauHierarchique || '', Validators.required]
//     });
//   }

//   createMissionFormGroup(mission?: OffreMission): FormGroup {
//     return this.fb.group({
//       descriptionMission: [mission?.descriptionMission || '', Validators.required],
//       priorite: [mission?.priorite || 0, [Validators.required, Validators.min(0)]]
//     });
//   }

//   createLangueFormGroup(langue?: OffreLangue): FormGroup {
//     return this.fb.group({
//       langue: [langue?.langue || '', Validators.required],
//       niveauRequis: [langue?.niveauRequis || '', Validators.required]
//     });
//   }

//   // 3. Méthode pour créer un groupe de formulaire de compétence
// createCompetenceFormGroup(competence?: OffreCompetence): FormGroup {
//   return this.fb.group({
//     idCompetence: [competence?.idCompetence || '', Validators.required],
//     niveauRequis: [competence?.niveauRequis || '', Validators.required],
//     competenceDetails: this.fb.group({
//       nom: [competence?.competence?.nom || ''], // Pré-remplir si disponible
//       description: [competence?.competence?.description || '']
//     })
//   });
// }

//   // Add/Remove Methods
//   addPoste(): void {
//     this.postes.push(this.createPosteFormGroup());
//   }

//   removePoste(index: number): void {
//     if (this.postes.length > 1) {
//       this.postes.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Vous devez avoir au moins un poste', 'info');
//     }
//   }

//   addMission(): void {
//     this.offreMissions.push(this.createMissionFormGroup());
//   }

//   removeMission(index: number): void {
//     if (this.offreMissions.length > 1) {
//       this.offreMissions.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Vous devez avoir au moins une mission', 'info');
//     }
//   }

//   addLangue(): void {
//     this.offreLangues.push(this.createLangueFormGroup());
//   }

//   removeLangue(index: number): void {
//     this.offreLangues.removeAt(index);
//   }

//   addCompetence(): void {
//     this.offreCompetences.push(this.createCompetenceFormGroup());
//   }

//   removeCompetence(index: number): void {
//     this.offreCompetences.removeAt(index);
//   }

//   addDiplome(): void {
//     this.diplomeIds.push(this.fb.control('', Validators.required));
//   }

//   removeDiplome(index: number): void {
//     if (this.diplomeIds.length > 1) {
//       this.diplomeIds.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Vous devez avoir au moins un diplôme', 'info');
//     }
//   }

//   // Form Submission
//   onSubmit(): void {
//     if (this.offreForm.invalid) {
//       this.markAllAsTouched();
//       Swal.fire('Erreur', 'Veuillez remplir tous les champs requis correctement.', 'error');
//       return;
//     }

//     const formValue = this.prepareSubmitData();
    
//     if (this.isEditMode) {
//       this.updateOffre(formValue);
//     } else {
//       this.createOffre(formValue);
//     }
//   }

//   private markAllAsTouched(): void {
//     Object.values(this.offreForm.controls).forEach(control => {
//       control.markAsTouched();
//       if (control instanceof FormArray) {
//         control.controls.forEach(group => {
//           if (group instanceof FormGroup) {
//             Object.values(group.controls).forEach(c => c.markAsTouched());
//           }
//         });
//       }
//     });
//   }

//   private prepareSubmitData(): any {
//     const formValue = this.offreForm.getRawValue();
//     const currentDate = new Date().toISOString();
    
//     return {
//       idOffreEmploi: this.offerId || undefined,
//       specialite: formValue.specialite,
//       datePublication: this.isEditMode ? undefined : currentDate,
//       dateExpiration: new Date(formValue.dateExpiration).toISOString(),
//       salaireMin: formValue.salaireMin,
//       salaireMax: formValue.salaireMax,
//       niveauExperienceRequis: formValue.niveauExperienceRequis,
//       typeContrat: formValue.typeContrat,
//       statut: formValue.statut,
//       modeTravail: formValue.modeTravail,
//       estActif: formValue.estActif,
//       avantages: formValue.avantages,
//       idFiliale: formValue.idFiliale,
//       idDepartement: formValue.idDepartement,
//       idRecruteur: formValue.idRecruteur,
//       postes: formValue.postes,
//       offreMissions: formValue.offreMissions,
//       offreLangues: formValue.offreLangues,
//       offreCompetences: formValue.offreCompetences,
//       diplomeIds: formValue.diplomeIds
//       offreCompetences: formValue.offreCompetences.map((oc: any) => ({
//       idCompetence: oc.idCompetence,
//       niveauRequis: oc.niveauRequis
//     })),
//     };
//   }

//   private createOffre(data: any): void {
//     this.offreService.addOffre({ dto: data }).subscribe({
//       next: () => this.handleSuccess('Offre créée avec succès'),
//       error: (error) => this.handleError('Échec de la création', error)
//     });
//   }

//   private updateOffre(data: any): void {
//     this.offreService.update(this.offerId!, data).subscribe({
//       next: () => this.handleSuccess('Offre mise à jour avec succès'),
//       error: (error) => this.handleError('Échec de la mise à jour', error)
//     });
//   }

//   private handleSuccess(message: string): void {
//     Swal.fire('Succès', message, 'success').then(() => {
//       this.router.navigate(['/offres']);
//     });
//   }

//   private handleError(message: string, error: any): void {
//     console.error(message, error);
//     let errorMessage = message;
    
//     if (error.status === 401) {
//       errorMessage += ' - Session expirée, veuillez vous reconnecter';
//       this.authService.logout();
//       this.router.navigate(['/login']);
//     } else if (error.error?.message) {
//       errorMessage += `: ${error.error.message}`;
//     } else if (error.message) {
//       errorMessage += `: ${error.message}`;
//     }

//     Swal.fire('Erreur', errorMessage, 'error');
//   }

//   cancel(): void {
//     this.router.navigate(['/offres']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { DepartementService } from '../../shared/services/departement.service';
import { OffreCompetenceService } from '../../shared/services/offre-competence.service';
import { DiplomeService } from '../../shared/services/diplome.service';
import { AuthService } from '../../shared/services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

// Models
import { ModeTravail, StatutOffre, TypeContratEnum, NiveauRequisType, Langue } from '../../Models/enums.model';
import { Filiale } from '../../Models/filiale.model';
import { Departement } from '../../Models/departement';
import { Diplome } from '../../Models/offre-emploi.model';
import { OffreCompetence } from '../../Models/offre-competence.model';
import { Recruiter } from '../../Models/recruiter.model';
import { Competence } from '../../Models/competence.model';

@Component({
  selector: 'app-offre-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './offre-form.component.html',
  styleUrls: ['./offre-form.component.css']
})
export class OffreFormComponent implements OnInit {
  offreForm: FormGroup;
  filiales: Filiale[] = [];
  departements: Departement[] = [];
  recruteurs: Recruiter[] = [];
  diplomes: Diplome[] = [];
  competences: Competence[] = [];
  languesDisponibles = Object.values(Langue);
  typeContrats = Object.values(TypeContratEnum);
  statuts = Object.values(StatutOffre);
  modesTravail = Object.values(ModeTravail);
  niveauxRequis = Object.values(NiveauRequisType);
  isEditMode = false;
  offerId: string | null = null;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private departementService: DepartementService,
    private competenceService: OffreCompetenceService,
    private diplomeService: DiplomeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.offreForm = this.fb.group({
      specialite: ['', Validators.required],
      datePublication: [{ value: new Date().toISOString().substring(0, 10), disabled: true }],
      dateExpiration: ['', Validators.required],
      salaireMin: [0, [Validators.required, Validators.min(0)]],
      salaireMax: [0, [Validators.required, Validators.min(0)]],
      niveauExperienceRequis: ['', Validators.required],
      typeContrat: ['', Validators.required],
      statut: ['', Validators.required],
      modeTravail: ['', Validators.required],
      estActif: [true],
      avantages: [''],
      idFiliale: ['', Validators.required],
      idDepartement: ['', Validators.required],
      idRecruteur: ['', Validators.required],
      postes: this.fb.array([]),
      offreMissions: this.fb.array([]),
      offreLangues: this.fb.array([]),
      offreCompetences: this.fb.array([]),
      diplomeIds: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadInitialData();
    this.offerId = this.route.snapshot.paramMap.get('id');
    
    if (this.offerId) {
      this.isEditMode = true;
      this.loadOffre(this.offerId);
    } else {
      this.addPoste();
      this.addMission();
      this.addLangue();
      this.addCompetence();
      this.addDiplome();
    }
  }

  // Form Array Getters
  get postes(): FormArray {
    return this.offreForm.get('postes') as FormArray;
  }

  get offreMissions(): FormArray {
    return this.offreForm.get('offreMissions') as FormArray;
  }

  get offreLangues(): FormArray {
    return this.offreForm.get('offreLangues') as FormArray;
  }

  get offreCompetences(): FormArray {
    return this.offreForm.get('offreCompetences') as FormArray;
  }

  get diplomeIds(): FormArray {
    return this.offreForm.get('diplomeIds') as FormArray;
  }

  // Initial Data Loading
  private loadInitialData(): void {
    this.isLoading = true;
    const loaders = [
      this.loadFiliales(),
      this.loadDepartements(),
      this.loadRecruteurs(),
      this.loadDiplomes(),
      this.loadCompetences()
    ];

    Promise.all(loaders).finally(() => {
      this.isLoading = false;
    });
  }

  private async loadFiliales(): Promise<void> {
    try {
      this.filiales = await this.filialeService.getFiliales().toPromise() || [];
    } catch (error) {
      this.handleError('Échec du chargement des filiales', error);
    }
  }

  private async loadDepartements(): Promise<void> {
    try {
      this.departements = await this.departementService.getDepartements().toPromise() || [];
    } catch (error) {
      this.handleError('Échec du chargement des départements', error);
    }
  }

  private async loadRecruteurs(): Promise<void> {
    try {
      const response = await this.offreService.getRecruitersSimple().toPromise();
      this.recruteurs = response?.map(r => ({
        id: r.id,
        fullName: r.fullName,
        email: r.email
      })) || [];
    } catch (error) {
      console.error('Erreur chargement recruteurs:', error);
      this.handleError('Échec du chargement des recruteurs', error);
    }
  }

  private async loadDiplomes(): Promise<void> {
    try {
      const response = await this.diplomeService.getAll().toPromise();
      this.diplomes = response?.data || response || [];
    } catch (error) {
      this.handleError('Échec du chargement des diplômes', error);
    }
  }

  private async loadCompetences(): Promise<void> {
    try {
      this.competences = await this.competenceService.getCompetencesDisponibles().toPromise() || [];
    } catch (error) {
      this.handleError('Échec du chargement des compétences', error);
    }
  }

  private loadOffre(id: string): void {
    this.offreService.getById(id).subscribe({
      next: (offre) => {
        this.patchFormValues(offre);
        this.loadFormArrays(offre);
      },
      error: (error) => this.handleError('Échec du chargement de l\'offre', error)
    });
  }

  private patchFormValues(offre: any): void {
    this.offreForm.patchValue({
      specialite: offre.specialite,
      datePublication: new Date(offre.datePublication).toISOString().substring(0, 10),
      dateExpiration: new Date(offre.dateExpiration).toISOString().substring(0, 10),
      salaireMin: offre.salaireMin,
      salaireMax: offre.salaireMax,
      niveauExperienceRequis: offre.niveauExperienceRequis,
      typeContrat: offre.typeContrat,
      statut: offre.statut,
      modeTravail: offre.modeTravail,
      estActif: offre.estActif,
      avantages: offre.avantages,
      idFiliale: offre.idFiliale,
      idDepartement: offre.idDepartement,
      idRecruteur: offre.idRecruteur
    });
  }

  private loadFormArrays(offre: any): void {
    // Postes
    const postesArray = this.postes;
    postesArray.clear();
    if (offre.postes?.length > 0) {
      offre.postes.forEach((poste: any) => {
        postesArray.push(this.createPosteFormGroup(poste));
      });
    } else {
      this.addPoste();
    }

    // Missions
    const missionsArray = this.offreMissions;
    missionsArray.clear();
    if (offre.offreMissions?.length > 0) {
      offre.offreMissions.forEach((mission: any) => {
        missionsArray.push(this.createMissionFormGroup(mission));
      });
    } else {
      this.addMission();
    }

    // Langues
    const languesArray = this.offreLangues;
    languesArray.clear();
    if (offre.offreLangues?.length > 0) {
      offre.offreLangues.forEach((langue: any) => {
        languesArray.push(this.createLangueFormGroup(langue));
      });
    } else {
      this.addLangue();
    }

    // Compétences
    const competencesArray = this.offreCompetences;
    competencesArray.clear();
    if (offre.offreCompetences?.length > 0) {
      offre.offreCompetences.forEach((competence: any) => {
        competencesArray.push(this.createCompetenceFormGroup(competence));
      });
    } else {
      this.addCompetence();
    }

    // Diplômes
    const diplomesArray = this.diplomeIds;
    diplomesArray.clear();
    if (offre.diplomeIds?.length > 0) {
      offre.diplomeIds.forEach((diplomeId: string) => {
        diplomesArray.push(this.fb.control(diplomeId));
      });
    } else {
      this.addDiplome();
    }
  }

  // Form Group Creators
  createPosteFormGroup(poste?: any): FormGroup {
    return this.fb.group({
      titrePoste: [poste?.titrePoste || '', Validators.required],
      description: [poste?.description || '', Validators.required],
      nombrePostes: [poste?.nombrePostes || 1, [Validators.required, Validators.min(1)]],
      experienceSouhaitee: [poste?.experienceSouhaitee || '', Validators.required],
      niveauHierarchique: [poste?.niveauHierarchique || '', Validators.required]
    });
  }

  createMissionFormGroup(mission?: any): FormGroup {
    return this.fb.group({
      descriptionMission: [mission?.descriptionMission || '', Validators.required],
      priorite: [mission?.priorite || 0, [Validators.required, Validators.min(0)]]
    });
  }

  createLangueFormGroup(langue?: any): FormGroup {
    return this.fb.group({
      langue: [langue?.langue || '', Validators.required],
      niveauRequis: [langue?.niveauRequis || '', Validators.required]
    });
  }

  createCompetenceFormGroup(competence?: any): FormGroup {
    return this.fb.group({
      idCompetence: [competence?.idCompetence || '', Validators.required],
      niveauRequis: [competence?.niveauRequis || '', Validators.required]
    });
  }

  // Add/Remove Methods
  addPoste(): void {
    this.postes.push(this.createPosteFormGroup());
  }

  removePoste(index: number): void {
    if (this.postes.length > 1) {
      this.postes.removeAt(index);
    } else {
      Swal.fire('Info', 'Vous devez avoir au moins un poste', 'info');
    }
  }

  addMission(): void {
    this.offreMissions.push(this.createMissionFormGroup());
  }

  removeMission(index: number): void {
    if (this.offreMissions.length > 1) {
      this.offreMissions.removeAt(index);
    } else {
      Swal.fire('Info', 'Vous devez avoir au moins une mission', 'info');
    }
  }

  addLangue(): void {
    this.offreLangues.push(this.createLangueFormGroup());
  }

  removeLangue(index: number): void {
    this.offreLangues.removeAt(index);
  }

  addCompetence(): void {
    this.offreCompetences.push(this.createCompetenceFormGroup());
  }

  removeCompetence(index: number): void {
    this.offreCompetences.removeAt(index);
  }

  addDiplome(): void {
    this.diplomeIds.push(this.fb.control('', Validators.required));
  }

  removeDiplome(index: number): void {
    if (this.diplomeIds.length > 1) {
      this.diplomeIds.removeAt(index);
    } else {
      Swal.fire('Info', 'Vous devez avoir au moins un diplôme', 'info');
    }
  }

  // Form Submission
  onSubmit(): void {
    if (this.offreForm.invalid) {
      this.markAllAsTouched();
      Swal.fire('Erreur', 'Veuillez remplir tous les champs requis correctement.', 'error');
      return;
    }

    const formValue = this.prepareSubmitData();
    
    if (this.isEditMode) {
      this.updateOffre(formValue);
    } else {
      this.createOffre(formValue);
    }
  }

  private markAllAsTouched(): void {
    Object.values(this.offreForm.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            Object.values(group.controls).forEach(c => c.markAsTouched());
          } else if (group instanceof FormControl) {
            group.markAsTouched();
          }
        });
      }
    });
  }

  private prepareSubmitData(): any {
    const formValue = this.offreForm.getRawValue();
    
    return {
      idOffreEmploi: this.offerId || undefined,
      specialite: formValue.specialite,
      datePublication: this.isEditMode ? undefined : new Date().toISOString(),
      dateExpiration: new Date(formValue.dateExpiration).toISOString(),
      salaireMin: formValue.salaireMin,
      salaireMax: formValue.salaireMax,
      niveauExperienceRequis: formValue.niveauExperienceRequis,
      typeContrat: formValue.typeContrat,
      statut: formValue.statut,
      modeTravail: formValue.modeTravail,
      estActif: formValue.estActif,
      avantages: formValue.avantages,
      idFiliale: formValue.idFiliale,
      idDepartement: formValue.idDepartement,
      idRecruteur: formValue.idRecruteur,
      postes: formValue.postes,
      offreMissions: formValue.offreMissions,
      offreLangues: formValue.offreLangues,
      offreCompetences: formValue.offreCompetences.map((oc: any) => ({
        idCompetence: oc.idCompetence,
        niveauRequis: oc.niveauRequis
      })),
      diplomeIds: formValue.diplomeIds
    };
  }

  private createOffre(data: any): void {
    this.offreService.addOffre({ dto: data }).subscribe({
      next: () => this.handleSuccess('Offre créée avec succès'),
      error: (error) => this.handleError('Échec de la création', error)
    });
  }

  private updateOffre(data: any): void {
    this.offreService.update(this.offerId!, data).subscribe({
      next: () => this.handleSuccess('Offre mise à jour avec succès'),
      error: (error) => this.handleError('Échec de la mise à jour', error)
    });
  }

  private handleSuccess(message: string): void {
    Swal.fire('Succès', message, 'success').then(() => {
      this.router.navigate(['/offres']);
    });
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    let errorMessage = message;
    
    if (error.status === 401) {
      errorMessage += ' - Session expirée, veuillez vous reconnecter';
      this.authService.logout();
      this.router.navigate(['/login']);
    } else if (error.error?.message) {
      errorMessage += `: ${error.error.message}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    Swal.fire('Erreur', errorMessage, 'error');
  }

  cancel(): void {
    this.router.navigate(['/offres']);
  }

  // Helper Methods
  getCompetenceName(id: string): string {
    const competence = this.competences.find(c => c.id === id);
    return competence ? competence.nom : 'Compétence inconnue';
  }

  getDiplomeName(id: string): string {
    const diplome = this.diplomes.find(d => d.idDiplome === id);
    return diplome ? diplome.nomDiplome : 'Diplôme inconnu';
  }
}