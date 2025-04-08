// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { HardSkillType, ModeTravail, NiveauRequisType, SoftSkillType, StatutOffre, TypeContratEnum } from '../../Models/enums.model';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../shared/services/auth.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { Filiale } from '../../Models/filiale.model';

// // Standalone validator function for max selections
// function maxSelectionsValidator(max: number): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const formArray = control as FormArray;
//     const selected = formArray.controls.filter(ctrl => ctrl.value).length;
//     return selected <= max ? null : { maxSelections: { max, selected } };
//   };
// }

// @Component({
//   selector: 'app-offre-form',
//   standalone: true,
//   imports: [FormsModule, CommonModule, ReactiveFormsModule],
//   templateUrl: './offre-form.component.html',
// })
// export class OffreFormComponent implements OnInit {
//   offreForm: FormGroup;
//   isEditMode = false;
//   idOffre?: string;
//   typeContrats = Object.entries(TypeContratEnum).filter(([k, v]) => isNaN(Number(k)));
//   statuts = Object.entries(StatutOffre).filter(([k, v]) => isNaN(Number(k)));
//   modesTravail = Object.entries(ModeTravail).filter(([k, v]) => isNaN(Number(k)));
//   niveauxRequis = Object.values(NiveauRequisType);
//   hardSkills = Object.values(HardSkillType);
//   softSkills = Object.values(SoftSkillType);
//   filiales: Filiale[] = [];
//   connectedRecruiterId: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private offreService: OffreEmploiService,
//     private route: ActivatedRoute,
//     private authService: AuthService,
//     private filialeService: FilialeService
//   ) {
//     this.offreForm = this.fb.group({
//       idOffreEmploi: [null],
//       titre: ['', [Validators.required, Validators.maxLength(200)]],
//       specialite: ['', [Validators.required, Validators.maxLength(100)]],
//       description: ['', [Validators.required, Validators.maxLength(2000)]],
//       diplomeRequis: ['', [Validators.required, Validators.maxLength(100)]],
//       niveauExperienceRequis: ['', [Validators.required, Validators.maxLength(50)]],
//       salaire: [0, [Validators.required, Validators.min(0)]],
//       datePublication: [null],
//       dateExpiration: [null],
//       typeContrat: [null, Validators.required],
//       statut: [null, Validators.required],
//       modeTravail: [0, Validators.required], // Valeur par défaut à 0 (Présentiel)
//       nombrePostes: [1, [Validators.required, Validators.min(1)]],
//       avantages: [''],
//       idRecruteur: [{ value: '', disabled: true }, Validators.required],
//       idFiliale: [null, Validators.required],
//       offreCompetences: this.fb.array([])
//     });
//   }

//   ngOnInit() {
//     // Récupérer l'ID du recruteur connecté (doit être un Guid)
//     this.connectedRecruiterId = this.authService.getUserId() || ''; // Assurez-vous que getUserId renvoie un Guid
//     if (this.connectedRecruiterId) {
//       this.offreForm.patchValue({ idRecruteur: this.connectedRecruiterId });
//     } else {
//       console.warn('No connected recruiter found.');
//       alert('Aucun recruteur connecté. Veuillez vous connecter.');
//     }

//     // Charger les filiales
//     this.filialeService.getFiliales().subscribe({
//       next: (filiales) => {
//         this.filiales = filiales;
//         console.log('Filiales loaded:', this.filiales);
//       },
//       error: (err) => {
//         console.error('Error fetching filiales:', err);
//         alert('Erreur lors du chargement des filiales. Veuillez réessayer.');
//       }
//     });

//     // Vérifier si on est en mode édition
//     this.idOffre = this.route.snapshot.paramMap.get('id') || undefined;
//     if (this.idOffre) {
//       this.isEditMode = true;
//       this.offreService.getOffreById(this.idOffre).subscribe({
//         next: (data) => {
//           if (data.datePublication) {
//             data.datePublication = new Date(data.datePublication);
//           }
//           if (data.dateExpiration) {
//             data.dateExpiration = new Date(data.dateExpiration);
//           }
//           this.offreForm.patchValue(data);
//           data.offreCompetences.forEach((comp: any) => this.addCompetence(comp));
//         },
//         error: (err) => {
//           console.error('Error fetching offre:', err);
//           alert('Erreur lors du chargement de l\'offre. Veuillez réessayer.');
//         }
//       });
//     }
//   }

