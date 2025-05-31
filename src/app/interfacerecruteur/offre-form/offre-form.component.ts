import { OffreEmploiService } from './../../shared/services/offre-emploi.service';
// // ------------------------
// // TypeScript: offre-form.component.ts (complété)
// // ------------------------
// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import Swal from 'sweetalert2';
// import { DiplomeService } from '../../shared/services/diplome.service';
// import { CompetenceService } from '../../shared/services/competence.service';
// import { CreateOffreEmploiRequest, Diplome, } from '../../Models/offre-emploi.model';
// import { Competence } from '../../Models/competence.model';
// import { ModeTravail, StatutOffre, TypeContratEnum } from '../../Models/enums.model';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-offre-form',
//   standalone: true,
//   imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
//   templateUrl: './offre-form.component.html',
//   styleUrls: ['./offre-form.component.css']
// })
// export class OffreFormComponent implements OnInit {
//   offreForm: FormGroup;
//   diplomes: Diplome[] = [];
//   competences: Competence[] = [];

//   nouveauDiplome: Partial<Diplome> = { nomDiplome: '', domaine: '', niveau: '', institution: '' };
//   ajoutDiplomeEnCours = false;

//   nouvelleCompetence: Partial<Competence> = { nom: '', description: '', estTechnique: false, estSoftSkill: false };
//   ajoutCompetenceEnCours = false;

//   constructor(
//     private fb: FormBuilder,
//     private diplomeService: DiplomeService,
//     private competenceService: CompetenceService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.offreForm = this.fb.group({
//       diplomeIds: this.fb.array([], [Validators.required, Validators.minLength(1)]),
//       offreCompetences: this.fb.array([], [Validators.required, Validators.minLength(1)])
//     });
//   }

//   ngOnInit(): void {
//     this.loadDiplomes();
//     this.loadCompetences();
//     this.addDiplome();
//     this.addCompetence();
//   }

//   get diplomeIds(): FormArray {
//     return this.offreForm.get('diplomeIds') as FormArray;
//   }

//   get offreCompetences(): FormArray {
//     return this.offreForm.get('offreCompetences') as FormArray;
//   }

//   loadDiplomes() {
//     this.diplomeService.getAll().subscribe(data => this.diplomes = data);
//   }

//   loadCompetences() {
//     this.competenceService.getAllCompetences().subscribe(data => this.competences = data);
//   }

//   addDiplome() {
//     this.diplomeIds.push(this.fb.control('', Validators.required));
//   }

//   removeDiplome(index: number) {
//     if (this.diplomeIds.length > 1) {
//       this.diplomeIds.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Au moins un diplôme requis', 'info');
//     }
//   }

//   addCompetence() {
//     this.offreCompetences.push(this.fb.group({
//       idCompetence: ['', Validators.required],
//       niveauRequis: ['', Validators.required]
//     }));
//   }

//   removeCompetence(index: number) {
//     if (this.offreCompetences.length > 1) {
//       this.offreCompetences.removeAt(index);
//     } else {
//       Swal.fire('Info', 'Au moins une compétence requise', 'info');
//     }
//   }

//   ajouterNouveauDiplome() {
//     const { nomDiplome, domaine, niveau, institution } = this.nouveauDiplome;
//     if (!nomDiplome || !domaine || !niveau || !institution) return;

//     const diplomeToCreate: Diplome = {
//       idDiplome: '',
//       nomDiplome: this.nouveauDiplome.nomDiplome || '',
//       domaine: this.nouveauDiplome.domaine || '',
//       niveau: this.nouveauDiplome.niveau || '',
//     };
//     this.diplomeService.create(diplomeToCreate).subscribe({
//       next: (response) => {
//         const created = response.data as Diplome;
//         this.diplomes.push(created);
//         this.diplomeIds.push(this.fb.control(created.idDiplome));
//         this.nouveauDiplome = { nomDiplome: '', domaine: '', niveau: '' };
//         this.ajoutDiplomeEnCours = false;
//       },
//       error: () => Swal.fire('Erreur', 'Ajout du diplôme échoué', 'error')
//     });
//   }

//   ajouterNouvelleCompetence() {
//     const { nom, description } = this.nouvelleCompetence;
//     if (!nom || !description) return;

//     this.competenceService.create
// 
// 
//Competence(this.nouvelleCompetence).subscribe({
//       next: (created: Competence) => {
//         this.competences.push(created);
//         this.offreCompetences.push(this.fb.group({
//           idCompetence: [created.id, Validators.required],
//           niveauRequis: ['', Validators.required]
//         }));
//         this.nouvelleCompetence = { nom: '', description: '', estTechnique: false, estSoftSkill: false };
//         this.ajoutCompetenceEnCours = false;
//       },
//       error: () => Swal.fire('Erreur', 'Ajout de compétence échoué', 'error')
//     });
//   }

//   onSubmit() {
//     if (this.offreForm.invalid) {
//       Swal.fire('Erreur', 'Veuillez remplir tous les champs requis.', 'error');
//       return;
//     }

