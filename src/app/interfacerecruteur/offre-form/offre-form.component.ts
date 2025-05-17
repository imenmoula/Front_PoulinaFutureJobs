

// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { Observable } from 'rxjs';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { DepartementService } from '../../shared/services/departement.service';
// import { OffreCompetenceService } from '../../shared/services/offre-competence.service';
// import { DiplomeService } from '../../shared/services/diplome.service';
// import { AuthService } from '../../shared/services/auth.service';
// import Swal from 'sweetalert2';
// import { CommonModule } from '@angular/common';

// // Models
// import { ModeTravail, StatutOffre, TypeContratEnum, NiveauRequisType, Langue } from '../../Models/enums.model';
// import { Filiale } from '../../Models/filiale.model';
// import { Departement } from '../../Models/departement';
// import { Diplome } from '../../Models/offre-emploi.model';
// import { OffreCompetence } from '../../Models/offre-competence.model';
// import { Recruiter } from '../../Models/recruiter.model';
// import { Competence } from '../../Models/competence.model';

// @Component({
//   selector: 'app-offre-form',
//   standalone: true,
//   imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
//   templateUrl: './offre-form.component.html',
//   styleUrls: ['./offre-form.component.css']
// })
// export class OffreFormComponent implements OnInit {
//   offreForm: FormGroup;
//   filiales: Filiale[] = [];
//   departements: Departement[] = [];
//   recruteurs: Recruiter[] = [];
//   diplomes: Diplome[] = [];
//   competences: Competence[] = [];
//   languesDisponibles = Object.values(Langue);
//   typeContrats = Object.values(TypeContratEnum);
//   statuts = Object.values(StatutOffre);
//   modesTravail = Object.values(ModeTravail);
//   niveauxRequis = Object.values(NiveauRequisType);
//   isEditMode = false;
//   offerId: string | null = null;
//   isLoading = true;

