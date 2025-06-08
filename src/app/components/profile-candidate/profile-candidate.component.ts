import { CandidatureCertificatDto, CandidatureExperienceDto } from './../../Models/Candidature.model';
import { Component, OnInit } from '@angular/core';
import { AccountService, EditProfileRequest, Profile } from '../../shared/services/account.service';
import { ProfileService } from '../../shared/services/profile.service';
import { FileUploadService } from '../../shared/services/file-upload.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CandidatureDiplomeDto } from '../../Models/Candidature.model';
import Swal from 'sweetalert2';

// Interfaces pour les données
export interface Diploma {
  id: string;
  nomDiplome: string;
  institution: string;
  dateObtention: string;
  specialite?: string;
  urlDocument?: string;
}

export interface Experience {
  id: string;
  poste: string;
  nomEntreprise: string;
  dateDebut: string;
  dateFin?: string;
  description?: string;
  competenceAcquise?: string;
}

export interface Certificate {
  id: string;
  nom: string;
  organisme: string;
  dateObtention: string;
  dateExpiration?: string;
  description?: string;
  urlDocument?: string;
}

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './profile-candidate.component.html',
  styleUrls: ['./profile-candidate.component.css']
})
export class ProfileCandidateComponent implements OnInit {
  profile: Profile | null = null;
  diplomas: Diploma[] = [];
  experiences: Experience[] = [];
  certificates: Certificate[] = [];
  loading = true;
  error: string | null = null;
  selectedFile: File | null = null;
  progress = 75;
  skillValidation = 90;
  currentYear = new Date().getFullYear();

  // Messages d'erreur spécifiques
  diplomasError = '';
  experiencesError = '';
  certificatesError = '';

  // Formulaires CRUD
  experienceForm!: FormGroup;
  diplomaForm!: FormGroup;
  certificateForm!: FormGroup;
  
  // États modaux
  showExperienceModal = false;
  showDiplomaModal = false;
  showCertificateModal = false;
  editingItem: any = null;