//   get offreCompetences(): FormArray {
//     return this.offreForm.get('offreCompetences') as FormArray;
//   }

//   addCompetence(data?: any) {
//     const competenceGroup = this.fb.group({
//       idOffreEmploi: [data?.idOffreEmploi || null],
//       idCompetence: [data?.idCompetence || null],
//       niveauRequis: [data?.niveauRequis || NiveauRequisType.Debutant, Validators.required],
//       competence: this.fb.group({
//         id: [data?.competence?.id || null],
//         nom: [data?.competence?.nom || '', Validators.required],
//         description: [data?.competence?.description || ''],
//         dateModification: [data?.competence?.dateModification || null],
//         hardSkills: this.fb.array(
//           this.hardSkills.map(skill => this.fb.control(data?.competence?.hardSkills?.includes(skill) || false)),
//           maxSelectionsValidator(5)
//         ),
//         softSkills: this.fb.array(
//           this.softSkills.map(skill => this.fb.control(data?.competence?.softSkills?.includes(skill) || false)),
//           maxSelectionsValidator(5)
//         )
//       })
//     });
//     this.offreCompetences.push(competenceGroup);
//   }

//   removeCompetence(index: number) {
//     this.offreCompetences.removeAt(index);
//   }

//   getHardSkillsArray(index: number): FormArray {
//     return this.offreCompetences.at(index).get('competence.hardSkills') as FormArray;
//   }

//   getSoftSkillsArray(index: number): FormArray {
//     return this.offreCompetences.at(index).get('competence.softSkills') as FormArray;
//   }

//   // Helper method to get a specific FormControl from a FormArray
//   getHardSkillControl(index: number, skillIndex: number): FormControl {
//     return this.getHardSkillsArray(index).controls[skillIndex] as FormControl;
//   }

//   getSoftSkillControl(index: number, skillIndex: number): FormControl {
//     return this.getSoftSkillsArray(index).controls[skillIndex] as FormControl;
//   }

//   onSubmit() {
//     if (this.offreForm.invalid) {
//       console.error('Form is invalid:', this.offreForm.errors);
//       console.log('Form values:', this.offreForm.getRawValue());
//       // Afficher les erreurs spécifiques
//       const errors = this.getFormValidationErrors();
//       alert('Veuillez corriger les erreurs suivantes :\n' + errors.join('\n'));
//       return;
//     }

//     const formValue = this.offreForm.getRawValue();

//     // Debugging logs
//     console.log('Form values before mapping:', formValue);
//     console.log('Selected idFiliale:', formValue.idFiliale);
//     console.log('Selected idRecruteur:', formValue.idRecruteur);
//     console.log('Selected modeTravail:', formValue.modeTravail);

//     // Map the payload to match backend expectations
//     const payload = {
//       ...formValue,
//       idOffreEmploi: formValue.idOffreEmploi || null,
//       datePublication: formValue.datePublication ? new Date(formValue.datePublication).toISOString() : null,
//       dateExpiration: formValue.dateExpiration ? new Date(formValue.dateExpiration).toISOString() : null,
//       typeContrat: parseInt(formValue.typeContrat), // Convertir en int
//       statut: parseInt(formValue.statut), // Convertir en int
//       modeTravail: parseInt(formValue.modeTravail), // Convertir en int
//       idRecruteur: formValue.idRecruteur, // Doit être un Guid valide
//       idFiliale: formValue.idFiliale, // Doit être un Guid valide
//       offreCompetences: formValue.offreCompetences.map((comp: any) => ({
//         idCompetence: comp.idCompetence || null,
//         niveauRequis: comp.niveauRequis,
//         competence: {
//           id: comp.competence.id || null,
//           nom: comp.competence.nom,
//           description: comp.competence.description,
//           hardSkills: this.hardSkills.filter((_, i) => comp.competence.hardSkills[i]),
//           softSkills: this.softSkills.filter((_, i) => comp.competence.softSkills[i])
//         }
//       }))
//     };

