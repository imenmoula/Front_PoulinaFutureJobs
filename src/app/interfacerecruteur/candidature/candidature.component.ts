import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CandidateurSharedService } from '../../shared/services/candidateur-shared.service';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { CompetenceService } from '../../shared/services/competence.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidature',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidature.component.html',
  styles: ``
})
export class CandidatureComponent implements OnInit {
  candidatureForm!: FormGroup;
  offerId!: string;
  competences: any[] = [];
  selectedCompetences: any[] = [];
  previewImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offreEmploiService: OffreEmploiService,
    private competenceService: CompetenceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the offer ID from the route parameters
    this.offerId = this.route.snapshot.params['id'];

    // Fetch offer details, including competences
    this.offreEmploiService.getOffreEmploi(this.offerId).subscribe(
      (offer) => {
        this.competences = offer.competences;
      },
      (error) => {
        console.error('Error fetching offer details:', error);
      }
    );

    // Fetch current user details
    this.authService.getUserProfile().subscribe(
      (user: { nom: string; prenom: string }) => {
      if (this.candidatureForm != null) {
        this.candidatureForm.patchValue({
        fullName: `${user.nom} ${user.prenom}`,
        });
      }
      },
      (error: any) => {
      console.error('Error fetching current user:', error);
      }
    );

    // Initialize the form
    this.candidatureForm = this.fb.group({
      fullName: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      photo: [null],
      dateNaissance: [null, Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      pays: ['', Validators.required],
      phone: ['', Validators.required],
      niveauEtude: ['', Validators.required],
      diplome: ['', Validators.required],
      universite: ['', Validators.required],
      specialite: ['', Validators.required],
      cv: [''],
      linkedIn: [''],
      github: [''],
      portfolio: [''],
      entreprise: [''],
      poste: [''],
      statut: [''],
      messageMotivation: ['', Validators.required],
      experiences: this.fb.array([]),
      competences: [[]],
    });
  }

  get experiences() {
    return this.candidatureForm.get('experiences');
  }

  addExperience(): void {
    const experienceGroup = this.fb.group({
      poste: ['', Validators.required],
      nomEntreprise: ['', Validators.required],
      description: [''],
      competenceAcquise: [''],
      dateDebut: [null, Validators.required],
      dateFin: [null],
      certificats: this.fb.array([]),
    });
    (this.experiences as FormArray).push(experienceGroup);
  }

  addCertificat(experienceIndex: number): void {
    const certificatGroup = this.fb.group({
      nom: ['', Validators.required],
      dateObtention: [null, Validators.required],
      organisme: ['', Validators.required],
      description: [''],
      urlDocument: [''],
    });
    const certificatsControl = (this.experiences as FormArray).at(experienceIndex).get('certificats');
    if (certificatsControl instanceof FormArray) {
      certificatsControl.push(certificatGroup);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
        this.candidatureForm.patchValue({ photo: this.previewImage });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.candidatureForm.valid) {
      const formData = this.candidatureForm.value;
      const candidatureData = {
        ...formData,
        competences: this.selectedCompetences.map((c) => ({
          competenceNom: c.nom,
          niveauPossede: c.niveauRequis,
        })),
        offreId: this.offerId,
      };

      console.log('Candidature submitted:', candidatureData);
      // Submit the data to the backend using CandidatureService
    }
  }

  onCheckboxChange(event: any, competence: any): void {
    if (event.target.checked) {
      this.selectedCompetences.push(competence);
    } else {
      this.selectedCompetences = this.selectedCompetences.filter(
        (c) => c.id !== competence.id
      );
    }
  }
}