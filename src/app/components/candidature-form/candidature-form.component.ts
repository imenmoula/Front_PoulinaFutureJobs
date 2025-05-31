import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CandidatureService } from '../../shared/services/candidature.service';
import { ProfileService } from '../../shared/services/profile.service';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { CompetenceService } from '../../shared/services/competence.service';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatureCompleteDto, CompetenceInputDto, NiveauCompetence } from '../../Models/Candidature.model';
import { OffreEmploi } from '../../Models/offre-emploi.model';
import Swal from 'sweetalert2';
import { OffreCompetenceService } from '../../shared/services/offre-competence.service';
import { StatutOffre } from '../../Models/enums.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidature-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './candidature-form.component.html',
  styleUrls: ['./candidature-form.component.css']
})
export class CandidatureFormComponent implements OnInit {

  @Input() offreId: string | null = null;
  postulerForm!: FormGroup;
  offre: OffreEmploi | null = null;
  availableCompetences: CompetenceInputDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  userId: string | null = null;
  requiredSkills: any[] = [];
  skillLevels = [
    { value: 0, label: 'Débutant' },
    { value: 1, label: 'Intermédiaire' },
    { value: 2, label: 'Avancé' },
    { value: 3, label: 'Expert' }
  ];

  constructor(
    private fb: FormBuilder,
    private candidatureService: CandidatureService,
    private profileService: ProfileService,
    private offreService: OffreEmploiService,
    private competenceService: CompetenceService,
    private offreCompetenceService: OffreCompetenceService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.errorMessage = "Vous devez être connecté pour postuler";
      return;
    }

    if (!this.offreId) {
      this.offreId = this.route.snapshot.paramMap.get('offreId');
    }

    if (!this.offreId) {
      this.errorMessage = "Aucune offre sélectionnée";
      return;
    }

