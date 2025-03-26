import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FilialeService } from '../../shared/services/filiale.service';
import { CommonModule } from '@angular/common';
import { Filiale } from '../../Models/filiale.model';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-filiale-form',
  templateUrl: './filiale-form.component.html',
  styleUrls: ['./filiale-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent, SidebarComponent],
})
export class FilialeFormComponent implements OnInit {
  filialeForm: FormGroup;
  filialeId: string | null = null;
  selectedFile: File | null = null;
  photo: string | null = null;
  sidebarOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private filialeService: FilialeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filialeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      dateCreation: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+ ]*$')]],
      fax: [''],
      email: ['', [Validators.required, Validators.email]],
      siteWeb: ['']
    });
  }

  ngOnInit(): void {
    this.filialeId = this.route.snapshot.paramMap.get('id');
    if (this.filialeId) {
      this.loadFilialeData(this.filialeId);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun ID de filiale fourni pour la modification',
      }).then(() => {
        this.router.navigate(['/admin/filiales']);
      });
    }
  }

  loadFilialeData(id: string): void {
    this.filialeService.getFiliale(id).subscribe({
      next: (filiale: Filiale) => {
        const date = new Date(filiale.dateCreation);
        const formattedDate = date.toISOString().split('T')[0];
        this.filialeForm.patchValue({
          nom: filiale.nom,
          adresse: filiale.adresse,
          description: filiale.description || '',
          dateCreation: formattedDate,
          phone: filiale.phone || '',
          fax: filiale.fax || '',
          email: filiale.email || '',
          siteWeb: filiale.siteWeb || ''
        });
        this.photo = filiale.photo ?? null;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Erreur lors du chargement de la filiale : ' + error.message,
        });
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewPhoto();
    }
  }

  previewPhoto(): void {
    if (this.selectedFile) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jfif', 'image/gif', 'image/bmp'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        Swal.fire({
          icon: 'warning',
          title: 'Format Non Supporté',
          text: 'Veuillez sélectionner une image au format PNG, JFIF, JPEG, GIF ou BMP.',
        });
        this.selectedFile = null;
        this.photo = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photo = e.target.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadPhoto(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(this.photo || '');
        return;
      }

      this.filialeService.uploadPhoto(this.selectedFile).subscribe({
        next: (response: { message: string; url: string }) => {
          console.log('Upload Response:', response);
          resolve(response.url);
        },
        error: (error) => {
          console.error('Upload Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur d\'Upload',
            text: error.error?.message || 'Erreur lors de l\'upload de la photo',
          });
          reject(error);
        }
      });
    });
  }

  async onSubmit(): Promise<void> {
    if (this.filialeForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire Invalide',
        text: 'Veuillez remplir tous les champs obligatoires correctement',
      });
      return;
    }

    if (!this.filialeId) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun ID de filiale fourni pour la modification',
      });
      return;
    }

    let photoUrl = this.photo || '';
    if (this.selectedFile) {
      try {
        photoUrl = await this.uploadPhoto();
      } catch (error) {
        return;
      }
    }

    const filialeData: Filiale = {
      idFiliale: this.filialeId,
      nom: this.filialeForm.get('nom')?.value,
      adresse: this.filialeForm.get('adresse')?.value,
      description: this.filialeForm.get('description')?.value || '',
      dateCreation: new Date(this.filialeForm.get('dateCreation')?.value),
      phone: this.filialeForm.get('phone')?.value,
      fax: this.filialeForm.get('fax')?.value || '',
      email: this.filialeForm.get('email')?.value,
      siteWeb: this.filialeForm.get('siteWeb')?.value || '',
      photo: photoUrl
    };

    console.log('Submitting Filiale Data:', filialeData);

    this.filialeService.updateFiliale(this.filialeId, filialeData).subscribe({
      next: (response) => {
        console.log('Update Response:', response);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Filiale mise à jour avec succès',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/admin/filiales']);
        });
      },
      error: (error) => {
        console.error('Update Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Modification',
          text: 'Échec de la mise à jour de la filiale : ' + (error.error?.message || error.message),
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/filiales']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  get nom() { return this.filialeForm.get('nom'); }
  get adresse() { return this.filialeForm.get('adresse'); }
  get dateCreation() { return this.filialeForm.get('dateCreation'); }
  get phone() { return this.filialeForm.get('phone'); }
  get email() { return this.filialeForm.get('email'); }
}
//   filialeForm: FormGroup;
//   isEditMode = false;
//   filialeId: string | null = null;
//   errorMessage: string | null = null;
//   successMessage: string | null = null;
//   selectedFile: File | null = null;
//   photo: string | null = null;
//   isLoading: boolean = false;
//   sidebarOpen: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private filialeService: FilialeService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.filialeForm = this.fb.group({
//       nom: ['', [Validators.required, Validators.minLength(2)]],
//       adresse: ['', [Validators.required, Validators.minLength(5)]],
//       description: [''],
//       dateCreation: ['', Validators.required],
//       phone: ['', [Validators.required, Validators.pattern('^[0-9+ ]*$')]],
//       fax: [''],
//       email: ['', [Validators.required, Validators.email]],
//       siteWeb: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.filialeId = this.route.snapshot.paramMap.get('id');
//     if (this.filialeId) {
//       this.isEditMode = true;
//       this.loadFilialeData(this.filialeId);
//     }
//   }

//   loadFilialeData(id: string): void {
//     this.isLoading = true;
//     this.filialeService.getFiliale(id).subscribe({
//       next: (filiale: Filiale) => {
//         const date = new Date(filiale.dateCreation);
//         const formattedDate = date.toISOString().split('T')[0];

//         this.filialeForm.patchValue({
//           nom: filiale.nom,
//           adresse: filiale.adresse,
//           description: filiale.description || '',
//           dateCreation: formattedDate,
//           phone: filiale.phone || '',
//           fax: filiale.fax || '',
//           email: filiale.email || '',
//           siteWeb: filiale.siteWeb || ''
//         });

//         this.photo = filiale.photo ?? null;
//         this.isLoading = false;
//       },
//       error: (err: any) => {
//         this.errorMessage = `Erreur lors du chargement de la filiale : ${err.message || 'Une erreur est survenue'}`;
//         this.isLoading = false;
//       },
//     });
//   }
//   onCancel(): void {
//     this.router.navigate(['/admin/filiales']); // Utilise this.router ici
//   }
//   onFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFile = input.files[0];
//       this.previewPhoto();
//     }
//   }

//   previewPhoto(): void {
//     if (this.selectedFile) {
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.photo = e.target.result as string;
//       };
//       reader.readAsDataURL(this.selectedFile);
//     }
//   }

//   uploadPhoto(): Promise<string> {
//     return new Promise((resolve, reject) => {
//       if (!this.selectedFile) {
//         resolve(this.photo || '');
//         return;
//       }

//       this.isLoading = true;
//       this.filialeService.uploadPhoto(this.selectedFile).subscribe({
//         next: (response) => {
//           this.isLoading = false;
//           resolve(response.url);
//         },
//         error: (error) => {
//           this.isLoading = false;
//           this.errorMessage = 'Erreur lors de l\'upload de la photo : ' + error.message;
//           reject(error);
//         },
//       });
//     });
//   }

//   async onSubmit(): Promise<void> {
//     if (this.filialeForm.invalid) {
//       this.errorMessage = 'Veuillez remplir tous les champs requis correctement';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = null;
//     this.successMessage = null;

//     let photoUrl = this.photo || '';
//     if (this.selectedFile) {
//       try {
//         photoUrl = await this.uploadPhoto();
//       } catch (error) {
//         return;
//       }
//     }

//     const filiale: Filiale = {
//       idFiliale: this.isEditMode ? this.filialeId! : '',
//       nom: this.filialeForm.get('nom')?.value,
//       adresse: this.filialeForm.get('adresse')?.value,
//       description: this.filialeForm.get('description')?.value || '',
//       dateCreation: new Date(this.filialeForm.get('dateCreation')?.value),
//       phone: this.filialeForm.get('phone')?.value,
//       fax: this.filialeForm.get('fax')?.value,
//       email: this.filialeForm.get('email')?.value,
//       siteWeb: this.filialeForm.get('siteWeb')?.value,
//       photo: photoUrl
//     };

//     this.saveFiliale(filiale);
//   }

//   saveFiliale(filiale: Filiale): void {
//     let action$: Observable<any>;

//     if (this.isEditMode) {
//       action$ = this.filialeService.updateFiliale(this.filialeId!, filiale);
//     } else {
//       action$ = this.filialeService.addFiliale(filiale);
//     }

//     action$.subscribe({
//       complete: () => {
//         this.successMessage = this.isEditMode
//           ? 'Filiale mise à jour avec succès !'
//           : 'Filiale ajoutée avec succès !';
//         this.isLoading = false;
//         setTimeout(() => this.router.navigate(['/admin/filiales']), 1500);
//       },
//       error: (err: any) => {
//         this.errorMessage = `Erreur lors de ${this.isEditMode ? 'la mise à jour' : "l'ajout"} : ${err.message || 'Une erreur est survenue'}`;
//         this.isLoading = false;
//       },
//     });
//   }

//   get nom() { return this.filialeForm.get('nom'); }
//   get adresse() { return this.filialeForm.get('adresse'); }
//   get dateCreation() { return this.filialeForm.get('dateCreation'); }
//   get phone() { return this.filialeForm.get('phone'); }
//   get fax() { return this.filialeForm.get('fax'); }
//   get email() { return this.filialeForm.get('email'); }
//   get siteWeb() { return this.filialeForm.get('siteWeb'); }

//   toggleSidebar(): void {
//     this.sidebarOpen = !this.sidebarOpen; // Méthode pour basculer
//   }
// }