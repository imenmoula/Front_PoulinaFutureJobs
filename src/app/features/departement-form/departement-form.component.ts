import { Component, OnInit } from '@angular/core';
import { DepartementService } from '../../shared/services/departement.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { Filiale } from '../../Models/filiale.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-departement-form',
  templateUrl: './departement-form.component.html',
  styleUrls: ['./departement-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DepartementFormComponent implements OnInit {
  departementForm: FormGroup;
  filiales: Filiale[] = [];
  departementId: string | null = null;
  successMessage: string | null = null;
  errorMessages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private departementService: DepartementService,
    private filialeService: FilialeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.departementForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      idFiliale: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.departementId = this.route.snapshot.paramMap.get('id');
    if (!this.departementId) {
      this.showError(['Aucun ID de département fourni']);
      this.router.navigate(['/departements']);
      return;
    }

    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales;
        this.loadDepartmentData();
      },
      error: (error) => {
        this.showError(['Échec du chargement des filiales : ' + error.message]);
      }
    });
  }

  loadDepartmentData(): void {
    if (this.departementId) {
      this.departementService.getDepartementById(this.departementId).subscribe({
        next: (departement) => {
          if (departement) {
            this.departementForm.patchValue({
              nom: departement.nom || '',
              description: departement.description || '',
              idFiliale: departement.idFiliale || departement.filiale?.idFiliale || ''
            });
          } else {
            this.showError(['Les données du département sont vides']);
          }
        },
        error: (error) => {
          this.showError(['Échec du chargement du département : ' + error.message]);
        }
      });
    }
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessages = [];

    if (this.departementForm.invalid) {
      this.showError(['Veuillez remplir tous les champs obligatoires']);
      return;
    }

    if (!this.departementId) {
      this.showError(['Aucun ID de département fourni']);
      return;
    }

    const departementData = this.departementForm.value;
    this.departementService.updateDepartement(this.departementId, departementData).subscribe({
      next: (response) => {
        this.showSuccess('Département modifié avec succès');
        setTimeout(() => {
          this.router.navigate(['/departements']);
        }, 2000);
      },
      error: (error) => {
        this.showError(['Échec de la modification du département : ' + error.message]);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/departements']);
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessages = [];
  }

  private showError(messages: string[]): void {
    this.successMessage = null;
    this.errorMessages = messages;
  }
}