// // src/app/offre-form/offre-form.component.ts
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { OffreMissionService } from '../../shared/services/offre-mission.service';
// import { OffreCompetenceSharedService } from '../../shared/services/offre-competence.service';
// import { LangueService } from '../../shared/services/langue.service';
// import { DepartementService } from '../../shared/services/departement.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { OffreEmploi, OffreLangue, OffreMission } from '../../Models/offre-emploi.model';
// import { OffreCompetence } from '../../Models/offre-competence.model';
// import { Langue, NiveauRequisType } from '../../Models/enums.model';

// @Component({
//   selector: 'app-offre-form',
//   templateUrl: './offre-form.component.html',
//   styleUrls: ['./offre-form.component.css']
// })
// export class OffreFormComponent implements OnInit {
//   offreForm: FormGroup;
//   isEditMode = false;
//   offreId: string | null = null;
//   tempOffreId: string | null = null;
//   departements: any[] = [];
//   filiales: any[] = [];
//   recruteurs: any[] = [];
//   typeContratOptions: string[] = ['CDI', 'CDD', 'Freelance', 'Stage']; // Adjust as needed
//   statutOptions: string[] = ['Ouvert', 'Fermé', 'En attente']; // Adjust as needed
//   modeTravailOptions: string[] = ['Présentiel', 'Télétravail', 'Hybride']; // Adjust as needed

//   constructor(
//     private fb: FormBuilder,
//     private offreService: OffreEmploiService,
//     private missionService: OffreMissionService,
//     private langueService: LangueService,
//     private competenceService: OffreCompetenceSharedService,
//     private departementService: DepartementService,
//     private filialeService: FilialeService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.offreForm = this.fb.group({
//       specialite: [''],
//       dateExpiration: [null],
//       salaireMin: [0],
//       salaireMax: [0],
//       typeContrat: [''],
//       statut: [''],
//       modeTravail: [''],
//       estActif: [true],
//       avantages: [''],
//       idRecruteur: [''],
//       idFiliale: [''],
//       idDepartement: [''],
//       offreMissions: this.fb.array([]),
//       offreLangues: this.fb.array([]),
//       offreCompetences: this.fb.array([]),
//       diplomeIds: this.fb.array([])
//     });
//   }

//   ngOnInit(): void {
//     // Fetch Departements, Filiales, and Recruteurs
//     this.departementService.getDepartements().subscribe(
//       (data) => this.departements = data,
//       (error) => console.error('Error fetching departements', error)
//     );

//     this.filialeService.getFiliales().subscribe(
//       (data) => this.filiales = data,
//       (error) => console.error('Error fetching filiales', error)
//     );

//    this.offreService.getRecruteurs().subscribe(
//   (data) => this.recruteurs = data.recruteurs,
//   (error) => console.error('Error fetching recruteurs', error)
// );

//     this.offreId = this.route.snapshot.paramMap.get('id');
//     if (this.offreId) {
//       this.isEditMode = true;
//       this.loadOffre(this.offreId);
//     }
//   }

//   loadOffre(id: string): void {
//     this.offreService.getById(id).subscribe(
//       (response) => {
//         const data = response.offreEmploi;
//         this.offreForm.patchValue({
//           specialite: data.specialite,
//           dateExpiration: new Date(data.dateExpiration).toISOString().split('T')[0],
//           salaireMin: data.SalaireMin,
//           salaireMax: data.SalaireMax,
//           typeContrat: data.typeContrat,
//           statut: data.statut,
//           modeTravail: data.modeTravail,
//           estActif: data.estactif,
//           avantages: data.avantages,
//           idRecruteur: data.idRecruteur,
//           idFiliale: data.idFiliale,
//           idDepartement: data.idDepartement
//         });
//         this.setMissions(data.offreMissions);
//         this.setLangues(data.offreLangues);
//         this.setCompetences(data.offreCompetences);
//         this.setDiplomes(data.diplomeIds);
//       },
//       (error) => console.error('Error loading offre', error)
//     );
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

