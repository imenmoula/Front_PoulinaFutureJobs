import { HardSkillType, SoftSkillType } from "./enums.model";

export interface Competence {
  id?: string;
  nom: string;
  description: string;
  dateModification?: Date;
  hardSkills: HardSkillType[];
  softSkills: SoftSkillType[];
  }