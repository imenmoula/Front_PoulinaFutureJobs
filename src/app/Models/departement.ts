import { Filiale } from "./filiale.model";

export interface Departement {
  idDepartement: string;  // ? signifie que ce champ est optionnel
  nom: string;
  description: string;
  dateCreation?: Date;
  filiale: Filiale; // 🔹 Ajoute ceci
  }