//   ensureOffreId(): Promise<string> {
//     return new Promise((resolve, reject) => {
//       if (this.offreId) {
//         resolve(this.offreId);
//       } else if (this.tempOffreId) {
//         resolve(this.tempOffreId);
//       } else {
//        const tempOffre: OffreEmploi = {
//   idOffreEmploi: '',
//   specialite: this.offreForm.get('specialite')?.value || 'Temp',
//   dateExpiration: this.offreForm.get('dateExpiration')?.value || new Date(),
//   SalaireMin: this.offreForm.get('salaireMin')?.value || 0,
//   SalaireMax: this.offreForm.get('salaireMax')?.value || 0,
//   datePublication: new Date(),
//   niveauExperienceRequis: '',
//   typeContrat: this.offreForm.get('typeContrat')?.value || '',
//   statut: this.offreForm.get('statut')?.value || '',
//   modeTravail: this.offreForm.get('modeTravail')?.value || '',
//   estactif: this.offreForm.get('estActif')?.value || true,
//   avantages: this.offreForm.get('avantages')?.value || '',
//   idRecruteur: this.offreForm.get('idRecruteur')?.value || '',
//   idFiliale: this.offreForm.get('idFiliale')?.value || '',
//   idDepartement: this.offreForm.get('idDepartement')?.value || '',
//   postes: [],
//   offreMissions: [],
//   offreLangues: [],
//   offreCompetences: [],
//   diplomeIds: [],
//   nombrePostes: 0 // Add this property and assign a value
// };
//         this.offreService.addOffre(tempOffre).subscribe(
//           (response) => {
// this.tempOffreId = response.offreEmploi.idOffreEmploi ?? '';
// resolve(this.tempOffreId ?? '');          },
//           (error) => reject(error)
//         );
//       }
//     });
//   }

//  // In offre-form.component.ts
// // In offre-form.component.ts
// addMission(): void {
//     this.ensureOffreId().then((idOffreEmploi) => {
//       const newMission: OffreMission = {
//         idOffreEmploi: idOffreEmploi,
//         descriptionMission: '',
//         priorite: ''
//       };
//       this.missionService.create(newMission).subscribe(
//         (response) => {
//           const createdMission = response.mission || response;
//           this.offreMissions.push(this.fb.group({
//             idOffreEmploi: createdMission.idOffreEmploi || idOffreEmploi,
//             idMission: createdMission.idMission || '',
//             description: createdMission.description || ''
//           }));
//         },
//         (error) => console.error('Error adding mission', error)
//       );
//     }).catch((error) => {
//       console.error('Error ensuring offre ID for mission', error);
//     });
//   }
//   removeMission(index: number): void {
//     const missionId = this.offreMissions.at(index).get('idOffreMission')?.value;
//     if (missionId) {
//       this.missionService.delete(missionId).subscribe(
//         () => {
//           this.offreMissions.removeAt(index);
//         },
//         (error) => console.error('Error deleting mission', error)
//       );
//     } else {
//       this.offreMissions.removeAt(index);
//     }
//   }

//   addLangue(): void {
//     this.ensureOffreId().then((idOffreEmploi) => {
//       const newLangue: OffreLangue = {
//         idOffreEmploi: idOffreEmploi,
//         langue: Langue.Francais,
//         niveauRequis: ''
//       };
//       this.langueService.create(newLangue).subscribe(
//         (response) => {
//           const createdLangue = response.data || response;
//           this.offreLangues.push(this.fb.group({
//             idOffreLangue: createdLangue.idOffreLangue || '',
//             idOffreEmploi: createdLangue.idOffreEmploi || idOffreEmploi,
//             langue: createdLangue.langue || Langue.Francais,
//             niveauRequis: createdLangue.niveauRequis || ''
//           }));
//         },
//         (error) => console.error('Error adding langue', error)
//       );
//     }).catch((error) => {
//       console.error('Error ensuring offre ID for langue', error);
//     });
//   }

//   removeLangue(index: number): void {
//     const langueId = this.offreLangues.at(index).get('idOffreLangue')?.value;
//     if (langueId) {
//       this.langueService.delete(langueId).subscribe(
//         () => {
//           this.offreLangues.removeAt(index);
//         },
//         (error) => console.error('Error deleting langue', error)
//       );
//     } else {
//       this.offreLangues.removeAt(index);
//     }
//   }

