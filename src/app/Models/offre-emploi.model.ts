import { Filiale } from './filiale.model';
import { Langue, ModeTravail, NiveauRequisType, StatutOffre, TypeContratEnum } from "./enums.model";
import { OffreCompetence } from "./offre-competence.model";

export interface OffreEmploi {
  idOffreEmploi?: string; // Optional, as it may be undefined before creation
  specialite: string;
  
  datePublication?: Date|string; // Use string to match ISO date from backend
  dateExpiration: Date|string;
  SalaireMax ?: number;
 SalaireMin?: number;
  niveauExperienceRequis: string;
  typeContrat: TypeContratEnum;
  statut: StatutOffre;
  modeTravail: ModeTravail;
  nombrePostes: number;
  avantages: string;
  estactif: boolean;
  idRecruteur: string;
  idFiliale: string;
  filiale?: Filiale;
  idDepartement: string;
  departement?: string;
  postes: Poste[];
  offreMissions: OffreMission[];
  offreLangues: OffreLangue[];
  offreCompetences: OffreCompetence[];
  diplomeIds: string[];
  diplomes?: Diplome[];

}
export interface Poste {
  idPoste?: string;
  titrePoste: string;
  description: string;
  nombrePostes: number;
  experienceSouhaitee?: string;
  niveauHierarchique: string;
  idOffreEmploi?: string;
}

export interface OffreMission {
  idOffreMission: string;
  idOffreEmploi: string;
  descriptionMission: string;
  priorite?: number; // Optionnel, selon les besoins
}
export interface OffreLangue {
  idOffreLangue?: string;
  idOffreEmploi?: string;
  langue: Langue;
  niveauRequis: string;
}





export interface Diplome {
  idDiplome: string;
  nomDiplome: string;
  niveau: string;
  domaine: string;
  institution: string;
}

export interface CreateOffreEmploiRequest {
  dto: OffreEmploi;
}