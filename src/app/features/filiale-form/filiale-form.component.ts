import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Filiale } from '../../../Models/filiale.model';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FilialeService } from '../../shared/services/filiale.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filiale-form',
  templateUrl: './filiale-form.component.html',
  styleUrls: ['./filiale-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class FilialeFormComponent implements OnInit {
  filialeForm: FormGroup;
  isEditMode = false;
  filialeId: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null;
  photo: string | null = null;
  isLoading: boolean = false;

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
      dateCreation: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.filialeId = this.route.snapshot.paramMap.get('id');
    if (this.filialeId) {
      this.isEditMode = true;
      this.loadFilialeData(this.filialeId);
    }
  }

  loadFilialeData(id: string): void {
    this.isLoading = true;
    this.filialeService.getFiliale(id).subscribe({
      next: (filiale: Filiale) => {
        const date = new Date(filiale.dateCreation);
        const formattedDate = date.toISOString().split('T')[0];
        
        this.filialeForm.patchValue({
          nom: filiale.nom,
          adresse: filiale.adresse,
          description: filiale.description || '',
          dateCreation: formattedDate
        });
        this.photo = filiale.photo ?? null;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = `Erreur lors du chargement de la filiale : ${err.message || err.statusText || 'Une erreur est survenue'}`;
        this.isLoading = false;
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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photo = e.target.result as string; // Aperçu local de l'image
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadPhoto(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(this.photo || ''); // Retourne l'URL existante ou une chaîne vide
        return;
      }

      this.isLoading = true;
      this.filialeService.uploadPhoto(this.selectedFile).subscribe({
        next: (response) => {
          this.isLoading = false;
          resolve(response.url); // Retourne l'URL de la photo uploadée
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de l\'upload de la photo : ' + error.message;
          reject(error);
        }
      });
    });
  }

  async onSubmit(): Promise<void> {
    if (this.filialeForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    let photoUrl = this.photo || '';
    if (this.selectedFile) {
      try {
        photoUrl = await this.uploadPhoto();
      } catch (error) {
        return; // L'erreur est déjà gérée dans uploadPhoto
      }
    }

    const filiale: Filiale = {
      idFiliale: this.isEditMode ? this.filialeId! : '', // L'ID sera généré par le backend en mode ajout
      nom: this.filialeForm.get('nom')?.value,
      adresse: this.filialeForm.get('adresse')?.value,
      description: this.filialeForm.get('description')?.value || '',
      dateCreation: new Date(this.filialeForm.get('dateCreation')?.value),
      photo: photoUrl
    };

    this.saveFiliale(filiale);
  }

  saveFiliale(filiale: Filiale): void {
    const action = this.isEditMode
      ? this.filialeService.updateFiliale(this.filialeId!, filiale)
      : this.filialeService.addFiliale(filiale);

      (action as any).subscribe({
      next: () => {
        this.successMessage = this.isEditMode
          ? 'Filiale mise à jour avec succès !'
          : 'Filiale ajoutée avec succès !';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/admin/filiales']), 1500); // Redirection vers la liste
      },
      error: (err: any) => {
        this.errorMessage = `Erreur lors de ${this.isEditMode ? 'la mise à jour' : "l'ajout"} : ${err.message || err.statusText || 'Une erreur est survenue'}`;
        this.isLoading = false;
      }
    });
  }

  get nom() { return this.filialeForm.get('nom'); }
  get adresse() { return this.filialeForm.get('adresse'); }
  get dateCreation() { return this.filialeForm.get('dateCreation'); }
}