//     console.log('Payload Submitted:', payload);

//     if (this.isEditMode) {
//       console.log('Updating offre with ID:', this.idOffre);
//       this.offreService.updateOffre(this.idOffre!, payload).subscribe({
//         next: (res) => {
//           console.log('Update response:', res);
//           alert('Offre mise à jour avec succès');
//         },
//         error: (err) => {
//           console.error('Error updating offre:', err);
//           this.handleError(err);
//         }
//       });
//     } else {
//       console.log('Creating new offre');
//       this.offreService.createOffre(payload).subscribe({
//         next: (res) => {
//           console.log('Create response:', res);
//           alert('Offre créée avec succès');
//           this.offreForm.reset();
//           this.offreCompetences.clear();
//           this.offreForm.patchValue({ idRecruteur: this.connectedRecruiterId });
//         },
//         error: (err) => {
//           console.error('Error creating offre:', err);
//           this.handleError(err);
//         }
//       });
//     }
//   }

//   private getFormValidationErrors(): string[] {
//     const errors: string[] = [];
//     Object.keys(this.offreForm.controls).forEach(key => {
//       const controlErrors: ValidationErrors | null = this.offreForm.get(key)?.errors ?? null;
//       if (controlErrors) {
//         Object.keys(controlErrors).forEach(errorKey => {
//           let message = '';
//           switch (errorKey) {
//             case 'required':
//               message = `${key} est requis.`;
//               break;
//             case 'maxLength':
//               message = `${key} dépasse la longueur maximale de ${controlErrors['maxLength'].requiredLength} caractères.`;
//               break;
//             case 'min':
//               message = `${key} doit être supérieur ou égal à ${controlErrors['min'].min}.`;
//               break;
//             default:
//               message = `${key} a une erreur: ${errorKey}.`;
//           }
//           errors.push(message);
//         });
//       }
//     });

//     // Vérifier les erreurs dans le FormArray offreCompetences
//     this.offreCompetences.controls.forEach((compGroup: any, index: number) => {
//       const compErrors = compGroup.get('competence')?.errors;
//       if (compErrors) {
//         Object.keys(compErrors).forEach(errorKey => {
//           errors.push(`Compétence ${index + 1} (compétence): ${errorKey}`);
//         });
//       }

//       const nomErrors = compGroup.get('competence.nom')?.errors;
//       if (nomErrors) {
//         Object.keys(nomErrors).forEach(errorKey => {
//           errors.push(`Compétence ${index + 1} (nom): ${errorKey === 'required' ? 'Le nom est requis.' : errorKey}`);
//         });
//       }

//       const hardSkillsErrors = compGroup.get('competence.hardSkills')?.errors;
//       if (hardSkillsErrors) {
//         errors.push(`Compétence ${index + 1} (hardSkills): Maximum 5 hard skills autorisés. Sélectionnés: ${hardSkillsErrors['maxSelections']?.selected}`);
//       }

//       const softSkillsErrors = compGroup.get('competence.softSkills')?.errors;
//       if (softSkillsErrors) {
//         errors.push(`Compétence ${index + 1} (softSkills): Maximum 5 soft skills autorisés. Sélectionnés: ${softSkillsErrors['maxSelections']?.selected}`);
//       }
//     });

//     return errors;
//   }

//   private handleError(err: any) {
//     console.error('Status:', err.status);
//     console.error('Status Text:', err.statusText);
//     console.error('Error Details:', err.error);

