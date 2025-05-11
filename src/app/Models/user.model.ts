import { Role } from "./role.model";
import { UserRole } from "./user-role.model";
import { v4 as uuidv4 } from 'uuid';

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
  phone ?: string; 
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
   idFiliale?: string; // Nouvelle propriété pour la relation avec Filiale
  nomFiliale?: string; 
role?: Role;
index?: number;
  UserRoles?: UserRole[];
}
  
