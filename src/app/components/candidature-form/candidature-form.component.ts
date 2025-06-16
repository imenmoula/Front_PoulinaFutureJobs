import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CandidatureService } from '../../shared/services/candidature.service';
import { ProfileService } from '../../shared/services/profile.service';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatureCompleteDto, CompetenceInputDto, NiveauCompetence } from '../../Models/Candidature.model';
import { OffreEmploi } from '../../Models/offre-emploi.model';
import Swal from 'sweetalert2';
import { OffreCompetenceService } from '../../shared/services/offre-competence.service';
import { StatutOffre } from '../../Models/enums.model';
import { FileUploadService, UploadResponse } from '../../shared/services/file-upload.service';
import { CommonModule } from '@angular/common';
import { CandidateFooterComponent } from '../../CandidateFront/components/candidate-footer/candidate-footer.component';
import { CandidateHeaderComponent } from '../../CandidateFront/components/candidate-header/candidate-header.component';

interface RequiredSkill {
  id: string;
  nom: string;
  description?: string;
  niveauRequis: string;
  estTechnique: boolean;
  estSoftSkill: boolean;
}

interface ProfileExperience {
  id?: string;
  poste: string;
  nomEntreprise: string;
  dateDebut: string | null;
  dateFin?: string | null;
  description?: string;
  competenceAcquise?: string;
}

interface ProfileDiplome {
  id: number | null;
  nomDiplome: string;
  institution: string;
  dateObtention: Date | null;
  specialite: string;
  urlDocument: string;
}

interface ProfileCertificat {
  id?: string;
  nom: string;
  organisme: string;
  dateObtention: string | null;
  description?: string;
  urlDocument?: string;
}

@Component({
  selector: 'app-candidature-form',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    CommonModule,CandidateFooterComponent,CandidateHeaderComponent],

  templateUrl: './candidature-form.component.html',
  styleUrls: ['./candidature-form.component.css']
})
export class CandidatureFormComponent implements OnInit {
  currentYear = new Date().getFullYear();