//   addCompetence(): void {
//     this.ensureOffreId().then((idOffreEmploi) => {
//       const newCompetence: OffreCompetence = {
//         idOffreEmploi: idOffreEmploi,
//         idCompetence: '', // Will be set via form selection
//         niveauRequis: NiveauRequisType.Debutant
//       };
//       // Add to form immediately for user to select competence
//       this.offreCompetences.push(this.fb.group({
//         idOffreEmploi: newCompetence.idOffreEmploi,
//         idCompetence: newCompetence.idCompetence,
//         niveauRequis: newCompetence.niveauRequis
//       }));
//     }).catch((error) => {
//       console.error('Error ensuring offre ID for competence', error);
//     });
//   }
//   removeCompetence(index: number): void {
//     const idOffreEmploi = this.offreCompetences.at(index).get('idOffreEmploi')?.value;
//     const idCompetence = this.offreCompetences.at(index).get('idCompetence')?.value;
//     if (idOffreEmploi && idCompetence) {
//       this.competenceService.delete(idOffreEmploi, idCompetence).subscribe(
//         () => {
//           this.offreCompetences.removeAt(index);
//         },
//         (error) => console.error('Error deleting competence', error)
//       );
//     } else {
//       this.offreCompetences.removeAt(index);
//     }
//   }

//   addDiplome(): void {
//     this.diplomeIds.push(this.fb.group({
//       idDiplome: ['']
//     }));
//   }

//   removeDiplome(index: number): void {
//     this.diplomeIds.removeAt(index);
//   }

//  setMissions(missions: OffreMission[]): void {
//   const missionFGs = missions.map(mission => this.fb.group({
//     idOffreEmploi: mission.idOffreEmploi,
//     idMission: mission.idOffreMission || '',
//     description: mission.descriptionMission
//   }));
//   const missionFormArray = this.fb.array(missionFGs);
//   this.offreForm.setControl('offreMissions', missionFormArray);
// }

//   setLangues(langues: OffreLangue[]): void {
//     const langueFGs = langues.map(langue => this.fb.group(langue));
//     const langueFormArray = this.fb.array(langueFGs);
//     this.offreForm.setControl('offreLangues', langueFormArray);
//   }

//   setCompetences(competences: OffreCompetence[]): void {
//     const competenceFGs = competences.map(comp => this.fb.group({
//       idOffreEmploi: comp.idOffreEmploi,
//       idCompetence: comp.idCompetence,
//       niveauRequis: comp.niveauRequis
//     }));
//     const competenceFormArray = this.fb.array(competenceFGs);
//     this.offreForm.setControl('offreCompetences', competenceFormArray);
//   }

//   setDiplomes(diplomeIds: string[]): void {
//     const diplomeFGs = diplomeIds.map(id => this.fb.group({ idDiplome: id }));
//     const diplomeFormArray = this.fb.array(diplomeFGs);
//     this.offreForm.setControl('diplomeIds', diplomeFormArray);
//   }

//   onSubmit(): void {
//     if (this.offreForm.valid) {
//       const offreData: OffreEmploi = this.offreForm.value;
//       offreData.datePublication = new Date(); // Set datePublication
//       offreData.niveauExperienceRequis = ''; // Set default or fetch from form if added
//       offreData.postes = []; // Set default or fetch from form if added
//       if (this.isEditMode) {
//         this.offreService.update(this.offreId!, offreData).subscribe(
//           () => this.router.navigate(['/offres']),
//           (error) => console.error('Error updating offre', error)
//         );
//       } else {
//         this.offreService.addOffre(offreData).subscribe(
//           (response) => {
//             if (this.tempOffreId && response.offreEmploi.idOffreEmploi) {
//               this.tempOffreId = response.offreEmploi.idOffreEmploi;
//             }
//             this.router.navigate(['/offres']);
//           },
//           (error) => console.error('Error creating offre', error)
//         );
//       }
//     }
//   }

//   onCancel(): void {
//     this.router.navigate(['/offres']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { OffreMissionService } from '../../shared/services/offre-mission.service';
import { OffreCompetenceSharedService } from '../../shared/services/offre-competence.service';
import { LangueService } from '../../shared/services/langue.service';
import { DepartementService } from '../../shared/services/departement.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { OffreEmploi, OffreLangue, OffreMission } from '../../Models/offre-emploi.model';
import { OffreCompetence } from '../../Models/offre-competence.model';
import { Langue, NiveauRequisType } from '../../Models/enums.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offre-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './offre-form.component.html',
  styleUrls: ['./offre-form.component.css']
})
export class OffreFormComponent implements OnInit {
  offreForm: FormGroup;
  isEditMode = false;
  offreId: string | null = null;
  tempOffreId: string | null = null;
  departements: any[] = [];
  filiales: any[] = [];
  recruteurs: any[] = [];
  typeContratOptions: string[] = ['CDI', 'CDD', 'Freelance', 'Stage'];
  statutOptions: string[] = ['Ouvert', 'Fermé', 'En attente'];
  modeTravailOptions: string[] = ['Présentiel', 'Télétravail', 'Hybride'];

