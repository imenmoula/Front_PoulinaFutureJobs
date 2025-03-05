import { Filiale } from './filiale.model';
export interface Departement {
    idDepartement: string; // GUID, converti en string pour JSON
    nom: string;
    description: string;
    dateCreation: string; // DateTime converti en string (ISO 8601, par exemple "2025-03-05T08:01:26.866Z")
    idFiliale: string; // Clé étrangère vers Filiale
    filiale?: Filiale; // Propriété de navigation (optionnelle)
  }