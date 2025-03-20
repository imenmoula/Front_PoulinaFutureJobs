import { UserRole } from "./user-role.model";
import { v4 as uuidv4 } from 'uuid';

// src/app/models/user.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  nom: string;
  prenom: string;
  photo?: string;
  dateNaissance?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  phone?: string;
  niveauEtude?: string;
  diplome?: string;
  universite?: string;
  specialite?: string;
  cv?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  entreprise?: string;
  poste?: string;
  UserRoles?: UserRole[];
}
  
 