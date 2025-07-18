

import { Component, OnInit } from '@angular/core';
import { DepartementService } from '../../shared/services/departement.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { Filiale } from '../../Models/filiale.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-departement-form',
  templateUrl: './departement-form.component.html',
  styleUrls: ['./departement-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule, HeaderComponent, FooterComponent, SidebarComponent],
})
export class DepartementFormComponent implements OnInit {
  departementForm: FormGroup;
  filiales: Filiale[] = [];
  departementId: string | null = null;
  sidebarOpen: boolean = false;

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
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun ID de département fourni',
      }).then(() => {
        this.router.navigate(['/departements']);
      });
      return;
    }

    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales;
        this.loadDepartmentData();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Échec du chargement des filiales : ' + error.message,
        });
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
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Les données du département sont vides',
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur de Chargement',
            text: 'Échec du chargement du département : ' + error.message,
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.departementForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire Invalide',
        text: 'Veuillez remplir tous les champs obligatoires',
      });
      return;
    }

    if (!this.departementId) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun ID de département fourni',
      });
      return;
    }

    const departementData = this.departementForm.value;
    this.departementService.updateDepartement(this.departementId, departementData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Département modifié avec succès',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/departements']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Modification',
          text: 'Échec de la modification du département : ' + error.message,
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/Departements']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}