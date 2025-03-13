import { DepartementService } from './../../shared/services/departement.service';
import { FilialeService } from './../../shared/services/filiale.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { data } from 'jquery';
import { Departement } from '../../Models/departement';
import { Filiale } from '../../Models/filiale.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-departement-form',
  templateUrl: './departement-form.component.html',
  styleUrls: ['./departement-form.component.css'],
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule]
})
export class DepartementFormComponent implements OnInit {
    
    
      departementForm: FormGroup;
      filiales: Filiale[] = [];
      departementId: string | null = null;
    
      constructor(
        private fb: FormBuilder,
        private departementService: DepartementService,
        private filialeService: FilialeService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService
      ) {
        this.departementForm = this.fb.group({
          nom: ['', Validators.required],
          description: ['', Validators.required],
          idFiliale: ['', Validators.required]
        });
      }
    
      ngOnInit(): void {
        // Get the department ID from the route
        this.departementId = this.route.snapshot.paramMap.get('id');
        if (!this.departementId) {
          this.showError('No department ID provided');
          this.router.navigate(['/departements']);
          return;
        }
    
        // Load filiales
        this.filialeService.getFiliales().subscribe({
          next: (filiales) => {
            this.filiales = filiales;
            this.loadDepartmentData(); // Load department data after filiales are loaded
          },
          error: (error) => {
            this.showError('Failed to load filiales: ' + error.message);
          }
        });
      }
    
      loadDepartmentData(): void {
        if (this.departementId) {
          this.departementService.getDepartementById(this.departementId).subscribe({
            next: (departement) => {
              if (departement) {
                console.log('Department data:', departement);
                this.departementForm.patchValue({
                  nom: departement.nom || '',
                  description: departement.description || '',
                  idFiliale: departement.idFiliale || departement.filiale?.idFiliale || ''
                });
              } else {
                this.showError('Department data is empty');
              }
            },
            error: (error) => {
              this.showError('Failed to load department: ' + error.message);
              console.error('Error fetching department:', error);
            }
          });
        }
      }
    
      onSubmit(): void {
        if (this.departementForm.invalid) {
          this.showError('Please fill out all required fields');
          return;
        }
    
        if (!this.departementId) {
          this.showError('No department ID provided');
          return;
        }
    
        const departementData = this.departementForm.value;
        this.departementService.updateDepartement(this.departementId, departementData).subscribe({
          next: (response) => {
            this.showSuccess('Department updated successfully');
            this.router.navigate(['/departements']);
          },
          error: (error) => {
            this.showError('Failed to update department: ' + error.message);
          }
        });
      }
      cancel(): void {
        this.router.navigate(['/departements']);
      }
    
      private showSuccess(message: string): void {
        this.toastr.success(message, 'Success');
      }
    
      private showError(message: string): void {
        this.toastr.error(message, 'Error');
      }
    }