  constructor(
    private fb: FormBuilder,
    private offreService: OffreEmploiService,
    private missionService: OffreMissionService,
    private langueService: LangueService,
    private competenceService: OffreCompetenceSharedService,
    private departementService: DepartementService,
    private filialeService: FilialeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.offreForm = this.fb.group({
      specialite: ['', Validators.required],
      dateExpiration: [null, Validators.required],
      salaireMin: [0, [Validators.required, Validators.min(0)]],
      salaireMax: [0, [Validators.required, Validators.min(0)]],
      typeContrat: ['', Validators.required],
      statut: ['', Validators.required],
      modeTravail: ['', Validators.required],
      estActif: [true],
      avantages: [''],
      idRecruteur: ['', Validators.required],
      idFiliale: ['', Validators.required],
      idDepartement: ['', Validators.required],
      offreMissions: this.fb.array([]),
      offreLangues: this.fb.array([]),
      offreCompetences: this.fb.array([]),
      diplomeIds: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Fetch Departements, Filiales, and Recruteurs
    this.loadDepartements();
    this.loadFiliales();
    this.loadRecruteurs();

    this.offreId = this.route.snapshot.paramMap.get('id');
    if (this.offreId) {
      this.isEditMode = true;
      this.loadOffre(this.offreId);
    }
  }

  loadDepartements(): void {
    this.departementService.getDepartements().subscribe(
      (data) => this.departements = data,
      (error) => console.error('Error fetching departements', error)
    );
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe(
      (data) => this.filiales = data,
      (error) => console.error('Error fetching filiales', error)
    );
  }

  loadRecruteurs(): void {
    this.offreService.getRecruteurs().subscribe(
      (data) => this.recruteurs = data.recruteurs,
      (error) => console.error('Error fetching recruteurs', error)
    );
  }

  loadOffre(id: string): void {
    this.offreService.getById(id).subscribe(
      (response) => {
        const data = response.offreEmploi;
        this.offreForm.patchValue({
          specialite: data.specialite,
          dateExpiration: new Date(data.dateExpiration).toISOString().split('T')[0],
          salaireMin: data.SalaireMin,
          salaireMax: data.SalaireMax,
          typeContrat: data.typeContrat,
          statut: data.statut,
          modeTravail: data.modeTravail,
          estActif: data.estactif,
          avantages: data.avantages,
          idRecruteur: data.idRecruteur,
          idFiliale: data.idFiliale,
          idDepartement: data.idDepartement
        });
        this.setMissions(data.offreMissions || []);
        this.setLangues(data.offreLangues || []);
        this.setCompetences(data.offreCompetences || []);
        this.setDiplomes(data.diplomeIds || []);
      },
      (error) => console.error('Error loading offre', error)
    );
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

  ensureOffreId(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.offreId) {
        // Si on est en mode édition, utiliser l'ID existant
        resolve(this.offreId);
      } else if (this.tempOffreId) {
        // Si on a déjà créé un ID temporaire
        resolve(this.tempOffreId);
      } else {
        // Créer une offre temporaire pour obtenir un ID
        const tempOffre: OffreEmploi = {
          idOffreEmploi: '',
          specialite: this.offreForm.get('specialite')?.value || 'Temp',
          dateExpiration: this.offreForm.get('dateExpiration')?.value || new Date(),
          SalaireMin: this.offreForm.get('salaireMin')?.value || 0,
          SalaireMax: this.offreForm.get('salaireMax')?.value || 0,
          datePublication: new Date(),
          niveauExperienceRequis: '',
          typeContrat: this.offreForm.get('typeContrat')?.value || '',
          statut: this.offreForm.get('statut')?.value || '',
          modeTravail: this.offreForm.get('modeTravail')?.value || '',
          estactif: this.offreForm.get('estActif')?.value || true,
          avantages: this.offreForm.get('avantages')?.value || '',
          idRecruteur: this.offreForm.get('idRecruteur')?.value || '',
          idFiliale: this.offreForm.get('idFiliale')?.value || '',
          idDepartement: this.offreForm.get('idDepartement')?.value || '',
          postes: [],
          offreMissions: [],
          offreLangues: [],
          offreCompetences: [],
          diplomeIds: [],
          nombrePostes: 0
        };
        
       this.offreService.addOffre(tempOffre).subscribe(
  (response) => {
    this.tempOffreId = response.offreEmploi.idOffreEmploi ?? '';
    resolve(this.tempOffreId!);
  },
  (error) => reject(error)
);
      }
    });
  }