//     if (err.error && err.error.errors) {
//       console.error('Validation Errors:', err.error.errors);
//       const validationErrors = Object.entries(err.error.errors)
//         .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
//         .join('\n');
//       alert('Erreur de validation :\n' + validationErrors);
//     } else if (err.error && err.error.message) {
//       alert('Erreur : ' + err.error.message);
//     } else {
//       alert('Une erreur inattendue est survenue. Veuillez réessayer.');
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { HardSkillType, ModeTravail, NiveauRequisType, SoftSkillType, StatutOffre, TypeContratEnum } from '../../Models/enums.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { Filiale } from '../../Models/filiale.model';

// Standalone validator function for max selections
function maxSelectionsValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;
    const selected = formArray.controls.filter(ctrl => ctrl.value).length;
    return selected <= max ? null : { maxSelections: { max, selected } };
  };
}

@Component({
  selector: 'app-offre-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './offre-form.component.html',
})
export class OffreFormComponent implements OnInit {
  offreForm: FormGroup;
  isEditMode = false;
  idOffre?: string;
  typeContrats = Object.entries(TypeContratEnum).filter(([k, v]) => isNaN(Number(k)));
  statuts = Object.entries(StatutOffre).filter(([k, v]) => isNaN(Number(k)));
  modesTravail = Object.entries(ModeTravail).filter(([k, v]) => isNaN(Number(k)));
  niveauxRequis = Object.values(NiveauRequisType);
  hardSkills = Object.values(HardSkillType);
  softSkills = Object.values(SoftSkillType);
  filiales: Filiale[] = [];
  connectedRecruiterId: string | null = null;
  recruiterName: string | null = null;
  isRecruiter: boolean = false;
  errorMessage: string | null = null;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private offreService: OffreEmploiService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private filialeService: FilialeService
  ) {
    this.offreForm = this.fb.group({
      idOffreEmploi: [null],
      titre: ['', [Validators.required, Validators.maxLength(200)]],
      specialite: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      diplomeRequis: ['', [Validators.required, Validators.maxLength(100)]],
      niveauExperienceRequis: ['', [Validators.required, Validators.maxLength(50)]],
      salaire: [0, [Validators.required, Validators.min(0)]],
      datePublication: [null],
      dateExpiration: [null],
      typeContrat: [null, Validators.required],
      statut: [null, Validators.required],
      modeTravail: [0, Validators.required],
      nombrePostes: [1, [Validators.required, Validators.min(1)]],
      avantages: [''],
      idRecruteur: [{ value: '', disabled: true }, Validators.required],
      recruteurNom: [{ value: '', disabled: true }], // Champ pour le nom du recruteur
      idFiliale: [null, Validators.required],
      offreCompetences: this.fb.array([]),
      dateModification: [null]
    });
  }

  ngOnInit() {
    // Vérifier si un utilisateur est connecté
    this.connectedRecruiterId = this.authService.getUserId();
    if (!this.connectedRecruiterId || !this.authService.isLoggedIn()) {
      this.errorMessage = 'Vous devez être connecté pour créer une offre.';
      this.router.navigate(['/signin']);
      return;
    }

    // Vérifier si l'utilisateur connecté est un recruteur
    this.isRecruiter = this.authService.hasRole('Recruteur');
    this.loading = false;

    if (!this.isRecruiter) {
      this.errorMessage = 'Seuls les recruteurs peuvent créer ou modifier des offres.';
      this.router.navigate(['/offres']);
      return;
    }

    // Récupérer le nom du recruteur
    this.recruiterName = this.authService.getUserFullName();

    // Définir l'ID et le nom du recruteur dans le formulaire
    this.offreForm.patchValue({
      idRecruteur: this.connectedRecruiterId,
      recruteurNom: this.recruiterName
    });

    // Charger les filiales
    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales;
        console.log('Filiales loaded:', this.filiales);
      },
      error: (err) => {
        console.error('Error fetching filiales:', err);
        this.errorMessage = 'Erreur lors du chargement des filiales. Veuillez réessayer.';
      }
    });

    // Vérifier si on est en mode édition
    this.idOffre = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.idOffre) {
      this.isEditMode = true;
      this.offreService.getOffreById(this.idOffre).subscribe({
        next: (data) => {
          if (data.datePublication) {
            data.datePublication = new Date(data.datePublication);
          }
          if (data.dateExpiration) {
            data.dateExpiration = new Date(data.dateExpiration);
          }
          // if (data.dateModification) {
          //   data.dateModification = new Date(data.dateModification).toISOString().split('T')[0];
          // }
          this.offreForm.patchValue(data);
          data.offreCompetences.forEach((comp: any) => this.addCompetence(comp));
        },
        error: (err) => {
          console.error('Error fetching offre:', err);
          this.errorMessage = 'Erreur lors du chargement de l\'offre. Veuillez réessayer.';
        }
      });
    }
  }

  get offreCompetences(): FormArray {
    return this.offreForm.get('offreCompetences') as FormArray;
  }

  addCompetence(data?: any) {
    const competenceGroup = this.fb.group({
      idOffreEmploi: [data?.idOffreEmploi || null],
      idCompetence: [data?.idCompetence || null],
      niveauRequis: [data?.niveauRequis || NiveauRequisType.Debutant, Validators.required],
      competence: this.fb.group({
        id: [data?.competence?.id || null],
        nom: [data?.competence?.nom || '', Validators.required],
        description: [data?.competence?.description || ''],
        dateModification: [data?.competence?.dateModification || null],
        hardSkills: this.fb.array(
          this.hardSkills.map(skill => this.fb.control(data?.competence?.hardSkills?.includes(skill) || false)),
          maxSelectionsValidator(5)
        ),
        softSkills: this.fb.array(
          this.softSkills.map(skill => this.fb.control(data?.competence?.softSkills?.includes(skill) || false)),
          maxSelectionsValidator(5)
        )
      })
    });
    this.offreCompetences.push(competenceGroup);
  }

  removeCompetence(index: number) {
    this.offreCompetences.removeAt(index);
  }

  getHardSkillsArray(index: number): FormArray {
    return this.offreCompetences.at(index).get('competence.hardSkills') as FormArray;
  }

  getSoftSkillsArray(index: number): FormArray {
    return this.offreCompetences.at(index).get('competence.softSkills') as FormArray;
  }

  getHardSkillControl(index: number, skillIndex: number): FormControl {
    return this.getHardSkillsArray(index).controls[skillIndex] as FormControl;
  }

  getSoftSkillControl(index: number, skillIndex: number): FormControl {
    return this.getSoftSkillsArray(index).controls[skillIndex] as FormControl;
  }

  onSubmit() {
    if (this.offreForm.invalid) {
      console.error('Form is invalid:', this.offreForm.errors);
      console.log('Form values:', this.offreForm.getRawValue());
      const errors = this.getFormValidationErrors();
      alert('Veuillez corriger les erreurs suivantes :\n' + errors.join('\n'));
      return;
    }

    const formValue = this.offreForm.getRawValue();

    console.log('Form values before mapping:', formValue);
    console.log('Selected idFiliale:', formValue.idFiliale);
    console.log('Selected idRecruteur:', formValue.idRecruteur);
    console.log('Selected modeTravail:', formValue.modeTravail);

    const payload = {
      ...formValue,
      idOffreEmploi: formValue.idOffreEmploi || null,
      datePublication: formValue.datePublication ? new Date(formValue.datePublication).toISOString() : null,
      dateExpiration: formValue.dateExpiration ? new Date(formValue.dateExpiration).toISOString() : null,
      dateModification: formValue.dateModification ? new Date(formValue.dateModification).toISOString() : null,
      typeContrat: parseInt(formValue.typeContrat),
      statut: parseInt(formValue.statut),
      modeTravail: parseInt(formValue.modeTravail),
      idRecruteur: formValue.idRecruteur,
      idFiliale: formValue.idFiliale,
      offreCompetences: formValue.offreCompetences.map((comp: any) => ({
        idCompetence: comp.idCompetence || null,
        niveauRequis: comp.niveauRequis,
        competence: {
          id: comp.competence.id || null,
          nom: comp.competence.nom,
          description: comp.competence.description,
          hardSkills: this.hardSkills.filter((_, i) => comp.competence.hardSkills[i]),
          softSkills: this.softSkills.filter((_, i) => comp.competence.softSkills[i]),
          dateModification: comp.competence.dateModification ? new Date(comp.competence.dateModification).toISOString() : null
        }
      }))
    };

    console.log('Payload Submitted:', payload);

    if (this.isEditMode) {
      console.log('Updating offre with ID:', this.idOffre);
      this.offreService.updateOffre(this.idOffre!, payload).subscribe({
        next: (res) => {
          console.log('Update response:', res);
          alert('Offre mise à jour avec succès');
          this.router.navigate(['/offres']);
        },
        error: (err) => {
          console.error('Error updating offre:', err);
          this.handleError(err);
        }
      });
    } else {
      console.log('Creating new offre');
      this.offreService.createOffre(payload).subscribe({
        next: (res) => {
          console.log('Create response:', res);
          alert('Offre créée avec succès');
          this.offreForm.reset();
          this.offreCompetences.clear();
          this.offreForm.patchValue({
            idRecruteur: this.connectedRecruiterId,
            recruteurNom: this.recruiterName
          });
          this.router.navigate(['/offres']);
        },
        error: (err) => {
          console.error('Error creating offre:', err);
          this.handleError(err);
        }
      });
    }
  }

  private getFormValidationErrors(): string[] {
    const errors: string[] = [];
    Object.keys(this.offreForm.controls).forEach(key => {
      const controlErrors: ValidationErrors | null = this.offreForm.get(key)?.errors ?? null;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(errorKey => {
          let message = '';
          switch (errorKey) {
            case 'required':
              message = `${key} est requis.`;
              break;
            case 'maxLength':
              message = `${key} dépasse la longueur maximale de ${controlErrors['maxLength'].requiredLength} caractères.`;
              break;
            case 'min':
              message = `${key} doit être supérieur ou égal à ${controlErrors['min'].min}.`;
              break;
            default:
              message = `${key} a une erreur: ${errorKey}.`;
          }
          errors.push(message);
        });
      }
    });

    this.offreCompetences.controls.forEach((compGroup: any, index: number) => {
      const compErrors = compGroup.get('competence')?.errors;
      if (compErrors) {
        Object.keys(compErrors).forEach(errorKey => {
          errors.push(`Compétence ${index + 1} (compétence): ${errorKey}`);
        });
      }

      const nomErrors = compGroup.get('competence.nom')?.errors;
      if (nomErrors) {
        Object.keys(nomErrors).forEach(errorKey => {
          errors.push(`Compétence ${index + 1} (nom): ${errorKey === 'required' ? 'Le nom est requis.' : errorKey}`);
        });
      }

      const hardSkillsErrors = compGroup.get('competence.hardSkills')?.errors;
      if (hardSkillsErrors) {
        errors.push(`Compétence ${index + 1} (hardSkills): Maximum 5 hard skills autorisés. Sélectionnés: ${hardSkillsErrors['maxSelections']?.selected}`);
      }

      const softSkillsErrors = compGroup.get('competence.softSkills')?.errors;
      if (softSkillsErrors) {
        errors.push(`Compétence ${index + 1} (softSkills): Maximum 5 soft skills autorisés. Sélectionnés: ${softSkillsErrors['maxSelections']?.selected}`);
      }
    });

    return errors;
  }

  private handleError(err: any) {
    console.error('Status:', err.status);
    console.error('Status Text:', err.statusText);
    console.error('Error Details:', err.error);

    if (err.error && err.error.errors) {
      console.error('Validation Errors:', err.error.errors);
      const validationErrors = Object.entries(err.error.errors)
        .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
        .join('\n');
      alert('Erreur de validation :\n' + validationErrors);
    } else if (err.error && err.error.message) {
      alert('Erreur : ' + err.error.message);
    } else {
      alert('Une erreur inattendue est survenue. Veuillez réessayer.');
    }
  }
}