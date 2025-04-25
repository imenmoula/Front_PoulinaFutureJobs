// // src/app/interfacerecruteur/candidature/candidature.component.ts

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { CandidateurSharedService } from '../../shared/services/candidateur-shared.service';
// import { OffreCompetenceSharedService } from '../../shared/services/offre-competence.service';
// import { UserService } from '../../shared/services/user.service';
// import { AuthService } from '../../shared/services/auth.service';
// import { AppUserResponse, CandidatureForm } from '../../Models/CandidatureForm.model';
// import { OffreCompetence } from '../../Models/offre-competence.model';
// import { OffreEmploi } from '../../Models/offre-emploi.model';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-candidature',
//   standalone: true,
//   imports: [FormsModule,CommonModule,ReactiveFormsModule],
//   templateUrl: './candidature.component.html',
//   styleUrls: ['./candidature.component.css']
// })
// export class CandidatureComponent implements OnInit {
//   candidatureForm: FormGroup;
//   offreDetails: OffreEmploi | null = null;
//   requiredCompetences: OffreCompetence[] = [];
//   missingCompetences: string[] = [];
//   user: AppUserResponse | null = null;
//   selectedCompetences: { competenceNom: string, niveauPossede: string }[] = [];
//   loading = true;
//   errorMessage: string | null = null;
//   submitting = false;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private offreService: OffreEmploiService,
//     private candidatureService: CandidateurSharedService,
//     private offreCompetenceService: OffreCompetenceSharedService,
//     private userService: UserService,
//     private authService: AuthService
//   ) {
//     // Initialize the form
//     this.candidatureForm = this.fb.group({
//       nom: ['', Validators.required],
//       prenom: ['', Validators.required],
//       dateNaissance: [''],
//       adresse: [''],
//       ville: [''],
//       pays: [''],
//       phone: [''],
//       niveauEtude: [''],
//       diplome: [''],
//       universite: [''],
//       specialite: [''],
//       cv: [''],
//       linkedIn: [''],
//       github: [''],
//       portfolio: [''],
//       experiences: this.fb.array([]),
//       messageMotivation: ['', [Validators.required, Validators.minLength(50)]]
//     });
//   }

//   ngOnInit(): void {
//     this.loadData();
//   }

//   loadData(): void {
//     this.loading = true;
//     const offreId = this.route.snapshot.paramMap.get('offreId'); // Assume offreId is passed in the route

//     if (!offreId) {
//       this.errorMessage = 'ID de l\'offre non fourni.';
//       this.loading = false;
//       return;
//     }

//     // Load user data
//     const userId = this.getCurrentUserId(); // Replace with actual logic to get authenticated user ID
//     if (!userId) {
//       this.errorMessage = 'Utilisateur non authentifié. Veuillez vous connecter.';
//       this.loading = false;
//       return;
//     }

//     // Fetch user data
//     this.userService.getUserById(userId).subscribe({
//       next: (userData) => {
//         this.user = userData;
//         this.prefillForm(userData);

//         // Fetch offer details
//         this.offreService.getOffreEmploi(offreId).subscribe({
//           next: (offreData) => {
//             this.offreDetails = offreData;

//             // Fetch required competences for the offer
//             this.offreCompetenceService.getCompetencesByOffre(offreId).subscribe({
//               next: (competences) => {
//                 this.requiredCompetences = competences;
//                 this.checkCompetences();
//                 this.loading = false;
//               },
//               error: (err) => {
//                 this.errorMessage = 'Erreur lors du chargement des compétences requises : ' + (err.error?.message || err.message);
//                 this.loading = false;
//               }
//             });
//           },
//           error: (err) => {
//             this.errorMessage = 'Erreur lors du chargement des détails de l\'offre : ' + (err.error?.message || err.message);
//             this.loading = false;
//           }
//         });
//       },
//       error: (err) => {
//         this.errorMessage = 'Erreur lors du chargement des données utilisateur : ' + (err.error?.message || err.message);
//         this.loading = false;
//       }
//     });
//   }

