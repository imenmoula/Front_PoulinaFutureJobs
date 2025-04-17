import { Filiale } from './filiale.model';
import { ModeTravail, StatutOffre, TypeContratEnum } from "./enums.model";
import { OffreCompetence } from "./offre-competence.model";

export interface OffreEmploi {
  idOffreEmploi?: string;
  specialite: string;
  titre: string;
  description: string;
  datePublication?: Date|string; // Use string to match ISO date from backend
  dateExpiration: Date|string;
  SalaireMax ?: number;
 SalaireMin?: number;
  niveauExperienceRequis: string;
  diplomeRequis: string;
  typeContrat: TypeContratEnum;
  statut: StatutOffre;
  modeTravail: ModeTravail;
  nombrePostes: number;
  avantages: string;
  idRecruteur: string;
  idFiliale: string;
  filiale?: Filiale;
  offreCompetences: OffreCompetence[];

}
