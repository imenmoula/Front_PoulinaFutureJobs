import { Injectable } from '@angular/core';
import { Langue } from '../../Models/enums.model';
import { OffreLangue } from '../../Models/offre-emploi.model';

@Injectable({
  providedIn: 'root'
})
export class LangueService {

  constructor() { }
  getLangues(): OffreLangue[] {
    return [
      { langue: Langue.Francais, niveauRequis: '' },
      { langue: Langue.Anglais, niveauRequis: '' },
      { langue: Langue.Espagnol, niveauRequis: '' },
      { langue: Langue.Allemand, niveauRequis: '' },
      { langue: Langue.Arabe, niveauRequis: '' },
      { langue: Langue.Italien, niveauRequis: '' }
    ];
  }

  getNiveauxRequis(): string[] {
    return ['Débutant', 'Intermédiaire', 'Courant', 'Professionnel'];
  }
}
