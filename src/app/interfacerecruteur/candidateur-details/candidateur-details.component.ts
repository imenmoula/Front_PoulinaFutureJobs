import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { OffreEmploi } from '../../Models/offre-emploi.model';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { CandidatureService } from '../../shared/services/candidature.service';
import { ProfileService } from '../../shared/services/profile.service';
import { ModeTravail, TypeContratEnum } from '../../Models/enums.model';
import { CandidatureDto, CandidatureCompleteDto, CandidatureExperienceDto, CandidatureDiplomeDto, CandidatureCertificatDto, CompetenceInputDto, NiveauCompetence } from '../../Models/Candidature.model';

interface CandidatureForm {
  messageMotivation: FormControl<string | null>;
  cvFilePath: FormControl<string | null>;
  linkedIn: FormControl<string | null>;
  github: FormControl<string | null>;
  portfolio: FormControl<string | null>;
  statutCandidate: FormControl<string | null>;
  statut: FormControl<string | null>;
  experiences: FormArray;
  diplomes: FormArray;
  certificats: FormArray;
  competences: FormArray;
}

@Component({
  selector: 'app-candidature-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './candidateur-details.component.html',
  styleUrls: ['./candidateur-details.component.css']
})
export class CandidateurDetailsComponent implements OnInit {
  candidature: CandidatureDto | null = null;
  offre: OffreEmploi | null = null;
  errorMessage: string | null = null;
  isEditMode: boolean = false;
  candidatureForm!: FormGroup<CandidatureForm>;
  isLoading: boolean = false;
  candidatureId: string | null = null;

