import { RoleService } from './../../shared/services/role.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './add-admin.component.html',


})
export class AddAdminComponent implements OnInit {
  adminForm: FormGroup;
  roles: any[] = []; // Liste des rôles

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private roleservice : RoleService
  ) {
    this.adminForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required] // Champ pour le rôle
    });
  }

  ngOnInit(): void {
    this.loadRoles(); // Charger les rôles au démarrage
  }

  loadRoles(): void {
    this.roleservice.getRoles().subscribe(
      roles => {
        console.log('Rôles chargés:', roles); // Log pour vérifier les données reçues
        this.roles = roles;
      },
      error => {
        console.error('Erreur lors du chargement des rôles', error);
        this.snackBar.open('Erreur lors du chargement des rôles.', 'Fermer', { duration: 3000 });
      }
    );
  }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      return;
    }

    const newAdmin = this.adminForm.value;
    this.userService.createUser(newAdmin).subscribe({
      next: () => {
        this.snackBar.open('Administrateur ajouté avec succès !', 'Fermer', { duration: 3000 });
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
        this.snackBar.open('Erreur lors de l\'ajout.', 'Fermer', { duration: 3000 });
      }
    });
  }
}