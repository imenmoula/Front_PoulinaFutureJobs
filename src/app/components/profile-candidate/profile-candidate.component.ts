import { CandidatureCertificatDto, CandidatureExperienceDto } from './../../Models/Candidature.model';
import { Component, OnInit } from '@angular/core';
import { AccountService, EditProfileRequest, Profile } from '../../shared/services/account.service';
import { ProfileService } from '../../shared/services/profile.service';
import { FileUploadService } from '../../shared/services/file-upload.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CandidatureDiplomeDto } from '../../Models/Candidature.model';

// Interfaces pour les données
export interface Diploma {
  id: string;
  nomDiplome: string;
  institution: string;
  dateObtention: string;
  specialite?: string;
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

  constructor(
    private accountService: AccountService,
    private profileService: ProfileService,
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfileData();
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
        // Mapping des diplômes
        this.diplomas = results.diplomes.map((d: CandidatureDiplomeDto) => ({
          id: d.id || '',
          nomDiplome: d.nomDiplome,
          institution: d.institution,
          dateObtention: this.convertToISODate(d.dateObtention.toString()),
          specialite: d.specialite || ''
        }));

        // Mapping des expériences
        this.experiences = results.experiences.map((e: CandidatureExperienceDto) => ({
          id: e.id || '',
          poste: e.poste,
          nomEntreprise: e.nomEntreprise,
          dateDebut: this.convertToISODate(e.dateDebut.toString()),
          dateFin: e.dateFin ? this.convertToISODate(e.dateFin.toString()) : undefined,
          description: e.description || '',
          competenceAcquise: e.competenceAcquise || ''
        }));

        // Mapping des certificats
        this.certificates = results.certificats.map((c: CandidatureCertificatDto) => ({
          id: c.id || '',
          nom: c.nom,
          organisme: c.organisme,
          dateObtention: this.convertToISODate(c.dateObtention.toString()),
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

  // Convertir les dates en format ISO
  convertToISODate(date: any): string {
    if (date instanceof Date) {
      return date.toISOString();
    }
    
    if (typeof date === 'string') {
      if (date.includes('T')) return date;
      
      // Gestion des formats de date alternatifs
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    }
    
    return date || '';
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
    return this.profile 
      ? `${this.profile.prenom} ${this.profile.nom}` 
      : 'Chargement...';
  }

  getLocation(): string {
    return this.profile 
      ? `${this.profile.ville}, ${this.profile.pays}` 
      : '';
  }

  onLogout(): void {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }
}