//     const formValue = this.offreForm.value;
//     const request: CreateOffreEmploiRequest = {
//       dto: {
//         // autres champs à récupérer ailleurs dans le formulaire global (non montré ici)
//         diplomeIds: formValue.diplomeIds,
//         offreCompetences: formValue.offreCompetences,
//         specialite: '',
//         dateExpiration: '',
//         niveauExperienceRequis: '',
//         typeContrat: TypeContratEnum.CDI,
//         statut: StatutOffre.Ouvert,
//         modeTravail: ModeTravail.Hybride,
//         avantages: '',
//         estActif: true,
//         idRecruteur: '',
//         idFiliale: '',
//         idDepartement: '',
//         postes: [],
//         offreMissions: [],
//         offreLangues: []
//       }
//     };

//     console.log('Form submission payload:', request);
//     // appeler le service pour submit
//   }

//   cancel() {
//     this.router.navigate(['/offres']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { DiplomeService } from '../../shared/services/diplome.service';
import { CompetenceService } from '../../shared/services/competence.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { DepartementService } from '../../shared/services/departement.service';
import { CreateOffreEmploiRequest, Diplome, OffreLangue, OffreMission, Poste } from '../../Models/offre-emploi.model';
import { Competence } from '../../Models/competence.model';
import { ModeTravail, StatutOffre, TypeContratEnum } from '../../Models/enums.model';
import { OffreCompetence } from '../../Models/offre-competence.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offre-form',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  
  templateUrl: './offre-form.component.html',
  styleUrls: ['./offre-form.component.css']
})
export class OffreFormComponent implements OnInit {
  offreForm: FormGroup;
  isEditMode = false;
  typeContrats = Object.values(TypeContratEnum);
  statuts = Object.values(StatutOffre);
  modesTravail = Object.values(ModeTravail);
  filiales: any[] = [];
  departements: any[] = [];
  recruteurs: any[] = [];
  diplomes: Diplome[] = [];
  competences: Competence[] = [];
  languesDisponibles = ['Français', 'Anglais', 'Espagnol', 'Allemand'];
  niveauxRequis = ['Debutant', 'Intermediaire', 'Avance', 'Expert'];

  ajoutDiplomeEnCours = false;
  ajoutCompetenceEnCours = false;
  nouveauDiplome: Partial<Diplome> = { nomDiplome: '', domaine: '', niveau: '' };
  nouvelleCompetence: Partial<Competence> = { nom: '', description: '', estTechnique: false, estSoftSkill: false };

  constructor(
    private fb: FormBuilder,
    private diplomeService: DiplomeService,
    private competenceService: CompetenceService,
    private filialeService: FilialeService,
    private departementService: DepartementService,
    private offreEmploiService: OffreEmploiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.offreForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadAllData();
    this.checkEditMode();
  }

  private checkEditMode(): void {
    // Implémentation basique : à adapter selon votre logique de modification
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;
    // Si besoin, charger les données de l'offre à éditer ici
  }

