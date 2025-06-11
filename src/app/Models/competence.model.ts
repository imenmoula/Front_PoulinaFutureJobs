import { OffreCompetence } from './offre-competence.model';

export interface Competence {
  id?: string;
  nom: string;
  description: string;
  dateModification?: Date;
  dateAjout?:Date;
 
  estTechnique: boolean;
  estSoftSkill: boolean;

  }