//   prefillForm(user: AppUserResponse): void {
//     this.candidatureForm.patchValue({
//       nom: user.nom || '',
//       prenom: user.prenom || '',
//       dateNaissance: user.dateNaissance || '',
//       adresse: user.adresse || '',
//       ville: user.ville || '',
//       pays: user.pays || '',
//       phone: user.phone || '',
//       niveauEtude: user.niveauEtude || '',
//       diplome: user.diplome || '',
//       universite: user.universite || '',
//       specialite: user.specialite || '',
//       cv: user.cv || '',
//       linkedIn: user.linkedIn || '',
//       github: user.github || '',
//       portfolio: user.portfolio || ''
//     });

//     // Prefill experiences
//     if (user.experiences && user.experiences.length > 0) {
//       const experienceArray = this.experiences;
//       user.experiences.forEach(exp => {
//         const certArray = this.fb.array<FormGroup>([]);
//         exp.certificats.forEach(cert => {
//           certArray.push(this.fb.group({
//             nom: [cert.nom ?? '', Validators.required],
//             dateObtention: [cert.dateObtention ?? ''],
//             organisme: [cert.organisme ?? ''],
//             description: [cert.description ?? ''],
//             urlDocument: [cert.urlDocument ?? '']
//           }));
//         });

//         experienceArray.push(this.fb.group({
//           poste: [exp.poste || '', Validators.required],
//           nomEntreprise: [exp.nomEntreprise || '', Validators.required],
//           description: [exp.description || ''],
//           competenceAcquise: [exp.competenceAcquise || ''],
//           dateDebut: [exp.dateDebut || ''],
//           dateFin: [exp.dateFin || ''],
//           certificats: certArray
//         }));
//       });
//     }

//     // Prefill competences if any
//     if (user.competences && user.competences.length > 0) {
//       this.selectedCompetences = user.competences.map(comp => ({
//         competenceNom: comp.competenceId, // Assuming competenceId is the name for simplicity; adjust if needed
//         niveauPossede: this.mapNiveauToString(comp.niveauPossede)
//       }));
//     }
//   }

//   get experiences(): FormArray {
//     return this.candidatureForm.get('experiences') as FormArray;
//   }

//   getCertificats(expIndex: number): FormArray {
//     return this.experiences.at(expIndex).get('certificats') as FormArray;
//   }

//   addExperience(): void {
//     const experienceGroup = this.fb.group({
//       poste: ['', Validators.required],
//       nomEntreprise: ['', Validators.required],
//       description: [''],
//       competenceAcquise: [''],
//       dateDebut: [''],
//       dateFin: [''],
//       certificats: this.fb.array([])
//     });
//     this.experiences.push(experienceGroup);
//   }

//   removeExperience(index: number): void {
//     this.experiences.removeAt(index);
//   }

//   addCertificat(expIndex: number): void {
//     const certificatGroup = this.fb.group({
//       nom: ['', Validators.required],
//       dateObtention: [''],
//       organisme: [''],
//       description: [''],
//       urlDocument: ['']
//     });
//     this.getCertificats(expIndex).push(certificatGroup);
//   }

//   removeCertificat(expIndex: number, certIndex: number): void {
//     this.getCertificats(expIndex).removeAt(certIndex);
//   }

//   isCompetenceChecked(competenceNom: string): boolean {
//     return this.selectedCompetences.some(comp => comp.competenceNom === competenceNom);
//   }

//   onCompetenceChange(event: Event, competenceNom: string): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     if (checked) {
//       this.selectedCompetences.push({ competenceNom, niveauPossede: 'Débutant' });
//     } else {
//       this.selectedCompetences = this.selectedCompetences.filter(comp => comp.competenceNom !== competenceNom);
//     }
//     this.checkCompetences();
//   }

//   updateCompetenceLevel(index: number, event: Event): void {
//     const niveau = (event.target as HTMLSelectElement).value;
//     const competenceNom = this.requiredCompetences[index].competence?.nom;
//     if (competenceNom) {
//       const comp = this.selectedCompetences.find(c => c.competenceNom === competenceNom);
//       if (comp) {
//         comp.niveauPossede = niveau;
//       }
//     }
//   }

//   removeCompetence(competenceNom: string): void {
//     this.selectedCompetences = this.selectedCompetences.filter(comp => comp.competenceNom !== competenceNom);
//     this.checkCompetences();
//   }

//   checkCompetences(): void {
//     const requiredNames = this.requiredCompetences.map(comp => comp.competence?.nom).filter((name): name is string => !!name);
//     const selectedNames = this.selectedCompetences.map(comp => comp.competenceNom);
//     this.missingCompetences = requiredNames.filter(name => !selectedNames.includes(name));
//   }