  // Méthode pour ajouter une mission
addMission(): void {
  this.ensureOffreId().then((idOffreEmploi) => {
    const newMission: OffreMission = {
      idOffreEmploi: idOffreEmploi,
      idOffreMission: '', // Laisser vide, sera généré par le backend
      descriptionMission: '', // Respecter l'interface
      priorite: 0 // Valeur par défaut
    };
    this.missionService.create(newMission).subscribe(
      (response) => {
        // Ajuster selon la structure réelle de la réponse API
        const createdMission = response.mission || response.data || response;
        if (createdMission) {
          this.offreMissions.push(this.fb.group({
            idOffreEmploi: createdMission.idOffreEmploi || idOffreEmploi,
            idOffreMission: createdMission.idOffreMission || '',
            descriptionMission: createdMission.descriptionMission || '', // Utiliser descriptionMission
            priorite: createdMission.priorite || 0
          }));
        } else {
          console.error('Invalid mission response:', response);
        }
      },
      (error) => {
        console.error('Error adding mission:', error);
      }
    );
  }).catch((error) => {
    console.error('Error ensuring offre ID for mission:', error);
  });
}
  // Méthode pour supprimer une mission
  removeMission(index: number): void {
    const mission = this.offreMissions.at(index).value;
    const missionId = mission.idOffreMission;
    
    if (missionId) {
      this.missionService.delete(missionId).subscribe(
        () => {
          this.offreMissions.removeAt(index);
        },
        (error) => console.error('Error deleting mission', error)
      );
    } else {
      this.offreMissions.removeAt(index);
    }
  }

  // Méthode pour ajouter une langue
  addLangue(): void {
    this.ensureOffreId().then((idOffreEmploi) => {
      const newLangue: OffreLangue = {
        idOffreEmploi: idOffreEmploi,
        langue: Langue.Francais,
        niveauRequis: ''
      };
      
      this.langueService.create(newLangue).subscribe(
        (response) => {
          const createdLangue = response.data || response;
          this.offreLangues.push(this.fb.group({
            idOffreLangue: createdLangue.idOffreLangue || '',
            idOffreEmploi: createdLangue.idOffreEmploi || idOffreEmploi,
            langue: createdLangue.langue || Langue.Francais,
            niveauRequis: createdLangue.niveauRequis || ''
          }));
        },
        (error) => console.error('Error adding langue', error)
      );
    }).catch((error) => {
      console.error('Error ensuring offre ID for langue', error);
    });
  }

  // Méthode pour supprimer une langue
  removeLangue(index: number): void {
    const langue = this.offreLangues.at(index).value;
    const langueId = langue.idOffreLangue;
    
    if (langueId) {
      this.langueService.delete(langueId).subscribe(
        () => {
          this.offreLangues.removeAt(index);
        },
        (error) => console.error('Error deleting langue', error)
      );
    } else {
      this.offreLangues.removeAt(index);
    }
  }

  // Méthode pour ajouter une compétence
 addCompetence(): void {
    this.ensureOffreId().then((idOffreEmploi) => {
      const newCompetence: OffreCompetence = {
        idOffreEmploi: idOffreEmploi,
        idCompetence: '', // Will be set via form selection
        niveauRequis: NiveauRequisType.Debutant
      };
      // Add to form immediately for user to select competence
      this.offreCompetences.push(this.fb.group({
        idOffreEmploi: newCompetence.idOffreEmploi,
        idCompetence: newCompetence.idCompetence,
        niveauRequis: newCompetence.niveauRequis
      }));
    }).catch((error) => {
      console.error('Error ensuring offre ID for competence', error);
    });
  }
  // Méthode pour supprimer une compétence
  removeCompetence(index: number): void {
    const competence = this.offreCompetences.at(index).value;
    const idOffreEmploi = competence.idOffreEmploi;
    const idCompetence = competence.idCompetence;
    
    if (idOffreEmploi && idCompetence) {
      this.competenceService.delete(idOffreEmploi, idCompetence).subscribe(
        () => {
          this.offreCompetences.removeAt(index);
        },
        (error) => console.error('Error deleting competence', error)
      );
    } else {
      this.offreCompetences.removeAt(index);
    }
  }

  // Méthode pour ajouter un diplôme
  addDiplome(): void {
    this.diplomeIds.push(this.fb.group({
      idDiplome: ['', Validators.required]
    }));
  }

