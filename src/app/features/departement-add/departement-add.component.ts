

import { Component, OnInit } from '@angular/core';
import { Filiale } from '../../Models/filiale.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartementService } from '../../shared/services/departement.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-departement-add',
  templateUrl: './departement-add.component.html',
  styleUrls: ['./departement-add.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FooterComponent, HeaderComponent, SidebarComponent]
})
export class DepartementAddComponent implements OnInit {
  departementForm: FormGroup;
  filiales: Filiale[] = [];
  sidebarOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private departementService: DepartementService,
    private filialeService: FilialeService,
    private router: Router
  ) {
    this.departementForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      idFiliale: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales;
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

  onSubmit(): void {
    if (this.departementForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire Invalide',
        text: 'Veuillez remplir tous les champs obligatoires',
      });
      return;
    }

    const departementData = this.departementForm.value;
    this.departementService.addDepartement(departementData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Département ajouté avec succès',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/departements']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur d\'Ajout',
          text: 'Échec de l\'ajout du département : ' + error.message,
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