// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import Swal from 'sweetalert2';
// import { DiplomeService } from '../../shared/services/diplome.service';
// import { CompetenceService } from '../../shared/services/competence.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { DepartementService } from '../../shared/services/departement.service';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { CreateOffreEmploiRequest, Diplome } from '../../Models/offre-emploi.model';
// import { Competence } from '../../Models/competence.model';
// import { ModeTravail, StatutOffre, TypeContratEnum } from '../../Models/enums.model';

// @Component({
//   selector: 'app-offre-form',
//   templateUrl: './offre-form.component.html',
//   styleUrls: ['./offre-form.component.css']
// })
// export class OffreFormComponent implements OnInit {
//   offreForm: FormGroup;
//   isEditMode = false;
//   typeContrats = Object.values(TypeContratEnum);
//   statuts = Object.values(StatutOffre);
//   modesTravail = Object.values(ModeTravail);
//   filiales: any[] = [];
//   departements: any[] = [];
//   recruteurs: any[] = [];
//   diplomes: Diplome[] = [];
//   competences: Competence[] = [];
//   languesDisponibles = ['Français', 'Anglais', 'Espagnol', 'Allemand'];
//   niveauxRequis = ['Debutant', 'Intermediaire', 'Avance', 'Expert'];

//   ajoutDiplomeEnCours = false;
//   ajoutCompetenceEnCours = false;
//   nouveauDiplome: Partial<Diplome> = { nomDiplome: '', domaine: '', niveau: '' };
//   nouvelleCompetence: Partial<Competence> = { nom: '', description: '' };

//   constructor(
//     private fb: FormBuilder,
//     private diplomeService: DiplomeService,
//     private competenceService: CompetenceService,
//     private filialeService: FilialeService,
//     private departementService: DepartementService,
//     private offreEmploiService: OffreEmploiService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.offreForm = this.createForm();
//   }

//   ngOnInit(): void {
//     this.loadAllData();
//     this.checkEditMode();
//   }

//   private checkEditMode(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     this.isEditMode = !!id;
//     if (this.isEditMode) {
//       this.loadOffreData(id!);
//     }
//   }

//   private createForm(): FormGroup {
//     return this.fb.group({
//       titreOffre: ['', Validators.required],
//       descriptionOffre: ['', Validators.required],
//       specialite: ['', Validators.required],
//       datePublication: [new Date().toISOString().substring(0, 10)],
//       dateExpiration: ['', Validators.required],
//       niveauExperienceRequis: ['', Validators.required],
//       salaireMin: [0, [Validators.required, Validators.min(0)]],
//       salaireMax: [0, [Validators.required, Validators.min(0)]],
//       estActif: [true],
//       typeContrat: ['', Validators.required],
//       statut: ['', Validators.required],
//       modeTravail: ['', Validators.required],
//       idFiliale: ['', Validators.required],
//       idDepartement: ['', Validators.required],
//       idRecruteur: ['', Validators.required],
//       avantages: [''],
//       postes: this.fb.array([this.createPosteGroup()]),
//       offreMissions: this.fb.array([this.createMissionGroup()]),
//       offreLangues: this.fb.array([this.createLangueGroup()]),
//       diplomeIds: this.fb.array([], [Validators.required, Validators.minLength(1)]),
//       offreCompetences: this.fb.array([], [Validators.required, Validators.minLength(1)])
//     });
//   }

//   private loadAllData(): void {
//     this.filialeService.getFiliales().subscribe(filiales => this.filiales = filiales || []);
//     this.departementService.getDepartements().subscribe(departements => this.departements = departements || []);
//     this.offreEmploiService.getRecruitersSimple().subscribe(recruteurs => this.recruteurs = recruteurs || []);
//     this.loadDiplomes();
//     this.loadCompetences();
//   }

//   private loadOffreData(id: string): void {
//     this.offreEmploiService.getById(id).subscribe({
//       next: (offre) => {
//         this.populateForm(offre);
//       },
//       error: () => Swal.fire('Erreur', 'Impossible de charger l\'offre', 'error')
//     });
//   }

