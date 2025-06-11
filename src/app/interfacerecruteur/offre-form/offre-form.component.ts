import { OffreCompetence } from './../../Models/offre-competence.model';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Competence } from '../../Models/competence.model';
import { CompetenceService } from '../../shared/services/competence.service';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { DiplomeService } from '../../shared/services/diplome.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { UserService } from '../../shared/services/user.service';
import { DepartementService } from '../../shared/services/departement.service';
import { Recruiter } from '../../Models/recruiter.model';
import { CreateOffreEmploiRequest, Diplome, OffreEmploi, OffreMission, Poste, OffreLangue } from '../../Models/offre-emploi.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Filiale } from '../../Models/filiale.model';
import { Departement } from '../../Models/departement';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../../shared/auth.interceptor';
import { PosteService } from '../../shared/services/poste.service';
import { OffreMissionService } from '../../shared/services/offre-mission.service';
import { LangueService } from '../../shared/services/langue.service';
import { OffreCompetenceService } from '../../shared/services/offre-competence.service';
import { forkJoin } from 'rxjs';
import { NiveauRequisType } from '../../Models/enums.model';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-offre-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule,FooterComponent,HeaderComponent,SidebarComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  templateUrl: './offre-form.component.html',
  styleUrls: ['./offre-form.component.css']
})
export class OffreFormComponent implements OnInit {
  offreForm: FormGroup;
  competences: Competence[] = [];
  diplomes: Diplome[] = [];
  filiales: Filiale[] = [];
  departements: Departement[] = [];
  recruteurs: Recruiter[] = [];
  typeContrats: string[] = [];
  statuts: string[] = [];
  modesTravail: string[] = [];
  niveauxRequis: string[] = [];
  languesDisponibles: string[] = ['Francais', 'Anglais', 'Espagnol', 'Allemand', 'Arabe'];
  isEditMode = false;
  currentOffreId: string | null = null;
  submitted = false;
  sidebarOpen: boolean = false;

