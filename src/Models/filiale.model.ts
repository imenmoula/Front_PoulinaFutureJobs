// src/app/models/filiale.model.ts
export interface Filiale {
  idFiliale: string; // GUID
  nom: string;
  adresse: string;
  description: string;
  photo?: string|null;
  dateCreation: Date|string;
}