//   private populateForm(offre: any): void {
//     // Réinitialiser les FormArrays
//     while (this.postes.length) this.postes.removeAt(0);
//     while (this.offreMissions.length) this.offreMissions.removeAt(0);
//     while (this.offreLangues.length) this.offreLangues.removeAt(0);
//     while (this.diplomeIds.length) this.diplomeIds.removeAt(0);
//     while (this.offreCompetences.length) this.offreCompetences.removeAt(0);

//     // Remplir les champs de base
//     this.offreForm.patchValue({
//       titreOffre: offre.titreOffre,
//       descriptionOffre: offre.descriptionOffre,
//       specialite: offre.specialite,
//       datePublication: offre.datePublication.substring(0, 10),
//       dateExpiration: offre.dateExpiration.substring(0, 10),
//       niveauExperienceRequis: offre.niveauExperienceRequis,
//       salaireMin: offre.salaireMin,
//       salaireMax: offre.salaireMax,
//       estActif: offre.estActif,
//       typeContrat: offre.typeContrat,
//       statut: offre.statut,
//       modeTravail: offre.modeTravail,
//       idFiliale: offre.idFiliale,
//       idDepartement: offre.idDepartement,
//       idRecruteur: offre.idRecruteur,
//       avantages: offre.avantages
//     });

//     // Remplir les FormArrays
//     offre.postes.forEach((poste: any) => this.postes.push(this.fb.group(poste)));
//     offre.offreMissions.forEach((mission: any) => this.offreMissions.push(this.fb.group(mission)));
//     offre.offreLangues.forEach((langue: any) => this.offreLangues.push(this.fb.group(langue)));
//     offre.diplomeIds.forEach((id: string) => this.diplomeIds.push(this.fb.control(id)));
//     offre.offreCompetences.forEach((oc: any) => {
//       this.offreCompetences.push(this.fb.group({
//         idCompetence: [oc.idCompetence, Validators.required],
//         niveauRequis: [oc.niveauRequis, Validators.required]
//       }));
//     });
//   }

//   private loadDiplomes(): void {
//     this.diplomeService.getAll().subscribe({
//       next: (diplomes) => this.diplomes = diplomes,
//       error: (error) => console.error('Erreur chargement diplômes:', error)
//     });
//   }

//   private loadCompetences(): void {
//     this.competenceService.getAllCompetences().subscribe({
//       next: (competences) => this.competences = competences,
//       error: (error) => console.error('Erreur chargement compétences:', error)
//     });
//   }

//   // Getters pour les FormArrays
//   get postes(): FormArray { return this.offreForm.get('postes') as FormArray; }
//   get offreMissions(): FormArray { return this.offreForm.get('offreMissions') as FormArray; }
//   get offreLangues(): FormArray { return this.offreForm.get('offreLangues') as FormArray; }
//   get diplomeIds(): FormArray { return this.offreForm.get('diplomeIds') as FormArray; }
//   get offreCompetences(): FormArray { return this.offreForm.get('offreCompetences') as FormArray; }

//   // Méthodes pour les postes
//   createPosteGroup(): FormGroup {
//     return this.fb.group({
//       titrePoste: ['', Validators.required],
//       nombrePostes: [1, [Validators.required, Validators.min(1)]],
//       niveauHierarchique: ['', Validators.required],
//       description: ['', Validators.required],
//       experienceSouhaitee: ['', Validators.required]
//     });
//   }

//   createMissionGroup(): FormGroup {
//     return this.fb.group({
//       mission: ['', Validators.required]
//     });
//   }

//   createLangueGroup(): FormGroup {
//     return this.fb.group({
//       langue: ['', Validators.required],
//       niveau: ['', Validators.required]
//     });
//   }

//   addPoste(): void { this.postes.push(this.createPosteGroup()); }
//   removePoste(index: number): void { 
//     if (this.postes.length > 1) this.postes.removeAt(index); 
//   }

//   // Méthodes pour les diplômes
//   addDiplome(): void { this.diplomeIds.push(this.fb.control('', Validators.required)); }
  
//   removeDiplome(index: number): void {
//     if (this.diplomeIds.length > 1) {
//       this.diplomeIds.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Au moins un diplôme requis', 'info');
//     }
//   }