  private createForm(): FormGroup {
    return this.fb.group({
      specialite: ['', Validators.required],
      datePublication: [new Date().toISOString().substring(0, 10)],
      dateExpiration: ['', Validators.required],
      niveauExperienceRequis: ['', Validators.required],
      salaireMin: [0, [Validators.required, Validators.min(0)]],
      salaireMax: [0, [Validators.required, Validators.min(0)]],
      estActif: [true],
      typeContrat: ['', Validators.required],
      statut: ['', Validators.required],
      modeTravail: ['', Validators.required],
      idFiliale: ['', Validators.required],
      idDepartement: ['', Validators.required],
      idRecruteur: ['', Validators.required],
      avantages: [''],
      postes: this.fb.array([this.createPosteGroup()]),
      offreMissions: this.fb.array([this.createMissionGroup()]),
      offreLangues: this.fb.array([this.createLangueGroup()]),
      diplomeIds: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      offreCompetences: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  private loadAllData(): void {
    this.filialeService.getFiliales().subscribe(filiales => this.filiales = filiales || []);
    this.departementService.getDepartements().subscribe(departements => this.departements = departements || []);
    this.offreEmploiService.getRecruitersSimple().subscribe(recruteurs => this.recruteurs = recruteurs || []);
    this.loadDiplomes();
    this.loadCompetences();
  }

  private loadDiplomes(): void {
    this.diplomeService.getAll().subscribe({
      next: (diplomes) => this.diplomes = diplomes,
      error: (error) => console.error('Erreur chargement diplômes:', error)
    });
  }

  private loadCompetences(): void {
    this.competenceService.getAllCompetences().subscribe({
      next: (competences) => this.competences = competences,
      error: (error) => console.error('Erreur chargement compétences:', error)
    });
  }

  // Getters pour les FormArrays
  get postes(): FormArray { return this.offreForm.get('postes') as FormArray; }
  get offreMissions(): FormArray { return this.offreForm.get('offreMissions') as FormArray; }
  get offreLangues(): FormArray { return this.offreForm.get('offreLangues') as FormArray; }
  get diplomeIds(): FormArray { return this.offreForm.get('diplomeIds') as FormArray; }
  get offreCompetences(): FormArray { return this.offreForm.get('offreCompetences') as FormArray; }

  // Méthodes pour les postes
  createPosteGroup(): FormGroup {
    return this.fb.group({
      titrePoste: ['', Validators.required],
      nombrePostes: [1, [Validators.required, Validators.min(1)]],
      niveauHierarchique: ['', Validators.required],
      description: ['', Validators.required],
      experienceSouhaitee: ['', Validators.required]
    });
  }

  // Méthode pour les missions
  createMissionGroup(): FormGroup {
    return this.fb.group({
      mission: ['', Validators.required]
    });
  }

  // Méthode pour les langues
  createLangueGroup(): FormGroup {
    return this.fb.group({
      langue: ['', Validators.required],
      niveau: ['', Validators.required]
    });
  }

  addPoste(): void { this.postes.push(this.createPosteGroup()); }
  removePoste(index: number): void { if (this.postes.length > 1) this.postes.removeAt(index); }

  // Méthodes pour les diplômes
  addDiplome(): void { this.diplomeIds.push(this.fb.control('', Validators.required)); }
  
  removeDiplome(index: number): void {
    if (this.diplomeIds.length > 1) {
      this.diplomeIds.removeAt(index);
    } else {
      Swal.fire('Info', 'Au moins un diplôme requis', 'info');
    }
  }

  ajouterNouveauDiplome(): void {
    const { nomDiplome, domaine, niveau } = this.nouveauDiplome;
    if (!nomDiplome || !domaine || !niveau) {
      Swal.fire('Erreur', 'Nom, domaine et niveau sont obligatoires', 'error');
      return;
    }

    this.diplomeService.create(this.nouveauDiplome as Diplome).subscribe({
      next: (response) => {
        const createdDiplome: Diplome = (response as any).data as Diplome;
        this.diplomes = [...this.diplomes, createdDiplome];
        this.diplomeIds.push(this.fb.control(createdDiplome.idDiplome));
        this.nouveauDiplome = { nomDiplome: '', domaine: '', niveau: '' };
        this.ajoutDiplomeEnCours = false;
        Swal.fire('Succès', 'Diplôme ajouté', 'success');
      },
      error: () => Swal.fire('Erreur', 'Échec de création', 'error')
    });
  }

  // Méthodes pour les compétences
  addCompetence(): void {
    this.offreCompetences.push(this.fb.group({
      idCompetence: ['', Validators.required],
      niveauRequis: ['', Validators.required]
    }));
  }

  removeCompetence(index: number): void {
    if (this.offreCompetences.length > 1) {
      this.offreCompetences.removeAt(index);
    } else {
      Swal.fire('Info', 'Au moins une compétence requise', 'info');
    }
  }

  getCompetencesPourSelection(): Competence[] {
    return this.competences.filter(c => 
      !this.offreCompetences.controls.some(control => 
        control.get('idCompetence')?.value === c.id
      )
    );
  }

 // Remplace l’ancienne méthode par celle-ci
isCompetenceSelected(competenceId: string | undefined): boolean {
  if (!competenceId) return false;
  return this.offreCompetences.controls.some(control =>
    control.get('idCompetence')?.value === competenceId
  );
}

  ajouterNouvelleCompetence(): void {
    if (!this.nouvelleCompetence.nom || !this.nouvelleCompetence.description) {
      Swal.fire('Erreur', 'Nom et description requis', 'error');
      return;
    }

    this.competenceService.createCompetence(this.nouvelleCompetence).subscribe({
      next: (competence) => {
        this.competences = [...this.competences, competence];
        this.offreCompetences.push(this.fb.group({
          idCompetence: [competence.id, Validators.required],
          niveauRequis: ['', Validators.required]
        }));
        this.nouvelleCompetence = { nom: '', description: '', estTechnique: false, estSoftSkill: false };
        this.ajoutCompetenceEnCours = false;
        Swal.fire('Succès', 'Compétence ajoutée', 'success');
      },
      error: () => Swal.fire('Erreur', 'Échec de création', 'error')
    });
  }

  onSubmit(): void {
    if (this.offreForm.invalid) {
      this.markAllAsTouched();
      Swal.fire('Erreur', 'Formulaire invalide', 'error');
      return;
    }

    const request: CreateOffreEmploiRequest = {
      dto: {
        ...this.offreForm.value,
        postes: this.offreForm.value.postes,
        offreMissions: this.offreForm.value.offreMissions,
        offreLangues: this.offreForm.value.offreLangues,
        offreCompetences: this.offreForm.value.offreCompetences
      }
    };

    Swal.fire({
      title: 'Confirmation',
      text: this.isEditMode ? 'Mettre à jour l\'offre ?' : 'Créer l\'offre ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmer'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel API ici
        Swal.fire('Succès', 'Opération réussie', 'success');
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.offreForm.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            Object.values(group.controls).forEach(subControl => subControl.markAsTouched());
          }
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/offres']);
  }

  // [Les autres méthodes restent inchangées...]
}