  @Input() offreId: string | null = null;
  postulerForm!: FormGroup;
  offre: OffreEmploi | null = null;
  isLoading = false;
  isSubmitting = false;
  isUploadingPhoto = false;
  isUploadingCV = false;
  isUploadingLettre = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  userId: string | null = null;
  requiredSkills: RequiredSkill[] = [];
  uploadingDocuments = {
    diplomes: {} as { [index: number]: boolean },
    certificats: {} as { [index: number]: boolean }
  };
  private itemsToDelete = {
    diplomas: [] as string[],
    experiences: [] as string[],
    certificates: [] as string[]
  };
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
    private offreCompetenceService: OffreCompetenceService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.showErrorAlert("Vous devez être connecté pour postuler.");
      return;
    }

    this.offreId = this.offreId || this.route.snapshot.paramMap.get('offreId');
    if (!this.offreId) {
      this.showErrorAlert("Aucune offre sélectionnée.");
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
      linkedIn: ['', Validators.pattern(/https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/i)],
      github: ['', Validators.pattern(/https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/i)],
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
      competences: this.fb.array([], [Validators.required, this.validateRequiredSkillsPresence.bind(this)]),
      certificats: this.fb.array([])
    });
  }

  loadInitialData(offreId: string, userId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.offreService.getById(offreId).subscribe({
      next: (offre: OffreEmploi) => {
        this.offre = offre;
        if (this.offre?.statut !== StatutOffre.Ouvert) {
          this.showErrorAlert("Cette offre n'est plus ouverte aux candidatures.");
          this.postulerForm.disable();
          this.isLoading = false;
          return;
        }
        this.handleRequiredSkills();
        this.postulerForm.patchValue({
          appUserId: this.userId,
          offreId: this.offreId
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Erreur chargement données initiales: ${err.error?.message || err.message || err}`;
        this.isLoading = false;
        this.showErrorAlert(this.errorMessage);
      }
    });
  }

  handleRequiredSkills(): void {
    if (this.offre && this.offre.offreCompetences) {
      this.requiredSkills = this.offre.offreCompetences.map((oc: any) => ({
        id: oc.idCompetence,
        nom: oc.competence.nom,
        description: oc.competence.description,
        niveauRequis: oc.niveauRequis,
        estTechnique: oc.competence.estTechnique,
        estSoftSkill: oc.competence.estSoftSkill
      }));
      this.populateCompetencesFormArray();
    } else {
      this.requiredSkills = [];
    }
  }

  populateCompetencesFormArray(): void {
    this.competences.clear();
    this.requiredSkills.forEach(skill => {
      const defaultLevel = this.mapNiveauStringToEnum(skill.niveauRequis);
      this.competences.push(this.fb.group({
        competenceId: [skill.id, Validators.required],
        niveauPossede: [defaultLevel, Validators.required]
      }));
    });
    this.postulerForm.get('competences')?.updateValueAndValidity();
  }

  validateRequiredSkillsPresence(formArray: FormArray): { [key: string]: any } | null {
    if (!this.requiredSkills || this.requiredSkills.length === 0) return null;
    const addedSkillIds = formArray.controls.map(control => control.value.competenceId);
    const missingRequiredSkills = this.requiredSkills.filter(skill => !addedSkillIds.includes(skill.id));
    return missingRequiredSkills.length > 0 ? { missingRequiredSkills: missingRequiredSkills.map(s => s.nom) } : null;
  }

  getCompetenceControl(skillId: string): AbstractControl | null {
    const index = this.competences.controls.findIndex(control => control.value.competenceId === skillId);
    return index !== -1 ? this.competences.at(index) : null;
  }

  isSkillLevelSufficient(skillId: string): boolean {
    const control = this.getCompetenceControl(skillId);
    if (!control) return false;
    const candidateLevel = control.value.niveauPossede;
    const requiredLevel = this.getNumericRequiredLevel(skillId);
    return candidateLevel >= requiredLevel;
  }

  getNumericRequiredLevel(skillId: string): number {
    const skill = this.requiredSkills.find(s => s.id === skillId);
    return skill ? this.mapNiveauStringToEnum(skill.niveauRequis) : 0;
  }

  mapNiveauStringToEnum(niveau: string): number {
    if (!niveau) return NiveauCompetence.Debutant;
    switch (niveau.toLowerCase()) {
      case 'debutant': return NiveauCompetence.Debutant;
      case 'intermediaire': return NiveauCompetence.Intermediaire;
      case 'avance': case 'avancé': return NiveauCompetence.Avance;
      case 'expert': return NiveauCompetence.Expert;
      default: return NiveauCompetence.Debutant;
    }
  }

  // Gestion fichiers CV et lettre
  onFileChange(event: any, controlName: string): void {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !['pdf', 'doc', 'docx'].includes(fileExtension)) {
        this.showErrorToast('Type de fichier non autorisé (PDF, DOC, DOCX uniquement).');
        event.target.value = null;
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.showErrorToast('La taille du fichier dépasse la limite de 5MB.');
        event.target.value = null;
        return;
      }

      const folder = controlName === 'cvFilePath' ? 'cv' : 'lettres';

      if (controlName === 'cvFilePath') this.isUploadingCV = true;
      if (controlName === 'lettreMotivation') this.isUploadingLettre = true;

      this.fileUploadService.uploadFile(file, folder)
        .pipe(
          catchError(err => {
            console.error(`Erreur upload ${controlName}:`, err);
            this.showErrorToast(`Échec de l'upload: ${err.message}`);
            
            if (controlName === 'cvFilePath') this.isUploadingCV = false;
            if (controlName === 'lettreMotivation') this.isUploadingLettre = false;
            
            event.target.value = null;
            return of(null);
          })
        )
        .subscribe((response: UploadResponse | null) => {
          if (response && response.fileUrl) {
            const currentValue = this.postulerForm.get(controlName)?.value;
            if (currentValue) {
              this.fileUploadService.deleteFile(currentValue)
                .pipe(catchError(() => of(null)))
                .subscribe();
            }
            
            this.postulerForm.patchValue({ [controlName]: response.fileUrl });
            this.showSuccessToast('Fichier uploadé avec succès!');
          }
          
          if (controlName === 'cvFilePath') this.isUploadingCV = false;
          if (controlName === 'lettreMotivation') this.isUploadingLettre = false;
          event.target.value = null;
        });
    }
  }

  // Supprimer un fichier uploadé
  removeUploadedFile(controlName: string): void {
    const currentValue = this.postulerForm.get(controlName)?.value;
    if (currentValue) {
      Swal.fire({
        title: 'Confirmer la suppression',
        text: 'Voulez-vous vraiment supprimer ce fichier?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer!'
      }).then((result) => {
        if (result.isConfirmed) {
          if (controlName === 'cvFilePath') this.isUploadingCV = true;
          if (controlName === 'lettreMotivation') this.isUploadingLettre = true;

          this.fileUploadService.deleteFile(currentValue)
            .pipe(
              catchError(err => {
                console.error('Erreur suppression fichier:', err);
                this.showErrorToast('Échec de la suppression du fichier');
                
                if (controlName === 'cvFilePath') this.isUploadingCV = false;
                if (controlName === 'lettreMotivation') this.isUploadingLettre = false;
                
                return of(null);
              })
            )
            .subscribe(() => {
              this.postulerForm.patchValue({ [controlName]: '' });
              this.showSuccessToast('Fichier supprimé!');
              
              if (controlName === 'cvFilePath') this.isUploadingCV = false;
              if (controlName === 'lettreMotivation') this.isUploadingLettre = false;
            });
        }
      });
    }
  }

  // Gestion photo profil
  onPhotoChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.showErrorToast('Type de fichier non autorisé pour la photo (PNG, JPG, JPEG).');
        event.target.value = null;
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.showErrorToast('La taille de la photo dépasse la limite de 5MB.');
        event.target.value = null;
        return;
      }
      this.isUploadingPhoto = true;
      this.fileUploadService.uploadFile(file, 'photos')
        .pipe(
          catchError(err => {
            console.error("Erreur upload photo:", err);
            this.showErrorAlert(`Erreur lors de l'upload de la photo: ${err.error?.message || err.message}`);
            this.isUploadingPhoto = false;
            return of(null);
          })
        )
        .subscribe((response: UploadResponse | null) => {
          this.isUploadingPhoto = false;
          if (response && response.fileUrl) {
            const oldPhotoUrl = this.postulerForm.get('photoUrl')?.value;
            if (oldPhotoUrl) {
              this.fileUploadService.deleteFile(oldPhotoUrl).pipe(catchError(() => of(null))).subscribe();
            }
            this.postulerForm.patchValue({ photoUrl: response.fileUrl });
            this.showSuccessToast('Photo de profil mise à jour !');
          }
          event.target.value = null;
        });
    } else {
      event.target.value = null;
    }
  }

  removePhoto(): void {
    const currentPhotoUrl = this.postulerForm.get('photoUrl')?.value;
    if (currentPhotoUrl) {
      Swal.fire({
        title: 'Supprimer la photo?',
        text: "La photo actuelle sera supprimée.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.isUploadingPhoto = true;
          this.fileUploadService.deleteFile(currentPhotoUrl)
            .pipe(
              catchError(err => {
                console.error("Erreur suppression photo:", err);
                this.showErrorAlert(`Erreur lors de la suppression de la photo: ${err.error?.message || err.message}`);
                this.isUploadingPhoto = false;
                return of(null);
              })
            )
            .subscribe((response) => {
              this.isUploadingPhoto = false;
              if (response !== null) {
                this.postulerForm.patchValue({ photoUrl: '' });
                this.showSuccessToast('Photo de profil supprimée.');
              }
            });
        }
      });
    }
  }

  // Gestion documents diplômes
  onDiplomeDocumentChange(event: any, index: number): void {
    const file = event.target.files?.[0];
    if (file) {
      const diplomeGroup = this.diplomes.at(index) as FormGroup;
      this.uploadingDocuments.diplomes[index] = true;
      this.fileUploadService.uploadFile(file, 'documents')
        .pipe(
          catchError(err => {
            this.uploadingDocuments.diplomes[index] = false;
            this.showErrorToast(`Erreur lors de l'upload du document: ${err.message}`);
            event.target.value = null;
            return of(null);
          })
        )
        .subscribe((response: UploadResponse | null) => {
          this.uploadingDocuments.diplomes[index] = false;
          if (response && response.fileUrl) {
            const oldUrl = diplomeGroup.get('urlDocument')?.value;
            if (oldUrl) {
              this.fileUploadService.deleteFile(oldUrl).pipe(catchError(() => of(null))).subscribe();
            }
            diplomeGroup.patchValue({ urlDocument: response.fileUrl });
            this.showSuccessToast('Document uploadé avec succès.');
          }
          event.target.value = null;
        });
    }
  }

  removeDiplomeDocument(index: number): void {
    const diplomeGroup = this.diplomes.at(index) as FormGroup;
    const url = diplomeGroup.get('urlDocument')?.value;
    if (url) {
      this.fileUploadService.deleteFile(url).pipe(
        catchError(err => {
          this.showErrorToast(`Erreur lors de la suppression du document: ${err.message}`);
          return of(null);
        })
      ).subscribe(() => {
        diplomeGroup.patchValue({ urlDocument: '' });
        this.showSuccessToast('Document supprimé.');
      });
    }
  }

  isUploadingDiplomeDocument(index: number): boolean {
    return this.uploadingDocuments.diplomes[index] === true;
  }

  // Gestion documents certificats
  onCertificatDocumentChange(event: any, index: number): void {
    const file = event.target.files?.[0];
    if (file) {
      const certificatGroup = this.certificats.at(index) as FormGroup;
      this.uploadingDocuments.certificats[index] = true;
      this.fileUploadService.uploadFile(file, 'documents')
        .pipe(
          catchError(err => {
            this.uploadingDocuments.certificats[index] = false;
            this.showErrorToast(`Erreur lors de l'upload du document: ${err.message}`);
            event.target.value = null;
            return of(null);
          })
        )
        .subscribe((response: UploadResponse | null) => {
          this.uploadingDocuments.certificats[index] = false;
          if (response && response.fileUrl) {
            const oldUrl = certificatGroup.get('urlDocument')?.value;
            if (oldUrl) {
              this.fileUploadService.deleteFile(oldUrl).pipe(catchError(() => of(null))).subscribe();
            }
            certificatGroup.patchValue({ urlDocument: response.fileUrl });
            this.showSuccessToast('Document uploadé avec succès.');
          }
          event.target.value = null;
        });
    }
  }

  removeCertificatDocument(index: number): void {
    const certificatGroup = this.certificats.at(index) as FormGroup;
    const url = certificatGroup.get('urlDocument')?.value;
    if (url) {
      this.fileUploadService.deleteFile(url).pipe(
        catchError(err => {
          this.showErrorToast(`Erreur lors de la suppression du document: ${err.message}`);
          return of(null);
        })
      ).subscribe(() => {
        certificatGroup.patchValue({ urlDocument: '' });
        this.showSuccessToast('Document supprimé.');
      });
    }
  }

  isUploadingCertificatDocument(index: number): boolean {
    return this.uploadingDocuments.certificats[index] === true;
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.postulerForm.markAllAsTouched();
    if (this.postulerForm.invalid) {
      this.handleFormErrors();
      return;
    }
    if (!this.userId) {
      this.showErrorAlert("Session utilisateur invalide.");
      return;
    }
    this.isSubmitting = true;
    this.handleDeletions().pipe(
      switchMap(() => this.handleAddsAndUpdates()),
      switchMap(() => {
        const candidatureData: CandidatureCompleteDto = this.postulerForm.value;
        candidatureData.diplomes = this.diplomes.value.map((d: any) => { delete d.id; return d; });
        candidatureData.experiences = this.experiences.value.map((e: any) => { delete e.id; return e; });
        candidatureData.certificats = this.certificats.value.map((c: any) => { delete c.id; return c; });
        return this.candidatureService.postuler(candidatureData);
      }),
      catchError(err => {
        console.error("Erreur soumission globale:", err);
        this.showErrorAlert(`Échec de l'opération: ${err.error?.error || err.error?.message || err.message || 'Erreur inconnue'}`);
        this.isSubmitting = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.isSubmitting = false;
        this.itemsToDelete = { diplomas: [], experiences: [], certificates: [] };
        Swal.fire({
          title: 'Opération Réussie!',
          html: 'Votre profil a été mis à jour et votre candidature a été envoyée avec succès.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Voir mes candidatures',
          showCancelButton: true,
          cancelButtonText: 'Rester ici',
          customClass: {
            popup: 'swal2-popup-professional',
            title: 'swal2-title-professional',
            confirmButton: 'btn btn-success mr-2',
            cancelButton: 'btn btn-secondary'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/mes-candidatures']);
          }
        });
      }
    });
  }

  handleFormErrors(): void {
    let errorMsg = "Veuillez vérifier et compléter tous les champs obligatoires.";
    const competencesErrors = this.postulerForm.get('competences')?.errors;
    if (competencesErrors?.['missingRequiredSkills']) {
      errorMsg = `Compétences requises manquantes: ${competencesErrors['missingRequiredSkills'].join(', ')}`;
    }
    this.showErrorAlert(errorMsg);
    console.error("Formulaire invalide:", this.postulerForm.errors);
    window.scrollTo(0, 0);
  }

  handleDeletions(): Observable<any> {
    const deleteObservables: Observable<any>[] = [];
    this.itemsToDelete.diplomas.forEach(id =>
      deleteObservables.push(this.profileService.deleteDiplome(id).pipe(catchError(err => this.handleItemError(err, 'diplôme', id)))
    ));
    this.itemsToDelete.experiences.forEach(id =>
      deleteObservables.push(this.profileService.deleteExperience(id).pipe(catchError(err => this.handleItemError(err, 'expérience', id)))
    ));
    this.itemsToDelete.certificates.forEach(id =>
      deleteObservables.push(this.profileService.deleteCertificat(id).pipe(catchError(err => this.handleItemError(err, 'certificat', id)))
    ));
    if (deleteObservables.length === 0) {
      return of(true);
    }
    return forkJoin(deleteObservables);
  }

  handleAddsAndUpdates(): Observable<any> {
    const addUpdateObservables: Observable<any>[] = [];
    this.diplomes.controls.forEach(control => {
      const item = control.value;
      if (!item.id && control.valid) {
        addUpdateObservables.push(this.profileService.addDiplome(item).pipe(catchError(err => this.handleItemError(err, 'diplôme (ajout)', item.nomDiplome))));
      } else if (item.id && control.dirty && control.valid) {
        addUpdateObservables.push(this.profileService.updateDiplome(item.id, item).pipe(catchError(err => this.handleItemError(err, 'diplôme (maj)', item.nomDiplome))));
      }
    });
    this.experiences.controls.forEach(control => {
      const item = control.value;
      if (!item.id && control.valid) {
        addUpdateObservables.push(this.profileService.addExperience(item).pipe(catchError(err => this.handleItemError(err, 'expérience (ajout)', item.poste))));
      } else if (item.id && control.dirty && control.valid) {
        addUpdateObservables.push(this.profileService.updateExperience(item.id, item).pipe(catchError(err => this.handleItemError(err, 'expérience (maj)', item.poste))));
      }
    });
    this.certificats.controls.forEach(control => {
      const item = control.value;
      if (!item.id && control.valid) {
        addUpdateObservables.push(this.profileService.addCertificat(item).pipe(catchError(err => this.handleItemError(err, 'certificat (ajout)', item.nom))));
      } else if (item.id && control.dirty && control.valid) {
        addUpdateObservables.push(this.profileService.updateCertificat(item.id, item).pipe(catchError(err => this.handleItemError(err, 'certificat (maj)', item.nom))));
      }
    });
    if (addUpdateObservables.length === 0) {
      return of(true);
    }
    return forkJoin(addUpdateObservables);
  }

  handleItemError(err: any, itemType: string, itemId: string): Observable<null> {
    const errorMsg = `Erreur lors de l'opération sur ${itemType} (${itemId}): ${err.error?.message || err.message}`;
    console.error(errorMsg, err);
    this.showErrorToast(errorMsg);
    return of(null);
  }

  showSuccessToast(message: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
    Toast.fire({
      icon: 'success',
      title: message
    });
  }

  showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#d33',
      customClass: {
        popup: 'swal2-popup-professional',
        title: 'swal2-title-professional',
        confirmButton: 'btn btn-danger'
      }
    });
  }

  showErrorToast(message: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
    Toast.fire({
      icon: 'error',
      title: message
    });
  }

  // Getters for FormArrays
  get diplomes(): FormArray { return this.postulerForm.get('diplomes') as FormArray; }
  get experiences(): FormArray { return this.postulerForm.get('experiences') as FormArray; }
  get certificats(): FormArray { return this.postulerForm.get('certificats') as FormArray; }
  get competences(): FormArray { return this.postulerForm.get('competences') as FormArray; }

  // Methods for adding elements
  addDiplome(): void {
    this.diplomes.push(this.createDiplomeGroup());
  }

  addExperience(): void {
    this.experiences.push(this.createExperienceGroup());
  }

  addCertificat(): void {
    this.certificats.push(this.createCertificatGroup());
  }

  // Methods for removing elements
  removeDiplome(index: number): void {
    this.removeItemFromArray('diplomas', this.diplomes, index);
  }

  removeExperience(index: number): void {
    this.removeItemFromArray('experiences', this.experiences, index);
  }

  removeCertificat(index: number): void {
    this.removeItemFromArray('certificates', this.certificats, index);
  }

  // Generic method for removing items
  removeItemFromArray(itemTypeKey: keyof typeof this.itemsToDelete, formArray: FormArray, index: number): void {
    const itemGroup = formArray.at(index) as FormGroup;
    const itemId = itemGroup.get('id')?.value;
    if (itemId) {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Cette action supprimera définitivement cet élément de votre profil lors de la soumission.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.itemsToDelete[itemTypeKey].push(itemId);
          formArray.removeAt(index);
          this.showSuccessToast('Élément marqué pour suppression.');
        }
      });
    } else {
      formArray.removeAt(index);
      this.showSuccessToast('Élément retiré du formulaire.');
    }
  }

  // Helper methods for creating FormGroups
  createDiplomeGroup(diplome: ProfileDiplome = {} as ProfileDiplome): FormGroup {
    return this.fb.group({
      id: [diplome.id || null],
      nomDiplome: [diplome.nomDiplome || '', Validators.required],
      institution: [diplome.institution || '', Validators.required],
      dateObtention: [diplome.dateObtention || null, Validators.required],
      specialite: [diplome.specialite || ''],
      urlDocument: [diplome.urlDocument || '']
    });
  }

  createExperienceGroup(exp: ProfileExperience = {} as ProfileExperience): FormGroup {
    return this.fb.group({
      id: [exp.id || null],
      poste: [exp.poste || '', Validators.required],
      nomEntreprise: [exp.nomEntreprise || '', Validators.required],
      dateDebut: [exp.dateDebut || null, Validators.required],
      dateFin: [exp.dateFin || null],
      description: [exp.description || ''],
      competenceAcquise: [exp.competenceAcquise || '']
    });
  }

  createCertificatGroup(cert: ProfileCertificat = {} as ProfileCertificat): FormGroup {
    return this.fb.group({
      id: [cert.id || null],
      nom: [cert.nom || '', Validators.required],
      organisme: [cert.organisme || '', Validators.required],
      dateObtention: [cert.dateObtention || null, Validators.required],
      description: [cert.description || ''],
      urlDocument: [cert.urlDocument || '']
    });
  }
  
  handleError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/avtar/4.jpg';
  }
}