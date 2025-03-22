import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../shared/services/user.service';
import { RoleService } from '../../shared/services/role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css']
})
export class CandidateFormComponent implements OnInit {
  candidateForm: FormGroup;
  roles: any[] = [];
  candidateId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.candidateForm = this.fb.group({
      id: [''],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      fullName: ['']
    });
  }

  ngOnInit(): void {
    this.loadRoles();

    this.candidateId = this.route.snapshot.paramMap.get('id');
    if (this.candidateId) {
      this.isEditMode = true;
      this.loadCandidateDetails(this.candidateId);
    }
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        console.log('Rôles chargés:', roles);
        this.roles = roles;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rôles', error);
        this.snackBar.open('Erreur lors du chargement des rôles.', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadCandidateDetails(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        const candidate = response.data ? response.data : response;
        console.log('Détails du candidat:', candidate);

        this.candidateForm.patchValue({
          id: candidate.id,
          nom: candidate.nom,
          prenom: candidate.prenom,
          email: candidate.email,
          fullName: candidate.fullName,
          role: candidate.role
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        this.snackBar.open('Erreur lors du chargement des détails.', 'Fermer', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.candidateForm.invalid) {
      this.candidateForm.markAllAsTouched();
      return;
    }

    const candidateData = {
      ...this.candidateForm.value,
      fullName: `${this.candidateForm.value.prenom} ${this.candidateForm.value.nom}`,
      id: this.candidateId || undefined
    };

    if (this.isEditMode && this.candidateId) {
      this.userService.updateUser(this.candidateId, candidateData).subscribe({
        next: () => {
          this.snackBar.open('Candidat mis à jour avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/candidate']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.snackBar.open('Erreur lors de la mise à jour: ' + (err.error?.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.userService.createUser(candidateData).subscribe({
        next: () => {
          this.snackBar.open('Candidat ajouté avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/candidate']);
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout:', err);
          this.snackBar.open('Erreur lors de l\'ajout: ' + (err.error?.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
        }
      });
    }
  }
  onCancel(): void {
    this.router.navigate(['/candidate']);
  }
}