  statusOptions: string[] = ['Soumise', 'En revue', 'Acceptée', 'Rejetée'];
  statutCandidateOptions: string[] = ['Junior', 'Senior', 'Expert'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatureService: CandidatureService,
    private offreEmploiService: OffreEmploiService,
    private fb: FormBuilder,
    private location: Location,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.candidatureId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = this.route.snapshot.url.some(segment => segment.path === 'edit');

    if (this.candidatureId) {
      this.loadCandidature(this.candidatureId);
    } else {
      this.errorMessage = 'Erreur: ID de candidature manquant.';
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'ID de candidature non trouvé dans l\'URL.' });
    }
  }

  initializeForm(): void {
    const defaultCandidature: Partial<CandidatureDto> = {
      userInfo: {
        id: '',
        experiences: [],
        diplomes: [],
        certificats: [],
        competences: [],
        fullName: '',
        nom: '',
        prenom: '',
        email: '',
        phone: '',
        adresse: '',
        ville: '',
        pays: '',
        dateNaissance: new Date(),
        entreprise: '',
        poste: '',
        photoUrl: ''
      },
      messageMotivation: '',
      cvFilePath: '',
      linkedIn: '',
      github: '',
      portfolio: '',
      statutCandidate: '',
      statut: 'Soumise'
    };

    this.candidature = { ...defaultCandidature, ...this.candidature } as CandidatureDto;

    this.candidatureForm = this.fb.group<CandidatureForm>({
      messageMotivation: new FormControl(this.candidature.messageMotivation ?? '', [Validators.maxLength(1000)]),
      cvFilePath: new FormControl(this.candidature.cvFilePath ?? ''),
linkedIn: new FormControl('', [Validators.pattern(/^https:\/\/(www\.)?linkedin\.com\/.*$/)]),
github: new FormControl('', [Validators.pattern(/^https:\/\/(www\.)?github\.com\/.*$/)]),        portfolio: new FormControl(this.candidature.portfolio ?? ''),
      statutCandidate: new FormControl(this.candidature.statutCandidate ?? '', [Validators.required]),
      statut: new FormControl(this.candidature.statut ?? 'Soumise', [Validators.required]),
      experiences: this.fb.array(
        (this.candidature.userInfo.experiences || []).map(exp => this.createExperienceFormGroup(exp))
      ),
      diplomes: this.fb.array(
        (this.candidature.userInfo.diplomes || []).map(dip => this.createDiplomeFormGroup(dip))
      ),
      certificats: this.fb.array(
        (this.candidature.userInfo.certificats || []).map(cert => this.createCertificatFormGroup(cert))
      ),
      competences: this.fb.array(
        (this.candidature.userInfo.competences || []).map(comp => this.createCompetenceFormGroup(comp))
      )
    });

    if (!this.isEditMode) {
      this.candidatureForm.disable();
    }
  }

  private createExperienceFormGroup(exp: CandidatureExperienceDto): FormGroup {
    return this.fb.group({
      id: [exp.id ?? ''],
      poste: [exp.poste ?? '', Validators.required],
      nomEntreprise: [exp.nomEntreprise ?? '', Validators.required],
      dateDebut: [exp.dateDebut ?? '', Validators.required],
      dateFin: [exp.dateFin ?? ''],
      description: [exp.description ?? ''],
      competenceAcquise: [exp.competenceAcquise ?? '']
    });
  }

  private createDiplomeFormGroup(dip: CandidatureDiplomeDto): FormGroup {
    return this.fb.group({
      id: [dip.id ?? ''],
      nomDiplome: [dip.nomDiplome ?? '', Validators.required],
      institution: [dip.institution ?? '', Validators.required],
      dateObtention: [dip.dateObtention ?? '', Validators.required],
      specialite: [dip.specialite ?? ''],
      urlDocument: [dip.urlDocument ?? '']
    });
  }

  private createCertificatFormGroup(cert: CandidatureCertificatDto): FormGroup {
    return this.fb.group({
      id: [cert.id ?? ''],
      nom: [cert.nom ?? '', Validators.required],
      organisme: [cert.organisme ?? '', Validators.required],
      dateObtention: [cert.dateObtention ?? '', Validators.required],
      description: [cert.description ?? ''],
      urlDocument: [cert.urlDocument ?? '']
    });
  }

  private createCompetenceFormGroup(comp: CompetenceInputDto): FormGroup {
    return this.fb.group({
      competenceId: [comp.competenceId ?? '', Validators.required],
      nom: [comp.nom ?? '', Validators.required],
      niveauPossede: [comp.niveauPossede ?? '', Validators.required]
    });
  }

  addExperience(): void {
    const experiences = this.candidatureForm.controls.experiences as FormArray;
    experiences.push(this.createExperienceFormGroup({} as CandidatureExperienceDto));
  }

  removeExperience(index: number): void {
    const experiences = this.candidatureForm.controls.experiences as FormArray;
    const id = experiences.at(index).get('id')?.value;
    if (id) {
      this.profileService.deleteExperience(id).subscribe({
        next: () => {
          experiences.removeAt(index);
          Swal.fire('Succès', 'Expérience supprimée.', 'success');
        },
        error: (error) => {
          Swal.fire('Erreur', `Erreur lors de la suppression: ${error.message}`, 'error');
        }
      });
    } else {
      experiences.removeAt(index);
    }
  }

  addDiplome(): void {
    const diplomes = this.candidatureForm.controls.diplomes as FormArray;
    diplomes.push(this.createDiplomeFormGroup({} as CandidatureDiplomeDto));
  }

  removeDiplome(index: number): void {
    const diplomes = this.candidatureForm.controls.diplomes as FormArray;
    const id = diplomes.at(index).get('id')?.value;
    if (id) {
      this.profileService.deleteDiplome(id).subscribe({
        next: () => {
          diplomes.removeAt(index);
          Swal.fire('Succès', 'Diplôme supprimé.', 'success');
        },
        error: (error) => {
          Swal.fire('Erreur', `Erreur lors de la suppression: ${error.message}`, 'error');
        }
      });
    } else {
      diplomes.removeAt(index);
    }
  }

  addCertificat(): void {
    const certificats = this.candidatureForm.controls.certificats as FormArray;
    certificats.push(this.createCertificatFormGroup({} as CandidatureCertificatDto));
  }

  removeCertificat(index: number): void {
    const certificats = this.candidatureForm.controls.certificats as FormArray;
    const id = certificats.at(index).get('id')?.value;
    if (id) {
      this.profileService.deleteCertificat(id).subscribe({
        next: () => {
          certificats.removeAt(index);
          Swal.fire('Succès', 'Certificat supprimé.', 'success');
        },
        error: (error) => {
          Swal.fire('Erreur', `Erreur lors de la suppression: ${error.message}`, 'error');
        }
      });
    } else {
      certificats.removeAt(index);
    }
  }

  addCompetence(): void {
    const competences = this.candidatureForm.controls.competences as FormArray;
    competences.push(this.createCompetenceFormGroup({} as CompetenceInputDto));
  }

  removeCompetence(index: number): void {
    const competences = this.candidatureForm.controls.competences as FormArray;
    competences.removeAt(index);
  }

  loadCandidature(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.candidatureService.getCandidature(id).subscribe({
      next: (data: CandidatureDto) => {
        this.candidature = data;
        this.initializeForm();
        if (this.candidature.offre?.idOffreEmploi) {
          this.loadOffre(this.candidature.offre.idOffreEmploi);
        } else {
          console.warn('Offre ID not found in candidature data.');
        }
      },
      error: (error) => {
        this.errorMessage = `Erreur lors du chargement de la candidature: ${error.message || 'Erreur inconnue'}`;
        Swal.fire('Erreur', this.errorMessage, 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadOffre(offreId: string): void {
    this.offreEmploiService.getById(offreId).subscribe({
      next: (offreData) => {
        this.offre = offreData;
      },
      error: (error) => {
        console.error('Error loading offre details:', error);
      }
    });
  }

  enableEditMode(): void {
    if (!this.candidatureForm) {
      this.errorMessage = 'Formulaire non initialisé. Recharger la page.';
      return;
    }
    this.isEditMode = true;
    this.candidatureForm.enable();
    if (this.candidatureId) {
      this.router.navigate(['/candidature', this.candidatureId, 'edit']);
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    if (this.candidatureForm && this.candidature) {
      this.candidatureForm.reset({
        messageMotivation: this.candidature.messageMotivation ?? '',
        cvFilePath: this.candidature.cvFilePath ?? '',
        linkedIn: this.candidature.linkedIn ?? '',
        github: this.candidature.github ?? '',
        portfolio: this.candidature.portfolio ?? '',
        statutCandidate: this.candidature.statutCandidate ?? '',
        statut: this.candidature.statut ?? 'Soumise',
        experiences: (this.candidature.userInfo.experiences || []).map(exp => this.createExperienceFormGroup(exp).value),
        diplomes: (this.candidature.userInfo.diplomes || []).map(dip => this.createDiplomeFormGroup(dip).value),
        certificats: (this.candidature.userInfo.certificats || []).map(cert => this.createCertificatFormGroup(cert).value),
        competences: (this.candidature.userInfo.competences || []).map(comp => this.createCompetenceFormGroup(comp).value)
      });
      this.candidatureForm.disable();
    }
    if (this.candidatureId) {
      this.router.navigate(['/candidature', this.candidatureId]);
    }
  }

  saveCandidature(): void {
    if (!this.candidature || !this.candidatureId || !this.candidatureForm) {
      Swal.fire('Erreur', 'Données de candidature ou formulaire non disponibles.', 'error');
      return;
    }

    if (this.candidatureForm.invalid) {
      Swal.fire('Erreur', 'Veuillez corriger les erreurs dans le formulaire.', 'error');
      this.candidatureForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValues = this.candidatureForm.value;

    const updateDto: CandidatureCompleteDto = {
      appUserId: this.candidature.userInfo.id || '',
      offreId: this.candidature.offre?.idOffreEmploi || '',
      messageMotivation: formValues.messageMotivation ?? '',
      lettreMotivation: this.candidature.lettreMotivation ?? '',
      cvFilePath: formValues.cvFilePath ?? '',
      linkedIn: formValues.linkedIn ?? '',
      github: formValues.github ?? '',
      portfolio: formValues.portfolio ?? '',
      dateSoumission: this.candidature.dateSoumission.toISOString(),
      statutCandidate: formValues.statutCandidate ?? '',
      fullName: this.candidature.userInfo.fullName || '',
      nom: this.candidature.userInfo.nom || '',
      prenom: this.candidature.userInfo.prenom || '',
      dateNaissance: this.candidature.userInfo.dateNaissance || new Date(),
      adresse: this.candidature.userInfo.adresse || '',
      ville: this.candidature.userInfo.ville || '',
      pays: this.candidature.userInfo.pays || '',
      phone: this.candidature.userInfo.phone || '',
      entreprise: this.candidature.userInfo.entreprise || '',
      poste: this.candidature.userInfo.poste || '',
      photoUrl: this.candidature.userInfo.photoUrl || '',
      diplomes: formValues.diplomes || [],
      experiences: formValues.experiences || [],
      competences: formValues.competences || [],
      certificats: formValues.certificats || []
    };

    this.candidatureService.modifierCandidature(this.candidatureId, updateDto).subscribe({
      next: (response) => {
        this.isLoading = false;
this.candidature = { ...this.candidature, ...formValues, userInfo: { ...this.candidature?.userInfo, ...formValues } } as CandidatureDto;        this.candidatureForm.disable();
        Swal.fire('Succès', 'Candidature mise à jour avec succès.', 'success');
        this.router.navigate(['/candidature', this.candidatureId]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = `Erreur lors de la mise à jour: ${error.message || 'Erreur inconnue'}`;
        Swal.fire('Erreur', this.errorMessage, 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  deleteCandidature(): void {
    if (!this.candidatureId) {
      Swal.fire('Erreur', 'ID de candidature manquant.', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.candidatureService.supprimerCandidature(this.candidatureId!).subscribe({
          next: () => {
            this.isLoading = false;
            Swal.fire('Supprimé !', 'La candidature a été supprimée.', 'success');
            this.router.navigate(['/candidatures']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = `Erreur lors de la suppression: ${error.message || 'Erreur inconnue'}`;
            Swal.fire('Erreur', this.errorMessage, 'error');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }

  getTypeContratString(typeContrat: TypeContratEnum | null | undefined): string {
    if (typeContrat == null) return 'Non disponible';
    return TypeContratEnum[typeContrat] || 'Non disponible';
  }

  getModeTravailString(modeTravail: ModeTravail | null | undefined): string {
    if (modeTravail == null) return 'Non disponible';
    switch (modeTravail) {
      case ModeTravail.Presentiel:
        return 'Présentiel';
      case ModeTravail.Hybride:
        return 'Hybride';
      case ModeTravail.Teletravail:
        return 'Télétravail';
      default:
        return 'Mode inconnu';
    }
  }

  // getSkillLevelClass(niveau: NiveauCompetence | string): string {
  //   const niveauStr = niveau.toString().toLowerCase();
  //   switch (niveauStr) {
  //     case 'avancé':
  //     case 'expert':
  //       return 'level-advanced';
  //     case 'intermédiaire':
  //       return 'level-intermediate';
  //     case 'débutant':
  //       return 'level-beginner';
  //     default:
  //       return '';
  //   }
  // }

  getExperiences(): CandidatureExperienceDto[] {
    return this.candidature?.userInfo.experiences || [];
  }

  getDiplomes(): CandidatureDiplomeDto[] {
    return this.candidature?.userInfo.diplomes || [];
  }

  getCertificats(): CandidatureCertificatDto[] {
    return this.candidature?.userInfo.certificats || [];
  }

 getCompetences(): CompetenceInputDto[] {
    return this.candidature?.userInfo.competences || [];
  }

  getPhotoUrl(): string | undefined {
    return this.candidature?.userInfo.photoUrl;
  }

  getSkillLevelClass(niveau: NiveauCompetence | string): string {
    const niveauStr = niveau.toString().toLowerCase();
    switch (niveauStr) {
      case 'avancé':
      case 'expert':
        return 'level-advanced';
      case 'intermédiaire':
        return 'level-intermediate';
      case 'débutant':
        return 'level-beginner';
      default:
        return '';
    }
  }

  goBack(): void {
    this.location.back();
  }

}