  constructor(
    private accountService: AccountService,
    private profileService: ProfileService,
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  initForms(): void {
    // Formulaire expérience
    this.experienceForm = this.fb.group({
      poste: ['', Validators.required],
      nomEntreprise: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      description: [''],
      competenceAcquise: ['']
    });

    // Formulaire diplôme
    this.diplomaForm = this.fb.group({
      nomDiplome: ['', Validators.required],
      institution: ['', Validators.required],
      dateObtention: ['', Validators.required],
      specialite: [''],
      urlDocument: [''] // Champ optionnel
    });

    // Formulaire certificat
    this.certificateForm = this.fb.group({
      nom: ['', Validators.required],
      organisme: ['', Validators.required],
      dateObtention: ['', Validators.required],
      dateExpiration: [''],
      description: [''],
      urlDocument: [''] // Champ optionnel
    });
  }

  openExperienceForm(experience?: Experience): void {
    this.editingItem = experience ? { ...experience } : null;
    
    if (experience) {
      this.experienceForm.patchValue({
        poste: experience.poste,
        nomEntreprise: experience.nomEntreprise,
        dateDebut: this.toDateInputValue(new Date(experience.dateDebut)),
        dateFin: experience.dateFin ? this.toDateInputValue(new Date(experience.dateFin)) : '',
        description: experience.description || '',
        competenceAcquise: experience.competenceAcquise || ''
      });
    } else {
      this.experienceForm.reset();
    }
    
    this.showExperienceModal = true;
  }

  openDiplomaForm(diploma?: Diploma): void {
    this.editingItem = diploma ? { ...diploma } : null;
    
    if (diploma) {
      this.diplomaForm.patchValue({
        nomDiplome: diploma.nomDiplome,
        institution: diploma.institution,
        dateObtention: this.toDateInputValue(new Date(diploma.dateObtention)),
        specialite: diploma.specialite || '',
        urlDocument: diploma.urlDocument || ''
      });
    } else {
      this.diplomaForm.reset();
    }
    
    this.showDiplomaModal = true;
  }

  openCertificateForm(certificate?: Certificate): void {
    this.editingItem = certificate ? { ...certificate } : null;
    
    if (certificate) {
      this.certificateForm.patchValue({
        nom: certificate.nom,
        organisme: certificate.organisme,
        dateObtention: this.toDateInputValue(new Date(certificate.dateObtention)),
        dateExpiration: certificate.dateExpiration ? this.toDateInputValue(new Date(certificate.dateExpiration)) : '',
        description: certificate.description || '',
        urlDocument: certificate.urlDocument || ''
      });
    } else {
      this.certificateForm.reset();
    }
    
    this.showCertificateModal = true;
  }

  closeModal(): void {
    this.showExperienceModal = false;
    this.showDiplomaModal = false;
    this.showCertificateModal = false;
    this.editingItem = null;
  }

  toDateInputValue(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadProfileData(): void {
    this.accountService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loadAdditionalData();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil:', err);
        this.error = 'Échec du chargement du profil';
        this.loading = false;
      }
    });
  }

  loadAdditionalData(): void {
    forkJoin({
      diplomes: this.profileService.getAllDiplomes().pipe(
        catchError(error => {
          console.error('Erreur diplômes:', error);
          this.diplomasError = 'Erreur de chargement des diplômes';
          return of([]);
        })
      ),
      experiences: this.profileService.getAllExperiences().pipe(
        catchError(error => {
          console.error('Erreur expériences:', error);
          this.experiencesError = 'Erreur de chargement des expériences';
          return of([]);
        })
      ),
      certificats: this.profileService.getAllCertificats().pipe(
        catchError(error => {
          console.error('Erreur certificats:', error);
          this.certificatesError = 'Erreur de chargement des certificats';
          return of([]);
        })
      )
    }).subscribe({
      next: (results) => {
        this.diplomas = results.diplomes.map((d: CandidatureDiplomeDto) => ({
          id: d.id || '',
          nomDiplome: d.nomDiplome,
          institution: d.institution,
          dateObtention: this.convertToISODate(d.dateObtention.toString()),
          specialite: d.specialite || '',
          urlDocument: d.urlDocument || ''
        }));

        this.experiences = results.experiences.map((e: CandidatureExperienceDto) => ({
          id: e.id || '',
          poste: e.poste,
          nomEntreprise: e.nomEntreprise,
          dateDebut: this.convertToISODate(e.dateDebut.toString()),
          dateFin: e.dateFin ? this.convertToISODate(e.dateFin.toString()) : undefined,
          description: e.description || '',
          competenceAcquise: e.competenceAcquise || ''
        }));

        this.certificates = results.certificats.map((c: CandidatureCertificatDto) => ({
          id: c.id || '',
          nom: c.nom,
          organisme: c.organisme,
          dateObtention: this.convertToISODate(c.dateObtention.toString()),
          description: c.description || '',
          urlDocument: c.urlDocument || ''
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur globale:', err);
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
      }
    });
  }

  convertToISODate(date: any): string {
    if (date instanceof Date) {
      return date.toISOString();
    }
    if (typeof date === 'string') {
      if (date.includes('T')) return date;
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    }
    return date || '';
  }

  saveExperience(): void {
    if (this.experienceForm.invalid) return;

    const formValue = this.experienceForm.value;
    const dto: CandidatureExperienceDto = {
      poste: formValue.poste,
      nomEntreprise: formValue.nomEntreprise,
      dateDebut: new Date(formValue.dateDebut),
      dateFin: formValue.dateFin ? new Date(formValue.dateFin) : undefined,
      description: formValue.description || undefined,
      competenceAcquise: formValue.competenceAcquise || undefined
    };

    if (this.editingItem) {
      this.profileService.updateExperience(this.editingItem.id, dto).subscribe({
        next: () => {
          this.loadAdditionalData();
          Swal.fire('Succès', 'Expérience mise à jour avec succès !', 'success');
          this.router.navigate(['/success']);
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur mise à jour expérience:', err);
        }
      });
    } else {
      this.profileService.addExperience(dto).subscribe({
        next: () => {
          this.loadAdditionalData();
          Swal.fire('Succès', 'Expérience ajoutée avec succès !', 'success');
          this.router.navigate(['/success']);
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur ajout expérience:', err);
        }
      });
    }
  }

 deleteExperience(id: string): void {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Cette action supprimera l\'expérience définitivement !',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4169E1',
    cancelButtonColor: '#e74c3c',
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.profileService.deleteExperience(id).subscribe({
        next: () => {
          this.loadAdditionalData();
          Swal.fire('Supprimé !', 'L\'expérience a été supprimée avec succès.', 'success');
        },
        error: (err) => console.error('Erreur suppression expérience:', err)
      });
    }
  });
}

  saveDiploma(): void {
    if (this.diplomaForm.invalid) return;

    const formValue = this.diplomaForm.value;
    const dto: CandidatureDiplomeDto = {
      nomDiplome: formValue.nomDiplome,
      institution: formValue.institution,
      dateObtention: new Date(formValue.dateObtention),
      specialite: formValue.specialite || undefined,
      urlDocument: formValue.urlDocument || undefined
    };

    if (this.editingItem) {
      this.profileService.updateDiplome(this.editingItem.id, dto).subscribe({
        next: () => {
          this.loadAdditionalData();
          Swal.fire('Succès', 'Diplôme mis à jour avec succès !', 'success');
          this.router.navigate(['/success']);
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur mise à jour diplôme:', err);
        }
      });
    } else {
      this.profileService.addDiplome(dto).subscribe({
        next: () => {
          this.loadAdditionalData();
          Swal.fire('Succès', 'Diplôme ajouté avec succès !', 'success');
          this.router.navigate(['/success']);
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur ajout diplôme:', err);
        }
      });
    }
  }

 deleteDiploma(id: string): void {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Cette action supprimera le diplôme définitivement !',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4169E1',
    cancelButtonColor: '#e74c3c',
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.profileService.deleteDiplome(id).subscribe({
        next: () => {
          this.loadAdditionalData();
          Swal.fire('Supprimé !', 'Le diplôme a été supprimé avec succès.', 'success');
        },
        error: (err) => console.error('Erreur suppression diplôme:', err)
      });
    }
  });
}

  saveCertificate(): void {
    if (this.certificateForm.invalid) return;

    const formValue = this.certificateForm.value;
    const dto: CandidatureCertificatDto = {
      nom: formValue.nom,
      organisme: formValue.organisme,
      dateObtention: new Date(formValue.dateObtention),
      description: formValue.description || undefined,
      urlDocument: formValue.urlDocument || undefined
    };

    if (this.editingItem) {
      this.profileService.updateCertificat(this.editingItem.id, dto).subscribe({
        next: () => {
          this.loadAdditionalData();
          Swal.fire('Succès', 'Certificat mis à jour avec succès !', 'success');
          this.router.navigate(['/success']);
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur mise à jour certificat:', err);
        }
      });
    } else {
      this.profileService.addCertificat(dto).subscribe({
        next: () => {
          this.loadAdditionalData();
          Swal.fire('Succès', 'Certificat ajouté avec succès !', 'success');
          this.router.navigate(['/success']);
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur ajout certificat:', err);
        }
      });
    }
  }

 deleteCertificate(id: string): void {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Cette action supprimera le certificat définitivement !',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4169E1',
    cancelButtonColor: '#e74c3c',
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.profileService.deleteCertificat(id).subscribe({
        next: () => {
          this.loadAdditionalData();
          Swal.fire('Supprimé !', 'Le certificat a été supprimé avec succès.', 'success');
        },
        error: (err) => console.error('Erreur suppression certificat:', err)
      });
    }
  });
}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadProfilePhoto();
    }
  }

  uploadProfilePhoto(): void {
    if (!this.selectedFile || !this.profile) return;

    this.fileUploadService.uploadProfilePhoto(this.selectedFile).subscribe({
      next: (response) => {
        if (this.profile) {
          this.profile.photoUrl = response.fileUrl;
          const updateRequest: EditProfileRequest = {
            nom: this.profile.nom,
            prenom: this.profile.prenom,
            email: this.profile.email,
            phoneNumber: this.profile.phoneNumber,
            adresse: this.profile.adresse,
            ville: this.profile.ville,
            pays: this.profile.pays,
            photo: response.filePath
          };
          this.accountService.updateProfile(updateRequest).subscribe({
            next: () => console.log('Photo mise à jour avec succès'),
            error: (err) => console.error('Erreur mise à jour profil:', err)
          });
        }
      },
      error: (err) => console.error('Erreur téléchargement photo:', err)
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Présent';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  getFullName(): string {
    return this.profile ? `${this.profile.prenom} ${this.profile.nom}` : 'Chargement...';
  }

  getLocation(): string {
    return this.profile ? `${this.profile.ville}, ${this.profile.pays}` : '';
  }

  onLogout(): void {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }
}