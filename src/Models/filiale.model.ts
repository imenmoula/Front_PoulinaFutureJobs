import { Departement } from "./departement.model";

export interface Filiale {
    idFiliale: string; // GUID, converti en string pour JSON
    nom: string;
    adresse: string;
    description: string;
    photo: string;
    departements?: Departement[]; // Liste des départements (relation 1:N)
  }