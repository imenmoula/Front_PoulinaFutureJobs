// departement-add.component.ts
import { Component, OnInit } from '@angular/core';

import { Filiale } from '../../Models/filiale.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartementService } from '../../shared/services/departement.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-departement-add',
  templateUrl: './departement-add.component.html',
  styleUrls: ['./departement-add.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class DepartementAddComponent implements OnInit {
  departementForm: FormGroup;
  filiales: Filiale[] = [];

  constructor(
    private fb: FormBuilder,
    private departementService: DepartementService,
    private filialeService: FilialeService,
    private router: Router, // Keep private
    private toastr: ToastrService
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
        this.showError('Failed to load filiales: ' + error.message);
      }
    });
  }

  onSubmit(): void {
    if (this.departementForm.invalid) {
      this.showError('Please fill out all required fields');
      return;
    }

    const departementData = this.departementForm.value;
    this.departementService.addDepartement(departementData).subscribe({
      next: (response) => {
        this.showSuccess('Department added successfully');
        this.router.navigate(['/departements']);
      },
      error: (error) => {
        this.showError('Failed to add department: ' + error.message);
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