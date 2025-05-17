import { Competence } from "./competence.model";
import { NiveauRequisType } from "./enums.model";

export interface OffreCompetence {
  idOffreEmploi: string;
  idCompetence?: string; // Peut être vide si nouvelle compétence
  niveauRequis: NiveauRequisType;
  competence?: Competence;
}