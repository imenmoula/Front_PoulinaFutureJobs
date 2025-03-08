import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilialeService } from '../../shared/services/filiale.service';
import { Filiale } from '../../../Models/filiale.model';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-filiale-form',
  templateUrl: './filiale-form.component.html',
  styleUrls: ['./filiale-form.component.css']
})
export class FilialeFormComponent implements OnInit {
  filialeForm: FormGroup;
  isEditMode = false;
  filialeId: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null; // Pour stocker le fichier sélectionné
  photoUrl: string | null = null; // Pour stocker l'URL de la photo après upload

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
      dateCreation: ['', Validators.required] // Date requise
      // Pas de 'image' dans le FormGroup car géré séparément
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
    this.filialeService.getFilialeById(id).subscribe({
      next: (filiale: Filiale) => {
        this.filialeForm.patchValue({
          nom: filiale.nom,
          adresse: filiale.adresse,
          description: filiale.description,
          dateCreation: filiale.dateCreation.toISOString().split('T')[0] // Format YYYY-MM-DD
        });
        this.photoUrl = filiale.photo ?? null; // Pré-remplir l'URL de la photo si existante
      },
      error: (err) => {
        this.errorMessage = `Erreur lors du chargement de la filiale : ${err.message}`;
      }
    });
  }

  // Gestion du changement de fichier
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Upload de la photo et renvoi de l'URL ou nom du fichier
  uploadPhoto(): Promise<string> {
    if (!this.selectedFile) {
      return Promise.resolve(this.photoUrl || ''); // Retourne l'URL existante ou vide
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    return this.filialeService.uploadImage(this.filialeId!, formData).toPromise()
      .then(response => {
        // Supposons que le backend renvoie { fileName: string } ou { url: string }
        this.photoUrl = response.fileName || response.url || '';
        return this.photoUrl ?? ''; // Add null check here
      })
      .catch(err => {
        this.errorMessage = `Erreur lors de l'upload de la photo : ${err.message}`;
        throw err;
      });
  }

  onSubmit(): void {
    if (this.filialeForm.valid) {
      this.uploadPhoto().then(photo => {
        const filiale: Filiale = {
          idFiliale: this.isEditMode ? this.filialeId! : '',
          nom: this.filialeForm.get('nom')?.value,
          adresse: this.filialeForm.get('adresse')?.value,
          description: this.filialeForm.get('description')?.value,
          photo: photo, // URL ou nom du fichier après upload
          dateCreation: new Date(this.filialeForm.get('dateCreation')?.value)
        };

        const action = this.isEditMode
          ? this.filialeService.updateFiliale(this.filialeId!, filiale)
          : this.filialeService.addFiliale(filiale);

        action.subscribe({
          next: () => {
            this.successMessage = this.isEditMode
              ? 'Filiale mise à jour avec succès !'
              : 'Filiale ajoutée avec succès !';
            this.errorMessage = null;
            setTimeout(() => this.router.navigate(['/']), 1500);
          },
          error: (err) => {
            this.errorMessage = `Erreur lors de ${this.isEditMode ? 'la mise à jour' : "l'ajout"} : ${err.message}`;
            this.successMessage = null;
          }
        });
      }).catch(() => {
        // Erreur déjà gérée dans uploadPhoto
      });
    }
  }

  get nom() { return this.filialeForm.get('nom'); }
  get adresse() { return this.filialeForm.get('adresse'); }
  get dateCreation() { return this.filialeForm.get('dateCreation'); }
}