//   mapNiveauToString(niveau: string): string {
//     switch (niveau) {
//       case '1': return 'Débutant';
//       case '2': return 'Intermédiaire';
//       case '3': return 'Avancé';
//       case '4': return 'Expert';
//       default: return 'Débutant';
//     }
//   }

//   mapNiveauToNumber(niveau: string): string {
//     switch (niveau) {
//       case 'Débutant': return '1';
//       case 'Intermédiaire': return '2';
//       case 'Avancé': return '3';
//       case 'Expert': return '4';
//       default: return '1';
//     }
//   }

//   getCurrentUserId(): string | null {
//     // Replace with actual logic to get the authenticated user's ID from the token
//     // For now, assuming it's stored in the AuthService or decoded from the token
//     return this.authService.isAuthenticated() ? '5f81f7dd-5cf4-440a-18f4-08dd80df8f55' : null; // Placeholder
//   }

//   getSubmitButtonText(): string {
//     return this.submitting ? 'Soumission en cours...' : 'Soumettre la candidature';
//   }

//   onSubmit(): void {
//     if (this.candidatureForm.invalid) {
//       this.candidatureForm.markAllAsTouched();
//       return;
//     }

//     if (this.missingCompetences.length > 0) {
//       this.errorMessage = 'Veuillez sélectionner toutes les compétences requises.';
//       return;
//     }

//     this.submitting = true;
//     this.errorMessage = null;

//     const formValue = this.candidatureForm.value;
//     const offreId = this.route.snapshot.paramMap.get('offreId') || '';
//     const userId = this.getCurrentUserId();

//     if (!userId || !offreId) {
//       this.errorMessage = 'Utilisateur ou offre non valide.';
//       this.submitting = false;
//       return;
//     }

//     const candidature: CandidatureForm = {
//       idCandidature: '00000000-0000-0000-0000-000000000000', // Will be generated by backend
//       appUserId: userId,
//       offreId: offreId,
//       fullName: `${formValue.prenom} ${formValue.nom}`,
//       nom: formValue.nom,
//       prenom: formValue.prenom,
//       dateNaissance: formValue.dateNaissance || undefined,
//       adresse: formValue.adresse || undefined,
//       ville: formValue.ville || undefined,
//       pays: formValue.pays || undefined,
//       phone: formValue.phone || undefined,
//       niveauEtude: formValue.niveauEtude || undefined,
//       diplome: formValue.diplome || undefined,
//       universite: formValue.universite || undefined,
//       specialite: formValue.specialite || undefined,
//       cv: formValue.cv || undefined,
//       linkedIn: formValue.linkedIn || undefined,
//       github: formValue.github || undefined,
//       portfolio: formValue.portfolio || undefined,
//       userStatut: this.user?.statut || 'Actif',
//       statut: 'Soumise',
//       messageMotivation: formValue.messageMotivation,
//       experiences: formValue.experiences.map((exp: any) => ({
//         poste: exp.poste || null,
//         nomEntreprise: exp.nomEntreprise || null,
//         description: exp.description || null,
//         competenceAcquise: exp.competenceAcquise || null,
//         dateDebut: exp.dateDebut || null,
//         dateFin: exp.dateFin || null,
//         certificats: exp.certificats.map((cert: any) => ({
//           nom: cert.nom || null,
//           dateObtention: cert.dateObtention || null,
//           organisme: cert.organisme || null,
//           description: cert.description || null,
//           urlDocument: cert.urlDocument || null
//         }))
//       })),
//       competences: this.selectedCompetences.map(comp => {
//         const competence = this.requiredCompetences.find(c => c.competence?.nom === comp.competenceNom);
//         return {
//           competenceId: competence?.idCompetence || '',
//           niveauPossede: this.mapNiveauToNumber(comp.niveauPossede)
//         };
//       })
//     };

//     this.candidatureService.createCandidature(candidature).subscribe({
//       next: (response) => {
//         this.submitting = false;
//         this.router.navigate(['/candidatures'], { queryParams: { success: true } });
//       },
//       error: (err) => {
//         this.errorMessage = 'Erreur lors de la soumission de la candidature : ' + (err.error?.message || err.message);
//         this.submitting = false;
//       }
//     });
//   }
// }