  minLengthArray(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return control.length >= min ? null : { minLengthArray: { requiredLength: min, actualLength: control.length } };
      }
      return null;
    };
  }

  constructor(
    private fb: FormBuilder,
    private competenceService: CompetenceService,
    private offreService: OffreEmploiService,
    private diplomeService: DiplomeService,
    private filialeService: FilialeService,
    private userService: UserService,
    private posteService: PosteService,
    private missionService: OffreMissionService,
    private langueService: LangueService,
    private offreCompetenceService: OffreCompetenceService,
    private departementService: DepartementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.offreForm = this.fb.group({
      titreOffre: ['', Validators.required],
      descriptionOffre: ['', Validators.required],
      specialite: ['', Validators.required],
      datePublication: [{ value: new Date().toISOString().split('T')[0], disabled: true }],
      dateExpiration: ['', Validators.required],
      salaireMin: [0, [Validators.required, Validators.min(0)]],
      salaireMax: [0, [Validators.required, Validators.min(0)]],
      niveauExperienceRequis: ['', Validators.required],
      typeContrat: ['', Validators.required],
      statut: ['', Validators.required],
      modeTravail: ['', Validators.required],
      avantages: [''],
      estActif: [true],
      idFiliale: ['', Validators.required],
      idDepartement: ['', Validators.required],
      idRecruteur: ['', Validators.required],
      diplomeIds: this.fb.array([], this.minLengthArray(1)),
      offreCompetences: this.fb.array([], this.minLengthArray(1)),
      postes: this.fb.array([], this.minLengthArray(1)),
      offreMissions: this.fb.array([], this.minLengthArray(1)),
      offreLangues: this.fb.array([], this.minLengthArray(1))
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.currentOffreId = id;
        this.loadOffre(id);
      }
    });
  }

  loadData(): void {
    const loadOperations = [
      this.loadCompetences(),
      this.loadDiplomes(),
      this.loadFiliales(),
      this.loadDepartements(),
      this.loadRecruteurs(),
      this.loadEnums()
    ];

    forkJoin(loadOperations).subscribe({
      next: () => console.log('All data loaded successfully.'),
      error: (error) => console.error('Error loading data:', error)
    });
  }
 toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
  loadEnums(): void {
    this.offreService.getTypesContrat().subscribe({
      next: (types) => this.typeContrats = Array.isArray(types) ? types : [],
      error: (error) => {
        console.error('Erreur chargement types contrat:', error);
        this.typeContrats = [];
      }
    });

    this.offreService.getStatuts().subscribe({
      next: (statuts) => this.statuts = Array.isArray(statuts) ? statuts : [],
      error: (error) => {
        console.error('Erreur chargement statuts:', error);
        this.statuts = [];
      }
    });

    this.offreService.getModesTravail().subscribe({
      next: (modes) => this.modesTravail = Array.isArray(modes) ? modes : [],
      error: (error) => {
        console.error('Erreur chargement modes travail:', error);
        this.modesTravail = [];
      }
    });

    this.offreService.getNiveauxRequis().subscribe({
      next: (niveaux) => this.niveauxRequis = Array.isArray(niveaux) ? niveaux : [],
      error: (error) => {
        console.error('Erreur chargement niveaux requis:', error);
        this.niveauxRequis = [];
      }
    });
  }

  loadCompetences(): void {
    this.competenceService.getAllCompetences().subscribe({
      next: (data) => {
        this.competences = Array.isArray(data) ? data : [];
        console.log('Competences loaded:', this.competences.length, 'items');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur chargement compétences:', error);
        this.competences = [];
      }
    });
  }

  loadDiplomes(): void {
    this.diplomeService.getAll().subscribe({
      next: (data) => {
        this.diplomes = data || [];
        console.log('Diplomes loaded:', this.diplomes);
      },
      error: (error) => console.error('Erreur chargement diplômes:', error)
    });
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (data) => {
        this.filiales = Array.isArray(data) ? data : [];
        console.log('Filiales loaded:', this.filiales.length, 'items');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur chargement filiales:', error);
        this.filiales = [];
      }
    });
  }

  loadDepartements(): void {
    this.departementService.getDepartements().subscribe({
      next: (data) => {
        this.departements = Array.isArray(data) ? data : [];
        console.log('Departements loaded:', this.departements.length, 'items');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur chargement départements:', error);
        this.departements = [];
      }
    });
  }

  loadRecruteurs(): void {
    this.offreService.getRecruitersSimple().subscribe({
      next: (data) => {
        this.recruteurs = Array.isArray(data) ? data : [];
        console.log('Recruteurs loaded:', this.recruteurs.length, 'items');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur chargement recruteurs:', error);
        this.recruteurs = [];
      }
    });
  }

  loadOffre(id: string): void {
    this.offreService.getById(id).subscribe({
      next: (offre) => this.populateForm(offre),
      error: (error) => console.error('Erreur chargement offre:', error)
    });
  }

  populateForm(offre: OffreEmploi): void {
    this.offreForm.patchValue({
      titreOffre: offre.TitreOffre,
      descriptionOffre: offre.descriptionOffre,
      specialite: offre.specialite,
      datePublication: offre.datePublication?.split('T')[0],
      dateExpiration: offre.dateExpiration?.split('T')[0],
      salaireMin: offre.salaireMin,
      salaireMax: offre.salaireMax,
      niveauExperienceRequis: offre.niveauExperienceRequis,
      typeContrat: offre.typeContrat,
      statut: offre.statut,
      modeTravail: offre.modeTravail,
      avantages: offre.avantages,
      estActif: offre.estActif,
      idFiliale: offre.idFiliale,
      idDepartement: offre.idDepartement,
      idRecruteur: offre.idRecruteur
    });

    this.diplomeIds.clear();
    offre.diplomes?.forEach(d => this.addDiplome(d.nomDiplome, d.domaine, d.niveau));

    this.offreCompetences.clear();
    offre.offreCompetences?.forEach(c => {
      this.addCompetence();
      const lastIndex = this.offreCompetences.length - 1;
      const isNew = !this.competences.some(comp => comp.id === c.idCompetence);
      this.offreCompetences.at(lastIndex).patchValue({
        idCompetence: isNew ? '' : c.idCompetence,
        newCompetenceName: isNew ? c.competence?.nom : '',
        description: isNew ? c.competence?.description || '' : '',
        estTechnique: isNew ? c.competence?.estTechnique || false : false,
        estSoftSkill: isNew ? c.competence?.estSoftSkill || false : false,
        niveauRequis: c.niveauRequis,
        isNew: isNew
      });
    });

    this.postes.clear();
    offre.postes?.forEach(p => {
      this.addPoste();
      const lastIndex = this.postes.length - 1;
      this.postes.at(lastIndex).patchValue({
        titrePoste: p.titrePoste,
        nombrePostes: p.nombrePostes,
        niveauHierarchique: p.niveauHierarchique,
        description: p.description
      });
    });

    this.offreMissions.clear();
    offre.offreMissions?.forEach(m => {
      this.addMission();
      const lastIndex = this.offreMissions.length - 1;
      this.offreMissions.at(lastIndex).patchValue({
        descriptionMission: m.descriptionMission,
        priorite: m.priorite
      });
    });

    this.offreLangues.clear();
    offre.offreLangues?.forEach(l => {
      this.addLangue();
      const lastIndex = this.offreLangues.length - 1;
      this.offreLangues.at(lastIndex).patchValue({
        langue: l.langue,
        niveauRequis: l.niveauRequis
      });
    });
  }

  get diplomeIds(): FormArray { return this.offreForm.get('diplomeIds') as FormArray; }
  get offreCompetences(): FormArray { return this.offreForm.get('offreCompetences') as FormArray; }
  get postes(): FormArray { return this.offreForm.get('postes') as FormArray; }
  get offreMissions(): FormArray { return this.offreForm.get('offreMissions') as FormArray; }
  get offreLangues(): FormArray { return this.offreForm.get('offreLangues') as FormArray; }

  addDiplome(nomDiplome: string = '', domaine: string = '', niveau: string = ''): void {
    this.diplomeIds.push(this.fb.group({
      nomDiplome: [nomDiplome, Validators.required],
      domaine: [domaine, Validators.required],
      niveau: [niveau, Validators.required]
    }));
  }

  removeDiplome(index: number): void {
    this.diplomeIds.removeAt(index);
  }

  addCompetence(): void {
    const competenceGroup = this.fb.group({
      idCompetence: ['', Validators.required],
      newCompetenceName: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      estTechnique: [{ value: false, disabled: true }],
      estSoftSkill: [{ value: false, disabled: true }],
      niveauRequis: ['', Validators.required],
      isNew: [false]
    });
    this.offreCompetences.push(competenceGroup);
  }

  removeCompetence(index: number): void {
    const competenceGroup = this.offreCompetences.at(index) as FormGroup;
    const isNew = competenceGroup.get('isNew')?.value;
    if (isNew && competenceGroup.get('newCompetenceName')?.value) {
      this.competenceService.deleteCompetence(competenceGroup.get('idCompetence')?.value).subscribe({
        next: () => console.log('Competence removed'),
        error: (error) => console.error('Error removing competence:', error)
      });
    }
    this.offreCompetences.removeAt(index);
  }

  onNewCompetenceChange(index: number): void {
    const competenceGroup = this.offreCompetences.at(index) as FormGroup;
    const isNew = competenceGroup.get('isNew')?.value;

    competenceGroup.patchValue({
      idCompetence: '',
      newCompetenceName: '',
      description: '',
      estTechnique: false,
      estSoftSkill: false
    });

    competenceGroup.get('idCompetence')?.clearValidators();
    competenceGroup.get('newCompetenceName')?.clearValidators();
    competenceGroup.get('description')?.clearValidators();

    if (isNew) {
      competenceGroup.get('newCompetenceName')?.setValidators([Validators.required]);
      competenceGroup.get('description')?.setValidators([Validators.required]);
      competenceGroup.get('idCompetence')?.disable();
      competenceGroup.get('newCompetenceName')?.enable();
      competenceGroup.get('description')?.enable();
      competenceGroup.get('estTechnique')?.enable();
      competenceGroup.get('estSoftSkill')?.enable();
    } else {
      competenceGroup.get('idCompetence')?.setValidators([Validators.required]);
      competenceGroup.get('idCompetence')?.enable();
      competenceGroup.get('newCompetenceName')?.disable();
      competenceGroup.get('description')?.disable();
      competenceGroup.get('estTechnique')?.disable();
      competenceGroup.get('estSoftSkill')?.disable();
    }

    competenceGroup.get('idCompetence')?.updateValueAndValidity();
    competenceGroup.get('newCompetenceName')?.updateValueAndValidity();
    competenceGroup.get('description')?.updateValueAndValidity();
  }

  addPoste(): void {
    this.postes.push(this.fb.group({
      titrePoste: ['', Validators.required],
      nombrePostes: [1, [Validators.required, Validators.min(1)]],
      niveauHierarchique: ['', Validators.required],
      description: ['', Validators.required]
    }));
  }

  removePoste(index: number): void {
    this.postes.removeAt(index);
  }

  addMission(): void {
    this.offreMissions.push(this.fb.group({
      descriptionMission: ['', Validators.required],
      priorite: ['']
    }));
  }

  removeMission(index: number): void {
    this.offreMissions.removeAt(index);
  }

  addLangue(): void {
    this.offreLangues.push(this.fb.group({
      langue: ['', Validators.required],
      niveauRequis: ['', Validators.required]
    }));
  }

  removeLangue(index: number): void {
    this.offreLangues.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.diplomeIds.length === 0) {
      Swal.fire('Erreur', 'Au moins un diplôme est requis', 'error');
      return;
    }
    if (this.offreCompetences.length === 0) {
      Swal.fire('Erreur', 'Au moins une compétence est requise', 'error');
      return;
    }
    if (this.postes.length === 0) {
      Swal.fire('Erreur', 'Au moins un poste est requis', 'error');
      return;
    }
    if (this.offreMissions.length === 0) {
      Swal.fire('Erreur', 'Au moins une mission est requise', 'error');
      return;
    }
    if (this.offreLangues.length === 0) {
      Swal.fire('Erreur', 'Au moins une langue est requise', 'error');
      return;
    }

    if (this.offreForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    try {
      const newCompetences = this.offreCompetences.value
        .filter((c: any) => c.isNew && c.newCompetenceName)
        .map((c: any) => {
          const newCompetence: Competence = {
            id: '', // Will be set by backend
            nom: c.newCompetenceName,
            description: c.description || '',
            estTechnique: c.estTechnique || false,
            estSoftSkill: c.estSoftSkill || false,
            dateModification: new Date(),
            dateAjout: new Date()
          };
          return this.competenceService.createCompetence(newCompetence).toPromise();
        });

      const createdCompetences = await Promise.all(newCompetences);
const processedCompetences = this.offreCompetences.value.map((c: any, i: number) => {
            if (c.isNew && createdCompetences[i]) {
          return { idCompetence: createdCompetences[i].id, niveauRequis: c.niveauRequis as NiveauRequisType };
        } else if (!c.isNew && c.idCompetence) {
          return { idCompetence: c.idCompetence, niveauRequis: c.niveauRequis as NiveauRequisType };
        }
        return null;
}).filter((c: { idCompetence: string; niveauRequis: NiveauRequisType }) => c !== null);

      const formData = this.offreForm.getRawValue();
      const createRequest: CreateOffreEmploiRequest = {
        dto: {
    idOffreEmploi: this.isEditMode && this.currentOffreId ? this.currentOffreId : newGuid().toString(),
          TitreOffre: formData.titreOffre,
         descriptionOffre: formData.descriptionOffre,
          specialite: formData.specialite,
datePublication: new Date(formData.datePublication).toISOString(),
dateExpiration: formData.dateExpiration ? new Date(formData.dateExpiration).toISOString() : '',
          salaireMax: formData.salaireMin,
         salaireMin: formData.salaireMax,
          niveauExperienceRequis: formData.niveauExperienceRequis,
          typeContrat: formData.typeContrat,
          statut: formData.statut,
         modeTravail: formData.modeTravail,
          avantages: formData.avantages,
          estActif: formData.estActif,
          idRecruteur: formData.idRecruteur,
          idFiliale: formData.idFiliale,
          idDepartement: formData.idDepartement,
        postes: formData.postes.map((p: any) => ({
            TitrePoste: p.titrePoste,
            Description: p.description,
            NombrePostes: p.nombrePostes,
            NiveauHierarchique: p.niveauHierarchique
          })),
          offreMissions: formData.offreMissions.map((m : any) => ({
  DescriptionMission: m.descriptionMission,
  Priorite: m.priorite || 0
})),
        offreLangues: formData.offreLangues.map((l: any) => ({
  Langue: l.langue,
  NiveauRequis: l.niveauRequis
})),
offreCompetences: processedCompetences,
diplomeIds: formData.diplomeIds.map((d: any) => ({
  NomDiplome: d.nomDiplome,
  Domaine: d.domaine,
  Niveau: d.niveau
}))
        }
      };

      if (this.isEditMode && this.currentOffreId) {
this.offreService.update(this.currentOffreId, createRequest.dto).subscribe({
          next: (response) => {
            console.log('Update response:', response);
            Swal.fire('Succès', 'Offre mise à jour avec succès', 'success');
            this.router.navigate(['/offres']);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erreur mise à jour offre:', error);
            const errorMessage = error.error?.message || error.message || 'Erreur inconnue';
            Swal.fire('Erreur', `Échec de la mise à jour: ${errorMessage}`, 'error');
          }
        });
      } else {
        this.offreService.addOffre(createRequest).subscribe({
          next: (response) => {
            console.log('Create response:', response);
            Swal.fire('Succès', 'Offre créée avec succès', 'success');
            this.router.navigate(['/offres']);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erreur création offre:', error);
            const errorMessage = error.error?.message || error.message || 'Erreur inconnue';
            Swal.fire('Erreur', `Échec de la création: ${errorMessage}`, 'error');
          }
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Swal.fire('Erreur', 'Une erreur inattendue s\'est produite', 'error');
    }
  }

  cancel(): void {
    this.router.navigate(['/offres']);
  }
}


function newGuid(): string {
  // generate and return a GUID string
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
