// // 
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router'; // Import Router
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, Validators
// import { Location } from '@angular/common'; // Import Location
// import Swal from 'sweetalert2';

// import { OffreEmploi } from '../../Models/offre-emploi.model';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { CandidatureService } from '../../shared/services/candidature.service';
// import { ModeTravail, TypeContratEnum } from '../../Models/enums.model';
// // Assuming CandidatureCompleteDto is used for updates, adjust if needed
// import { CandidatureDto, CandidatureCompleteDto, CandidatureExperienceDto, CandidatureDiplomeDto, CandidatureCertificatDto } from '../../Models/Candidature.model';

// @Component({
//   selector: 'app-candidature-detail',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './candidateur-details.component.html',
//   styleUrls: ['./candidateur-details.component.css']
// })
// export class CandidateurDetailsComponent implements OnInit {
//   candidature: CandidatureDto | null = null;
//   offre: OffreEmploi | null = null;
//   errorMessage: string | null = null;
//   isEditMode: boolean = false;
//   candidatureForm!: FormGroup; // Initialize with ! or in constructor
//   isLoading: boolean = false;
//   candidatureId: string | null = null;

//   // Define status options, adjust if needed based on your backend enum or logic
//   statusOptions: string[] = ['Soumise', 'En revue', 'Acceptée', 'Rejetée'];
//   statutCandidateOptions: string[] = ['Junior', 'Senior', 'Expert']; // Example, adjust as needed

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router, // Inject Router
//     private candidatureService: CandidatureService,
//     private offreEmploiService: OffreEmploiService,
//     private fb: FormBuilder, // Inject FormBuilder
//     private location: Location // Inject Location
//   ) {}

//   ngOnInit(): void {
//     this.candidatureId = this.route.snapshot.paramMap.get('id');
//     // Check if the route indicates edit mode (e.g., '/candidature/:id/edit')
//     this.isEditMode = this.route.snapshot.url.some(segment => segment.path === 'edit');

//     if (this.candidatureId) {
//       this.loadCandidature(this.candidatureId);
//     } else {
//       this.errorMessage = 'Erreur: ID de candidature manquant.';
//       console.error('No ID provided in the route');
//       Swal.fire({
//         icon: 'error',
//         title: 'Erreur',
//         text: "ID de candidature non trouvé dans l'URL.",
//       });
//     }
//   }

//   initializeForm(): void {
//     if (!this.candidature) return;

//     // Initialize the form with candidature data
//     // Adjust fields based on what should be editable and the structure of CandidatureCompleteDto
//     this.candidatureForm = this.fb.group({
//       messageMotivation: [this.candidature.messageMotivation || '', Validators.maxLength(1000)],
//       cvFilePath: [this.candidature.cvFilePath || ''], // Usually not directly editable, maybe file upload?
//       linkedIn: [this.candidature.linkedIn || '', Validators.pattern('https?:\\/\\/(www\\.)?linkedin\\.com\\/.*')],
//       github: [this.candidature.github || '', Validators.pattern('https?:\\/\\/(www\\.)?github\\.com\\/.*')],
//       portfolio: [this.candidature.portfolio || ''],
//       statutCandidate: [this.candidature.statutCandidate || ''], // Assuming this is editable
//       statut: [this.candidature.statut || 'Soumise'] // Status managed by recruiter usually, but included if needed
//       // Add other fields from CandidatureCompleteDto that are relevant for update
//       // Note: appUserId and offreId are usually not changed in an update
//     });

//     if (!this.isEditMode) {
//       this.candidatureForm.disable(); // Disable form if not in edit mode initially
//     }
//   }

//   loadCandidature(id: string): void {
//     this.isLoading = true;
//     this.errorMessage = null;
//     this.candidatureService.getCandidature(id).subscribe({
//       next: (data) => {
//         this.candidature = data;
//         this.initializeForm(); // Initialize form after data is loaded
//         if (this.candidature?.offre?.idOffreEmploi) {
//           this.loadOffre(this.candidature.offre.idOffreEmploi);
//         }
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.errorMessage = `Erreur lors du chargement de la candidature: ${error.message || 'Erreur inconnue'}`;
//         console.error('Error loading candidature details:', error);
//         Swal.fire('Erreur', this.errorMessage, 'error');
//         this.isLoading = false;
//       }
//     });
//   }

//   loadOffre(offreId: string): void {
//     // No need to set isLoading here unless it's a separate loading indicator
//     this.offreEmploiService.getById(offreId).subscribe({
//       next: (offreData) => {
//         this.offre = offreData;
//       },
//       error: (error) => {
//         // Handle error loading offer details, maybe just log it
//         console.error('Error loading offre details:', error);
//         // Optionally show a non-blocking warning
//         // Swal.fire('Avertissement', `Impossible de charger les détails de l'offre: ${error.message || 'Erreur inconnue'}`, 'warning');
//       }
//     });
//   }

//   enableEditMode(): void {
//     this.isEditMode = true;
//     this.candidatureForm.enable();
//     // Navigate to the edit URL to reflect the state
//     if (this.candidatureId) {
//        this.router.navigate(['/candidature', this.candidatureId, 'edit']);
//     }
//   }

//   cancelEdit(): void {
//     this.isEditMode = false;
//     this.candidatureForm.reset(this.candidature); // Reset form to original values
//     this.candidatureForm.disable();
//     // Navigate back to the view URL
//      if (this.candidatureId) {
//        this.router.navigate(['/candidature', this.candidatureId]);
//     }
//     // Or use location.back()
//     // this.location.back();
//   }

