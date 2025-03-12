import { Component, OnInit } from '@angular/core';
import { DepartementService } from '../../shared/services/departement.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-departement-add',
  templateUrl: './departement-add.component.html',
  styleUrls: ['./departement-add.component.css']
})
export class DepartementAddComponent implements OnInit {
  departementForm!: FormGroup;

  constructor(private fb: FormBuilder, private departementService: DepartementService) {}

  ngOnInit(): void {
    this.departementForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      idFiliale: ['', Validators.required]  // L'utilisateur choisira une filiale existante
    });
  }

  onSubmit(): void {
    if (this.departementForm.valid) {
      this.departementService.addDepartement(this.departementForm.value).subscribe({
        next: (res) => {
          console.log('Département ajouté avec succès', res);
          alert('Département ajouté avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout', err);
          alert('Erreur lors de l\'ajout du département');
        }
      });
    }
  }
}
