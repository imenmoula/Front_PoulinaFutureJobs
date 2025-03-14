// departement-add.component.ts
import { Component, OnInit } from '@angular/core';

import { Filiale } from '../../Models/filiale.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartementService } from '../../shared/services/departement.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-departement-add',
  templateUrl: './departement-add.component.html',
  styleUrls: ['./departement-add.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,FooterComponent,HeaderComponent,SidebarComponent]
})
export class DepartementAddComponent implements OnInit {
 
  departementForm: FormGroup;
  filiales: Filiale[] = [];
  successMessage: string | null = null;
  errorMessages: string[] = [];
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
        this.showError(['Échec du chargement des filiales : ' + error.message]);
      }
    });
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessages = [];

    if (this.departementForm.invalid) {
      this.showError(['Veuillez remplir tous les champs obligatoires']);
      return;
    }

    const departementData = this.departementForm.value;
    this.departementService.addDepartement(departementData).subscribe({
      next: (response) => {
        this.showSuccess('Département ajouté avec succès');
        setTimeout(() => {
          this.router.navigate(['/departements']);
        }, 2000);
      },
      error: (error) => {
        this.showError(['Échec de l\'ajout du département : ' + error.message]);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/Departements']);
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessages = [];
  }

  private showError(messages: string[]): void {
    this.successMessage = null;
    this.errorMessages = messages;
  }
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}