//   saveCandidature(): void {
//     if (!this.candidature || !this.candidatureId) {
//       Swal.fire('Erreur', 'Données de candidature non disponibles.', 'error');
//       return;
//     }

//     if (this.candidatureForm.invalid) {
//       Swal.fire('Erreur', 'Veuillez corriger les erreurs dans le formulaire.', 'error');
//       // Optionally mark fields as touched to show errors
//       this.candidatureForm.markAllAsTouched();
//       return;
//     }

//     this.isLoading = true;
//     const formValues = this.candidatureForm.value;

//     // Construct the DTO for update.
//     // IMPORTANT: Ensure CandidatureCompleteDto matches backend expectations for PUT.
//     // You might need to merge formValues with non-editable fields from this.candidature
//     const updateDto: CandidatureCompleteDto = {
//       // --- Required fields from CandidatureCompleteDto ---
//       appUserId: this.candidature.userInfo?.id,
//       offreId: this.candidature.offre?.idOffreEmploi,

//       // --- Fields from the form ---
//       messageMotivation: formValues.messageMotivation,
//       lettreMotivation: this.candidature.lettreMotivation ?? '', // Provide from candidature or default
//       cvFilePath: formValues.cvFilePath,
//       linkedIn: formValues.linkedIn,
//       github: formValues.github,
//       portfolio: formValues.portfolio,
//       statutCandidate: formValues.statutCandidate,

//       // --- Additional required fields ---
//       fullName: this.candidature.userInfo?.fullName ?? '',
//       photoUrl: this.candidature.userInfo?.photoUrl ?? '',

//       // --- Fields required by CandidatureCompleteDto ---
//       nom: this.candidature.userInfo?.fullName ?? '',
      

//       // --- Fields potentially needed by CandidatureCompleteDto but not in form ---
//       experiences: this.candidature.userInfo?.experiences || [],
//       diplomes: this.candidature.userInfo?.diplomes || [],
//       certificats: this.candidature.userInfo?.certificats || [],
//       competences: this.candidature.userInfo?.competences?.map(c => ({
//         competenceId: c.competenceId,
//         niveauPossede: c.niveauPossede
//       })) || []
//     };

//     this.candidatureService.modifierCandidature(this.candidatureId, updateDto).subscribe({
//       next: (response) => {
//         this.isLoading = false;
//         // Update local candidature data with response if backend returns updated object
//         this.candidature = { ...this.candidature, ...formValues }; // Optimistic update or use response
//         this.isEditMode = false;
//         this.candidatureForm.disable();
//         Swal.fire('Succès', 'Candidature mise à jour avec succès.', 'success');
//         // Navigate back to view mode URL
//         this.router.navigate(['/candidature', this.candidatureId]);
//       },
//       error: (error) => {
//         this.isLoading = false;
//         this.errorMessage = `Erreur lors de la mise à jour: ${error.message || 'Erreur inconnue'}`;
//         console.error('Error updating candidature:', error);
//         Swal.fire('Erreur', this.errorMessage, 'error');
//       }
//     });
//   }

//   deleteCandidature(): void {
//     if (!this.candidatureId) {
//       Swal.fire('Erreur', 'ID de candidature manquant.', 'error');
//       return;
//     }

//     Swal.fire({
//       title: 'Confirmer la suppression',
//       text: "Cette action est irréversible!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Oui, supprimer!',
//       cancelButtonText: 'Annuler'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.isLoading = true;
//         this.candidatureService.supprimerCandidature(this.candidatureId!).subscribe({
//           next: () => {
//             this.isLoading = false;
//             Swal.fire('Supprimé!', 'La candidature a été supprimée.', 'success');
//             // Navigate back to the list or another appropriate page
//             this.router.navigate(['/candidatures']); // Adjust route as needed
//           },
//           error: (error) => {
//             this.isLoading = false;
//             this.errorMessage = `Erreur lors de la suppression: ${error.message || 'Erreur inconnue'}`;
//             console.error('Error deleting candidature:', error);
//             Swal.fire('Erreur', this.errorMessage, 'error');
//           }
//         });
//       }
//     });
//   }

//   // --- Helper methods --- (Keep existing ones)
//   getTypeContratString(typeContrat: TypeContratEnum | null | undefined): string {
//     if (typeContrat == null) return 'Non disponible';
//     return TypeContratEnum[typeContrat] || 'Non disponible';
//   }

//   getModeTravailString(modeTravail: ModeTravail | null | undefined): string {
//     if (modeTravail == null) return 'Non disponible';
//     return ModeTravail[modeTravail] || 'Non disponible';
//   }

//   getExperiences(): CandidatureExperienceDto[] {
//     return this.candidature?.userInfo?.experiences || [];
//   }
//   getDiplomes(): CandidatureDiplomeDto[] {
//     return this.candidature?.userInfo?.diplomes || [];
//   }
//   getCertificats(): CandidatureCertificatDto[] {
//     return this.candidature?.userInfo?.certificats || [];
//   }
//   getPhotoUrl(): string | undefined {
//     // Construct full URL if photoUrl is relative
//     // Example: return this.candidature?.userInfo?.photoUrl ? `${environment.apiBaseUrl}/${this.candidature.userInfo.photoUrl}` : undefined;
//     return this.candidature?.userInfo?.photoUrl; // Assuming it's a full URL or handled by CSS
//   }
// }

