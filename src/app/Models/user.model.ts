import { Role } from "./role.model";
import { UserRole } from "./user-role.model";
import { v4 as uuidv4 } from 'uuid';

export interface User {

  id: string;
  Id?: string;      // Compatibilité API
  FullName?: string; // Compatibilité API
  email: string;
  Email?: string;    /// Pour la compatibilité
  fullName: string;
  nom: string;
  prenom: string;
  photo?: string;
  dateNaissance?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  phone ?: string; 

 
  entreprise?: string;
  poste?: string;
   idFiliale?: string; // Nouvelle propriété pour la relation avec Filiale
  nomFiliale?: string; 
role?: Role;
index?: number;
  UserRoles?: UserRole[];
}
  
