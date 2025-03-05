import { Component, OnInit } from '@angular/core';
import { FilialeService } from '../../shared/services/filiale.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-filiale-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './filiale-list.component.html',
  styles: ``
})
export class FilialeListComponent implements OnInit {
  filiales: Filiale[] = [];
  filialeForm: FormGroup;
  isEditing: boolean = false;
  selectedFilialeId: string | null = null;

  constructor(
    private filialeService: FilialeService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.filialeForm = this.fb.group({
      idFiliale: [''],
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      description: ['', Validators.required],
      photo: ['']
    });
  }

  ngOnInit(): void {
    this.loadFiliales();
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (data) => this.filiales = data,
      error: (err) => this.toastr.error('Error loading filiales', 'Error')
    });
  }

  onSubmit(): void {
    if (this.filialeForm.valid) {
      const filiale: Filiale = this.filialeForm.value;
      if (this.isEditing && this.selectedFilialeId) {
        this.filialeService.updateFiliale(this.selectedFilialeId, filiale).subscribe({
          next: () => {
            this.toastr.success('Filiale updated successfully', 'Success');
            this.loadFiliales();
            this.resetForm();
          },
          error: (err) => this.toastr.error('Error updating filiale', 'Error')
        });
      } else {
        this.filialeService.createFiliale(filiale).subscribe({
          next: () => {
            this.toastr.success('Filiale created successfully', 'Success');
            this.loadFiliales();
            this.resetForm();
          },
          error: (err) => this.toastr.error('Error creating filiale', 'Error')
        });
      }
    }
  }

  editFiliale(filiale: Filiale): void {
    this.isEditing = true;
    this.selectedFilialeId = filiale.idFiliale;
    this.filialeForm.patchValue(filiale);
  }

  deleteFiliale(id: string): void {
    if (confirm('Are you sure you want to delete this filiale?')) {
      this.filialeService.deleteFiliale(id).subscribe({
        next: () => {
          this.toastr.success('Filiale deleted successfully', 'Success');
          this.loadFiliales();
        },
        error: (err) => this.toastr.error('Error deleting filiale', 'Error')
      });
    }
  }

  resetForm(): void {
    this.filialeForm.reset({
      idFiliale: '',
      nom: '',
      adresse: '',
      description: '',
      photo: ''
    });
    this.isEditing = false;
    this.selectedFilialeId = null;
  }
}