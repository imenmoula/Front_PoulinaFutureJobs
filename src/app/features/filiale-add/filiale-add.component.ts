import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FilialeService } from '../../shared/services/filiale.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-filiale-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FooterComponent, HeaderComponent, SidebarComponent],
  templateUrl: './filiale-add.component.html',
  styleUrls: ['./filiale-add.component.css']
})
export class FilialeAddComponent implements OnInit {
  filialeForm: FormGroup;
  selectedFile: File | null = null;
  photo: string | null = null;
  sidebarOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private filialeService: FilialeService,
    private router: Router
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

  ngOnInit(): void {}

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

    let photoUrl = this.photo || '';
    if (this.selectedFile) {
      try {
        photoUrl = await this.uploadPhoto();
      } catch (error) {
        return;
      }
    }

    const filialeData = {
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

    this.filialeService.addFiliale(filialeData).subscribe({
      next: (response) => {
        console.log('Add Response:', response);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Filiale ajoutée avec succès',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/admin/filiales']);
        });
      },
      error: (error) => {
        console.error('Add Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur d\'Ajout',
          text: 'Échec de l\'ajout de la filiale : ' + (error.error?.message || error.message),
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





