import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Filiale } from '../../../Models/filiale.model';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
      },
      error: (err: any) => {
        this.errorMessage = `Erreur lors du chargement de la filiale : ${err.message || err.statusText || 'Une erreur est survenue'}`;
        console.error('Load filiale error:', err);
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
        this.photo = e.target.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadPhoto(): Observable<string> {
    if (!this.selectedFile) {
      return of(this.photo || '');  // Si pas de photo sélectionnée, renvoyer l'URL existante
    }
  
    const formData = new FormData();
    formData.append('photo', this.selectedFile);
  
    return this.filialeService.uploadPhoto(this.selectedFile).pipe(
      catchError((err: any) => {
        this.errorMessage = `Erreur lors du téléchargement de la photo : ${err.message || err.statusText || 'Une erreur est survenue'}`;
        return of('');
      })
    );
  }
  
  
  onSubmit(): void {
    if (this.filialeForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement';
      return;
    }
  
    const filiale: Filiale = {
      idFiliale: this.isEditMode ? this.filialeId! : '',
      nom: this.filialeForm.get('nom')?.value,
      adresse: this.filialeForm.get('adresse')?.value,
      description: this.filialeForm.get('description')?.value || '',
      dateCreation: new Date(this.filialeForm.get('dateCreation')?.value),
      photo: this.photo  // L'URL de la photo sera assignée ici
    };
  
    if (this.selectedFile) {
      this.uploadPhoto().subscribe({
        next: (photo: string) => {
          if (photo) {
            filiale.photo = photo;
          }
          this.saveFiliale(filiale);
        },
        error: (err: any) => {
          this.errorMessage = `Erreur lors de l'upload de la photo : ${err.message}`;
          this.successMessage = null;
          console.error('Upload photo error:', err);
        }
      });
    } else {
      this.saveFiliale(filiale);
    }
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
        this.errorMessage = null;
  
        // Vous pouvez aussi définir un délai avant de rediriger l'utilisateur, pour afficher le message de succès
        setTimeout(() => this.router.navigate(['/']), 1500); // Redirection après 1.5 seconde
      },
      error: (err: any) => {
        this.errorMessage = `Erreur lors de ${this.isEditMode ? 'la mise à jour' : "l'ajout"} : ${err.message || err.statusText || 'Une erreur est survenue'}`;
        this.successMessage = null;
        console.error('Save filiale error:', err);
      }
    });
  }
  
  get nom() { return this.filialeForm.get('nom'); }
  get adresse() { return this.filialeForm.get('adresse'); }
  get dateCreation() { return this.filialeForm.get('dateCreation'); }
}