    this.initializeForm();
    this.loadInitialData(this.offreId, this.userId);
  }

  initializeForm(): void {
    this.postulerForm = this.fb.group({
      appUserId: [this.userId, Validators.required],
      offreId: [this.offreId, Validators.required],
      messageMotivation: ['', [Validators.required, Validators.minLength(100)]],
      cvFilePath: ['', Validators.required],
      lettreMotivation: [''],
      linkedIn: ['', Validators.pattern(/https?:\/\/(www\.)?linkedin\.com\/in\/[a-z-]+\/?/i)],
      github: ['', Validators.pattern(/https?:\/\/(www\.)?github\.com\/[a-z-]+\/?/i)],
      portfolio: [''],
      statutCandidate: ['Debutant', Validators.required],
      fullName: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: [null],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      pays: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      entreprise: [''],
      poste: [''],
      photoUrl: [''],
      diplomes: this.fb.array([]),
      experiences: this.fb.array([]),
      competences: this.fb.array([], Validators.required),
      certificats: this.fb.array([])
    });
  }

  // Méthodes pour gérer les FormArrays
  get diplomes(): FormArray {
    return this.postulerForm.get('diplomes') as FormArray;
  }

  addDiplome(): void {
    this.diplomes.push(this.fb.group({
      nomDiplome: ['', Validators.required],
      institution: ['', Validators.required],
      dateObtention: [null, Validators.required],
      specialite: [''],
      urlDocument: ['']
    }));
  }

  removeDiplome(index: number): void {
    this.diplomes.removeAt(index);
  }

  get experiences(): FormArray {
    return this.postulerForm.get('experiences') as FormArray;
  }

  addExperience(): void {
    this.experiences.push(this.fb.group({
      poste: ['', Validators.required],
      nomEntreprise: ['', Validators.required],
      dateDebut: [null, Validators.required],
      dateFin: [null],
      description: [''],
      competenceAcquise: ['']
    }));
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
  }

  get certificats(): FormArray {
    return this.postulerForm.get('certificats') as FormArray;
  }

  addCertificat(): void {
    this.certificats.push(this.fb.group({
      nom: ['', Validators.required],
      organisme: ['', Validators.required],
      dateObtention: [null, Validators.required],
      description: [''],
      urlDocument: ['']
    }));
  }

  removeCertificat(index: number): void {
    this.certificats.removeAt(index);
  }

  get competences(): FormArray {
    return this.postulerForm.get('competences') as FormArray;
  }

  addCompetence(): void {
    this.competences.push(this.fb.group({
      competenceId: ['', Validators.required],
      niveauPossede: [NiveauCompetence.Debutant, Validators.required]
    }));
  }

  removeCompetence(index: number): void {
    this.competences.removeAt(index);
  }

  isSkillAdded(skillId: string): boolean {
    return this.competences.controls.some(
      control => control.value.competenceId === skillId
    );
  }

  toggleRequiredSkill(skill: any): void {
    const index = this.competences.controls.findIndex(
      c => c.value.competenceId === skill.id
    );

    if (index === -1) {
      this.competences.push(this.fb.group({
        competenceId: [skill.id, Validators.required],
        niveauPossede: [NiveauCompetence.Debutant, Validators.required]
      }));
    } else {
      this.competences.removeAt(index);
    }
  }

  loadInitialData(offreId: string, userId: string): void {
    this.isLoading = true;
    
    forkJoin({
      offre: this.offreService.getById(offreId),
      competences: this.competenceService.getAllCompetences(),
    //   profileData: this.profileService.getProfileById(userId),
      requiredSkills: this.offreCompetenceService.getByOffreId(offreId)
    }).subscribe({
      next: (results) => {
        this.offre = results.offre;
        this.availableCompetences = results.competences.map((comp: any) => ({
          ...comp,
          competenceId: comp.id,
          niveauPossede: NiveauCompetence.Debutant
        }));
        
        this.requiredSkills = results.requiredSkills;
        
        // if (results.profileData) {
        //   this.prefillForm(results.profileData);
        // }

        if (this.offre?.statut !== StatutOffre.Ouvert) {
          this.errorMessage = "Cette offre n'est plus ouverte aux candidatures";
          this.postulerForm.disable();
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Erreur de chargement: ${err.message || err}`;
        this.isLoading = false;
      }
    });
  }

  prefillForm(profileData: any): void {
    this.postulerForm.patchValue({
      fullName: profileData.fullName || '',
      nom: profileData.nom || '',
      prenom: profileData.prenom || '',
      dateNaissance: profileData.dateNaissance || null,
      adresse: profileData.adresse || '',
      ville: profileData.ville || '',
      pays: profileData.pays || '',
      phone: profileData.phone || '',
      linkedIn: profileData.linkedIn || '',
      github: profileData.github || '',
      portfolio: profileData.portfolio || '',
      entreprise: profileData.entreprise || '',
      poste: profileData.poste || '',
      photoUrl: profileData.photoUrl || ''
    });

    // Pré-remplir les diplômes
    if (profileData.diplomes && profileData.diplomes.length > 0) {
      profileData.diplomes.forEach((diplome: any) => {
        this.diplomes.push(this.fb.group({
          nomDiplome: [diplome.nomDiplome, Validators.required],
          institution: [diplome.institution, Validators.required],
          dateObtention: [diplome.dateObtention, Validators.required],
          specialite: [diplome.specialite],
          urlDocument: [diplome.urlDocument]
        }));
      });
    }

    // Pré-remplir les expériences
    if (profileData.experiences && profileData.experiences.length > 0) {
      profileData.experiences.forEach((exp: any) => {
        this.experiences.push(this.fb.group({
          poste: [exp.poste, Validators.required],
          nomEntreprise: [exp.nomEntreprise, Validators.required],
          dateDebut: [exp.dateDebut, Validators.required],
          dateFin: [exp.dateFin],
          description: [exp.description],
          competenceAcquise: [exp.competenceAcquise]
        }));
      });
    }

    // Pré-remplir les certificats
    if (profileData.certificats && profileData.certificats.length > 0) {
      profileData.certificats.forEach((cert: any) => {
        this.certificats.push(this.fb.group({
          nom: [cert.nom, Validators.required],
          organisme: [cert.organisme, Validators.required],
          dateObtention: [cert.dateObtention, Validators.required],
          description: [cert.description],
          urlDocument: [cert.urlDocument]
        }));
      });
    }
  }

  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      // Simulation d'upload - en production utiliser un service d'upload
      const fileName = `uploaded_${Date.now()}_${file.name}`;
      this.postulerForm.patchValue({ [controlName]: fileName });
      Swal.fire({
        icon: 'success',
        title: 'Fichier téléchargé!',
        text: `Le fichier ${file.name} a été préparé pour l'envoi`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    
    if (this.postulerForm.invalid) {
      this.errorMessage = "Veuillez compléter tous les champs obligatoires";
      this.postulerForm.markAllAsTouched();
      return;
    }

    if (!this.userId) {
      this.errorMessage = "Session utilisateur invalide";
      return;
    }

    this.isLoading = true;
    const candidatureData: CandidatureCompleteDto = this.postulerForm.value;

    // Ajouter les noms des compétences
    candidatureData.competences = candidatureData.competences.map((comp: CompetenceInputDto) => {
      const found = this.availableCompetences.find(c => c.competenceId === comp.competenceId);
      return { ...comp, nom: found?.nom || 'Compétence inconnue' };
    });

    this.candidatureService.postuler(candidatureData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Candidature envoyée!',
          text: 'Votre candidature a été soumise avec succès',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Voir mes candidatures',
          showCancelButton: true,
          cancelButtonText: 'Rester ici'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/mes-candidatures']);
          } else {
            this.postulerForm.reset();
            this.initializeForm();
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur!',
          text: `Échec de l'envoi: ${err.error?.message || err.message}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  getSkillName(id: string): string {
    const skill = this.availableCompetences.find(c => c.competenceId === id);
    return skill && skill.nom ? skill.nom : 'Compétence inconnue';
  }
}