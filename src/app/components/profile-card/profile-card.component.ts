import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule , SharedModule],

  styleUrls: ['./profile-card.component.css'],
})
export class ProfileCardComponent {
  user = {
    prenom: 'Ali',
    nom: 'Ben Salah',
    titre: 'Développeur Full Stack',
    disponibilite: 'Disponible',
    avatar: '', // Lien de l'image (vide si non dispo)
  };
  activeTab = 'infos';

  getInitials(): string {
    return this.user.prenom.charAt(0) + this.user.nom.charAt(0);
  }
}
