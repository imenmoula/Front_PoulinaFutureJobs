import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilialeService } from '../../shared/services/filiale.service';
import { Filiale } from '../../../Models/filiale.model';


@Component({
  selector: 'app-filiale-form',
  templateUrl: './filiale-form.component.html',
  styleUrls: ['']
})
export class FilialeFormComponent implements OnInit {
  filialeForm!: FormGroup;

  constructor(private fb: FormBuilder, private filialeService: FilialeService) {}

  ngOnInit(): void {
    this.filialeForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.filialeForm.valid) {
      const filiale: Filiale = {
        idFiliale: '', // Généré automatiquement par le backend
        nom: this.filialeForm.get('nom')?.value,
        adresse: this.filialeForm.get('adresse')?.value,
        description: this.filialeForm.get('description')?.value,
        photo: '',
        dateCreation: new Date()
      };

      this.filialeService.addFiliale(filiale).subscribe(
        (response) => console.log('Nouvelle filiale ajoutée :', response),
        (error) => console.error('Erreur lors de lajout de la filiale :', error)
      );
    }
  }
}