//   ajouterNouveauDiplome(): void {
//     const { nomDiplome, domaine, niveau } = this.nouveauDiplome;
//     if (!nomDiplome || !domaine || !niveau) {
//       Swal.fire('Erreur', 'Nom, domaine et niveau sont obligatoires', 'error');
//       return;
//     }

//     this.diplomeService.create(this.nouveauDiplome as Diplome).subscribe({
//       next: (response) => {
//         const createdDiplome: Diplome = (response as any).data as Diplome;
//         this.diplomes = [...this.diplomes, createdDiplome];
//         this.diplomeIds.push(this.fb.control(createdDiplome.idDiplome));
//         this.nouveauDiplome = { nomDiplome: '', domaine: '', niveau: '' };
//         this.ajoutDiplomeEnCours = false;
//         Swal.fire('Succès', 'Diplôme ajouté', 'success');
//       },
//       error: () => Swal.fire('Erreur', 'Échec de création', 'error')
//     });
//   }

//   // Méthodes pour les compétences
//   addCompetence(): void {
//     this.offreCompetences.push(this.fb.group({
//       idCompetence: ['', Validators.required],
//       niveauRequis: ['', Validators.required]
//     }));
//   }

//   removeCompetence(index: number): void {
//     if (this.offreCompetences.length > 1) {
//       this.offreCompetences.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Au moins une compétence requise', 'info');
//     }
//   }

//   getCompetencesPourSelection(): Competence[] {
//     return this.competences.filter(c => 
//       !this.offreCompetences.controls.some(control => 
//         control.get('idCompetence')?.value === c.id
//       )
//     );
//   }

//   isCompetenceSelected(competenceId: string | undefined): boolean {
//     if (!competenceId) return false;
//     return this.offreCompetences.controls.some(control =>
//       control.get('idCompetence')?.value === competenceId
//     );
//   }

//   ajouterNouvelleCompetence(): void {
//     if (!this.nouvelleCompetence.nom || !this.nouvelleCompetence.description) {
//       Swal.fire('Erreur', 'Nom et description requis', 'error');
//       return;
//     }

//     this.competenceService.createCompetence(this.nouvelleCompetence).subscribe({
//       next: (competence) => {
//         this.competences = [...this.competences, competence];
//         this.offreCompetences.push(this.fb.group({
//           idCompetence: [competence.id, Validators.required],
//           niveauRequis: ['', Validators.required]
//         }));
//         this.nouvelleCompetence = { nom: '', description: '' };
//         this.ajoutCompetenceEnCours = false;
//         Swal.fire('Succès', 'Compétence ajoutée', 'success');
//       },
//       error: () => Swal.fire('Erreur', 'Échec de création', 'error')
//     });
//   }

//   onSubmit(): void {
//     if (this.offreForm.invalid) {
//       this.markAllAsTouched();
//       Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
//       return;
//     }

//     const request: CreateOffreEmploiRequest = {
//       dto: this.offreForm.value
//     };

//     const operation = this.isEditMode 
//       ? this.offreEmploiService.update(this.route.snapshot.paramMap.get('id')!, request) 
//       : this.offreEmploiService.addOffre(request);

//     Swal.fire({
//       title: 'Confirmation',
//       text: this.isEditMode ? 'Mettre à jour l\'offre ?' : 'Créer l\'offre ?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Confirmer'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         operation.subscribe({
//           next: () => {
//             Swal.fire('Succès', 'Opération réussie', 'success');
//             this.router.navigate(['/offres']);
//           },
//           error: () => Swal.fire('Erreur', 'Une erreur est survenue', 'error')
//         });
//       }
//     });
//   }

//   private markAllAsTouched(): void {
//     Object.values(this.offreForm.controls).forEach(control => {
//       control.markAsTouched();
//       if (control instanceof FormArray) {
//         control.controls.forEach(group => {
//           if (group instanceof FormGroup) {
//             Object.values(group.controls).forEach(subControl => subControl.markAsTouched());
//           }
//         });
//       }
//     });
//   }

//   cancel(): void {
//     this.router.navigate(['/offres']);
//   }
// }