import { ModeTravail, StatutOffre, TypeContratEnum } from "./enums.model";
import { OffreCompetence } from "./offre-competence.model";

export interface OffreEmploi {
  idOffreEmploi?: string;
  specialite: string;
  titre: string;
  description: string;
  datePublication?: Date; // Use string to match ISO date from backend
  dateExpiration?: Date;
  salaire: number;
  niveauExperienceRequis: string;
  diplomeRequis: string;
  typeContrat: number;
  statut: number;
  modeTravail: number;
  nombrePostes: number;
  avantages: string;
  idRecruteur: string;
  idFiliale: string;
  offreCompetences: OffreCompetence[];
}