  // Méthode pour supprimer un diplôme
  removeDiplome(index: number): void {
    this.diplomeIds.removeAt(index);
  }

  // Méthode pour définir les missions dans le formulaire
 setMissions(missions: OffreMission[]): void {
  const missionFGs = missions.map(mission => this.fb.group({
    idOffreEmploi: mission.idOffreEmploi,
    idOffreMission: mission.idOffreMission || '',
    descriptionMission: mission.descriptionMission,
    priorite: mission.priorite || 0
  }));
  const missionFormArray = this.fb.array(missionFGs);
  this.offreForm.setControl('offreMissions', missionFormArray);
}

  // Méthode pour définir les langues dans le formulaire
  setLangues(langues: OffreLangue[]): void {
    const langueFGs = langues.map(langue => this.fb.group({
      idOffreLangue: langue.idOffreLangue || '',
      idOffreEmploi: langue.idOffreEmploi,
      langue: langue.langue,
      niveauRequis: langue.niveauRequis
    }));
    
    const langueFormArray = this.fb.array(langueFGs);
    this.offreForm.setControl('offreLangues', langueFormArray);
  }

  // Méthode pour définir les compétences dans le formulaire
  setCompetences(competences: OffreCompetence[]): void {
    const competenceFGs = competences.map(comp => this.fb.group({
      idOffreEmploi: comp.idOffreEmploi,
      idCompetence: comp.idCompetence,
      niveauRequis: comp.niveauRequis
    }));
    
    const competenceFormArray = this.fb.array(competenceFGs);
    this.offreForm.setControl('offreCompetences', competenceFormArray);
  }

  // Méthode pour définir les diplômes dans le formulaire
  setDiplomes(diplomeIds: string[]): void {
    const diplomeFGs = diplomeIds.map(id => this.fb.group({ 
      idDiplome: id 
    }));
    
    const diplomeFormArray = this.fb.array(diplomeFGs);
    this.offreForm.setControl('diplomeIds', diplomeFormArray);
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    if (this.offreForm.valid) {
      const formValue = this.offreForm.value;
      
      // Préparation des données de l'offre
      const offreData: OffreEmploi = {
        idOffreEmploi: this.offreId || this.tempOffreId || '',
        specialite: formValue.specialite,
        dateExpiration: formValue.dateExpiration,
        SalaireMin: formValue.salaireMin,
        SalaireMax: formValue.salaireMax,
        datePublication: new Date(),
        niveauExperienceRequis: '',
        typeContrat: formValue.typeContrat,
        statut: formValue.statut,
        modeTravail: formValue.modeTravail,
        estactif: formValue.estActif,
        avantages: formValue.avantages,
        idRecruteur: formValue.idRecruteur,
        idFiliale: formValue.idFiliale,
        idDepartement: formValue.idDepartement,
        postes: [],
        nombrePostes: 0,
        
        // Préparation des entités associées
        offreMissions: formValue.offreMissions.map((m: any) => ({
          idOffreMission: m.idOffreMission || '',
          idOffreEmploi: this.offreId || this.tempOffreId || '',
          descriptionMission: m.description
        })),
        
        offreLangues: formValue.offreLangues.map((l: any) => ({
          idOffreLangue: l.idOffreLangue || '',
          idOffreEmploi: this.offreId || this.tempOffreId || '',
          langue: l.langue,
          niveauRequis: l.niveauRequis
        })),
        
        offreCompetences: formValue.offreCompetences.map((c: any) => ({
          idOffreEmploi: this.offreId || this.tempOffreId || '',
          idCompetence: c.idCompetence,
          niveauRequis: c.niveauRequis
        })),
        
        diplomeIds: formValue.diplomeIds.map((d: any) => d.idDiplome)
      };

      if (this.isEditMode) {
        this.offreService.update(this.offreId!, offreData).subscribe(
          () => this.router.navigate(['/offres']),
          (error) => console.error('Error updating offre', error)
        );
      } else {
        this.offreService.addOffre(offreData).subscribe(
          (response) => {
            this.router.navigate(['/offres']);
          },
          (error) => console.error('Error creating offre', error)
        );
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs de validation
      this.markFormGroupTouched(this.offreForm);
    }
  }

  // Méthode pour marquer tous les champs du formulaire comme touchés
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.markFormGroupTouched(control.at(i) as FormGroup);
          }
        }
      }
    });
  }

  // Méthode pour annuler la modification
  onCancel(): void {
    this.router.navigate(['/offres']);
  }
}