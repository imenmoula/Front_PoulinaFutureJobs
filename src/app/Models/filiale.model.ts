// src/app/models/filiale.model.ts
export interface Filiale {
  idFiliale: string;
  nom: string;
  adresse: string;
  description: string;
  dateCreation: Date;
  photo?: string;
  phone?: string;
  fax?: string;
  email?: string;
  siteWeb?: string;
  departements?: any[];
}