//   constructor(
//     private fb: FormBuilder,
//     private offreService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private departementService: DepartementService,
//     private competenceService: OffreCompetenceService,
//     private diplomeService: DiplomeService,
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.offreForm = this.fb.group({
//       specialite: ['', Validators.required],
//       datePublication: [{ value: new Date().toISOString().substring(0, 10), disabled: true }],
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

//   // Initial Data Loading
//   private loadInitialData(): void {
//     this.isLoading = true;
//     const loaders = [
//       this.loadFiliales(),
//       this.loadDepartements(),
//       this.loadRecruteurs(),
//       this.loadDiplomes(),
//       this.loadCompetences()
//     ];

//     Promise.all(loaders).finally(() => {
//       this.isLoading = false;
//     });
//   }

//   private async loadFiliales(): Promise<void> {
//     try {
//       this.filiales = await this.filialeService.getFiliales().toPromise() || [];
//     } catch (error) {
//       this.handleError('Échec du chargement des filiales', error);
//     }
//   }

//   private async loadDepartements(): Promise<void> {
//     try {
//       this.departements = await this.departementService.getDepartements().toPromise() || [];
//     } catch (error) {
//       this.handleError('Échec du chargement des départements', error);
//     }
//   }

//   private async loadRecruteurs(): Promise<void> {
//     try {
//       const response = await this.offreService.getRecruitersSimple().toPromise();
//       this.recruteurs = response?.map(r => ({
//         id: r.id,
//         fullName: r.fullName,
//         email: r.email
//       })) || [];
//     } catch (error) {
//       console.error('Erreur chargement recruteurs:', error);
//       this.handleError('Échec du chargement des recruteurs', error);
//     }
//   }

//   private async loadDiplomes(): Promise<void> {
//     try {
//       const response = await this.diplomeService.getAll().toPromise();
//       this.diplomes = response?.data || response || [];
//     } catch (error) {
//       this.handleError('Échec du chargement des diplômes', error);
//     }
//   }

//   private async loadCompetences(): Promise<void> {
//     try {
//       this.competences = await this.competenceService.getCompetencesDisponibles().toPromise() || [];
//     } catch (error) {
//       this.handleError('Échec du chargement des compétences', error);
//     }
//   }

//   private loadOffre(id: string): void {
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
//       datePublication: new Date(offre.datePublication).toISOString().substring(0, 10),
//       dateExpiration: new Date(offre.dateExpiration).toISOString().substring(0, 10),
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
//     if (offre.postes?.length > 0) {
//       offre.postes.forEach((poste: any) => {
//         postesArray.push(this.createPosteFormGroup(poste));
//       });
//     } else {
//       this.addPoste();
//     }

//     // Missions
//     const missionsArray = this.offreMissions;
//     missionsArray.clear();
//     if (offre.offreMissions?.length > 0) {
//       offre.offreMissions.forEach((mission: any) => {
//         missionsArray.push(this.createMissionFormGroup(mission));
//       });
//     } else {
//       this.addMission();
//     }

//     // Langues
//     const languesArray = this.offreLangues;
//     languesArray.clear();
//     if (offre.offreLangues?.length > 0) {
//       offre.offreLangues.forEach((langue: any) => {
//         languesArray.push(this.createLangueFormGroup(langue));
//       });
//     } else {
//       this.addLangue();
//     }

//     // Compétences
//     const competencesArray = this.offreCompetences;
//     competencesArray.clear();
//     if (offre.offreCompetences?.length > 0) {
//       offre.offreCompetences.forEach((competence: any) => {
//         competencesArray.push(this.createCompetenceFormGroup(competence));
//       });
//     } else {
//       this.addCompetence();
//     }

//     // Diplômes
//     const diplomesArray = this.diplomeIds;
//     diplomesArray.clear();
//     if (offre.diplomeIds?.length > 0) {
//       offre.diplomeIds.forEach((diplomeId: string) => {
//         diplomesArray.push(this.fb.control(diplomeId));
//       });
//     } else {
//       this.addDiplome();
//     }
//   }

//   // Form Group Creators
//   createPosteFormGroup(poste?: any): FormGroup {
//     return this.fb.group({
//       titrePoste: [poste?.titrePoste || '', Validators.required],
//       description: [poste?.description || '', Validators.required],
//       nombrePostes: [poste?.nombrePostes || 1, [Validators.required, Validators.min(1)]],
//       experienceSouhaitee: [poste?.experienceSouhaitee || '', Validators.required],
//       niveauHierarchique: [poste?.niveauHierarchique || '', Validators.required]
//     });
//   }

//   createMissionFormGroup(mission?: any): FormGroup {
//     return this.fb.group({
//       descriptionMission: [mission?.descriptionMission || '', Validators.required],
//       priorite: [mission?.priorite || 0, [Validators.required, Validators.min(0)]]
//     });
//   }

//   createLangueFormGroup(langue?: any): FormGroup {
//     return this.fb.group({
//       langue: [langue?.langue || '', Validators.required],
//       niveauRequis: [langue?.niveauRequis || '', Validators.required]
//     });
//   }

//   createCompetenceFormGroup(competence?: any): FormGroup {
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
//           } else if (group instanceof FormControl) {
//             group.markAsTouched();
//           }
//         });
//       }
//     });
//   }

//   private prepareSubmitData(): any {
//     const formValue = this.offreForm.getRawValue();
    
//     return {
//       idOffreEmploi: this.offerId || undefined,
//       specialite: formValue.specialite,
//       datePublication: this.isEditMode ? undefined : new Date().toISOString(),
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
//       offreCompetences: formValue.offreCompetences.map((oc: any) => ({
//         idCompetence: oc.idCompetence,
//         niveauRequis: oc.niveauRequis
//       })),
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

//   // Helper Methods
//   getCompetenceName(id: string): string {
//     const competence = this.competences.find(c => c.id === id);
//     return competence ? competence.nom : 'Compétence inconnue';
//   }

//   getDiplomeName(id: string): string {
//     const diplome = this.diplomes.find(d => d.idDiplome === id);
//     return diplome ? diplome.nomDiplome : 'Diplôme inconnu';
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { DepartementService } from '../../shared/services/departement.service';
import { OffreCompetenceService } from '../../shared/services/offre-competence.service';
import { DiplomeService } from '../../shared/services/diplome.service';
import { AuthService } from '../../shared/services/auth.service';
import Swal from 'sweetalert2';

// Models
import { ModeTravail, StatutOffre, TypeContratEnum, NiveauRequisType, Langue } from '../../Models/enums.model';
import { Filiale } from '../../Models/filiale.model';
import { Departement } from '../../Models/departement';
import { Diplome } from '../../Models/offre-emploi.model';
import { OffreCompetence } from '../../Models/offre-competence.model';
import { Recruiter } from '../../Models/recruiter.model';
import { Competence } from '../../Models/competence.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offre-form',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
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
  formSubmitted = false;

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
      specialite: ['', [Validators.required, Validators.maxLength(100)]],
      datePublication: [{ value: new Date().toISOString().substring(0, 10), disabled: true }],
      dateExpiration: ['', [Validators.required, this.futureDateValidator]],
      salaireMin: [0, [Validators.required, Validators.min(0)]],
      salaireMax: [0, [Validators.required, Validators.min(0)]],
      niveauExperienceRequis: ['', [Validators.required, Validators.maxLength(50)]],
      typeContrat: ['', Validators.required],
      statut: ['', Validators.required],
      modeTravail: ['', Validators.required],
      estActif: [true],
      avantages: ['', Validators.maxLength(500)],
      idFiliale: ['', Validators.required],
      idDepartement: ['', Validators.required],
      idRecruteur: ['', Validators.required],
      postes: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      offreMissions: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      offreLangues: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      offreCompetences: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      diplomeIds: this.fb.array([], [Validators.required, Validators.minLength(1)])
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

  // Validateur personnalisé pour date future
  private futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        return { 'invalidDate': true };
      }
    }
    return null;
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
  private async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;
      
      const [filiales, departements, recruteurs, diplomes, competences] = await Promise.all([
        this.filialeService.getFiliales().toPromise(),
        this.departementService.getDepartements().toPromise(),
        this.offreService.getRecruitersSimple().toPromise(),
        this.diplomeService.getAll().toPromise(),
        this.competenceService.getCompetencesDisponibles().toPromise()
      ]);

      this.filiales = filiales || [];
      this.departements = departements || [];
      this.recruteurs = recruteurs?.map(r => ({
        id: r.id,
        fullName: r.fullName,
        email: r.email
      })) || [];
      this.diplomes = diplomes?.data || diplomes || [];
      this.competences = competences || [];

    } catch (error) {
      console.error('Error loading initial data:', error);
      this.handleError('Échec du chargement des données initiales', error);
    } finally {
      this.isLoading = false;
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
    }

    // Missions
    const missionsArray = this.offreMissions;
    missionsArray.clear();
    if (offre.offreMissions?.length > 0) {
      offre.offreMissions.forEach((mission: any) => {
        missionsArray.push(this.createMissionFormGroup(mission));
      });
    }

    // Langues
    const languesArray = this.offreLangues;
    languesArray.clear();
    if (offre.offreLangues?.length > 0) {
      offre.offreLangues.forEach((langue: any) => {
        languesArray.push(this.createLangueFormGroup(langue));
      });
    }

    // Compétences
    const competencesArray = this.offreCompetences;
    competencesArray.clear();
    if (offre.offreCompetences?.length > 0) {
      offre.offreCompetences.forEach((competence: any) => {
        competencesArray.push(this.createCompetenceFormGroup(competence));
      });
    }

    // Diplômes
    const diplomesArray = this.diplomeIds;
    diplomesArray.clear();
    if (offre.diplomeIds?.length > 0) {
      offre.diplomeIds.forEach((diplomeId: string) => {
        diplomesArray.push(this.fb.control(diplomeId, Validators.required));
      });
    }
  }

  // Form Group Creators
  createPosteFormGroup(poste?: any): FormGroup {
    return this.fb.group({
      titrePoste: [poste?.titrePoste || '', [Validators.required, Validators.maxLength(100)]],
      description: [poste?.description || '', [Validators.required, Validators.maxLength(500)]],
      nombrePostes: [poste?.nombrePostes || 1, [Validators.required, Validators.min(1)]],
      experienceSouhaitee: [poste?.experienceSouhaitee || '', [Validators.required, Validators.maxLength(100)]],
      niveauHierarchique: [poste?.niveauHierarchique || '', [Validators.required, Validators.maxLength(50)]]
    });
  }

  createMissionFormGroup(mission?: any): FormGroup {
    return this.fb.group({
      descriptionMission: [mission?.descriptionMission || '', [Validators.required, Validators.maxLength(500)]],
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
    if (this.offreLangues.length > 1) {
      this.offreLangues.removeAt(index);
    } else {
      Swal.fire('Info', 'Vous devez avoir au moins une langue', 'info');
    }
  }

  addCompetence(): void {
    this.offreCompetences.push(this.createCompetenceFormGroup());
  }

  removeCompetence(index: number): void {
    if (this.offreCompetences.length > 1) {
      this.offreCompetences.removeAt(index);
    } else {
      Swal.fire('Info', 'Vous devez avoir au moins une compétence', 'info');
    }
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
    this.formSubmitted = true;
    
    if (this.offreForm.invalid) {
      this.markAllAsTouched();
      Swal.fire('Erreur', 'Veuillez remplir tous les champs requis correctement.', 'error');
      return;
    }

    // Validation supplémentaire pour salaire
    if (this.offreForm.value.salaireMin > this.offreForm.value.salaireMax) {
      Swal.fire('Erreur', 'Le salaire minimum ne peut pas être supérieur au salaire maximum', 'error');
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
    Swal.fire({
      title: 'Succès',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigate(['/offres']);
    });
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    let errorMessage = message;
    
    if (error.error?.message) {
      errorMessage += `: ${error.error.message}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    Swal.fire('Erreur', errorMessage, 'error');
  }

  cancel(): void {
    this.router.navigate(['/offres']);
  }

  // Helper pour afficher les erreurs de validation
  getValidationError(controlName: string, arrayName?: string, index?: number): string {
    let control: any;
    
    if (arrayName && index !== undefined) {
      const array = this.offreForm.get(arrayName) as FormArray;
      if (array && array.controls[index]) {
        control = array.controls[index].get(controlName);
      }
    } else {
      control = this.offreForm.get(controlName);
    }

    if (control?.errors && (control.touched || this.formSubmitted)) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors['min']) {
        return `La valeur minimale est ${control.errors['min'].min}`;
      }
      if (control.errors['maxlength']) {
        return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
      }
      if (control.errors['invalidDate']) {
        return 'La date doit être dans le futur';
      }
    }
    return '';
  }
}