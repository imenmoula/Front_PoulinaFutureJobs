// import { OffreEmploi } from "./offre-emploi.model";

import { ModeTravail, StatutOffre, TypeContratEnum } from "./enums.model";
import { OffreCompetence } from "./offre-competence.model";
import { OffreEmploi, OffreLangue, OffreMission, Poste } from "./offre-emploi.model";

export interface Candidature {
  idCandidature: string;
  offreId: string;
  offreTitre: string;
  messageMotivation: string;
  statut: string;
  appUserId: string;
  appUser: AppUser;
  experiences: Experience[];
  competences: Competence[];
  dateSoumission: string;
  offre?: OffreEmploi; // Related OffreEmploi object
}

export interface AppUser {
  fullName: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  ville: string;
  pays: string;
  phone: string;
  niveauEtude: string;
  diplome: string;
  universite: string;
  specialite: string;
  cv: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  statut: string;
}

export interface Experience {
  poste: string;
  nomEntreprise: string;
  description: string;
  competenceAcquise: string;
  dateDebut: string;
  dateFin: string;
  certificats: Certificat[];
}

export interface Certificat {
  nom: string;
  dateObtention: string;
  organisme: string;
  description: string;
  urlDocument: string;
}

export interface Competence {
  competenceId: string;
  competenceNom: string;
  niveauPossede: string;
}
export interface CandidatureCompleteDto {
  appUserId: string;
  offreId: string;
  messageMotivation: string;
  cvFilePath: string;
  lettreMotivation: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  statutCandidate: string; // e.g. "Debutant"
  fullName: string;
  nom: string;
  prenom: string;
  dateNaissance?: Date;
  adresse: string;
  ville: string;
  pays: string;
  phone: string;
  dateSoumission: string;

  entreprise: string;
  poste: string;
  photoUrl: string;
  diplomes: CandidatureDiplomeDto[];
  experiences: CandidatureExperienceDto[];
  competences: CompetenceInputDto[];
  certificats: CandidatureCertificatDto[];
}

export interface CandidatureDiplomeDto {
  id?: string;
  nomDiplome: string;
  institution: string;
  dateObtention: Date;
  specialite?: string;
  urlDocument?: string;
}

export interface CandidatureExperienceDto {
  id?: string;
  poste: string;
  nomEntreprise: string;
  dateDebut: Date;
  dateFin?: Date;
  description?: string;
  competenceAcquise?: string;
}

export interface CandidatureCertificatDto {
  id?: string;
  nom: string;
  organisme: string;
  dateObtention: Date;
  description?: string;
  urlDocument?: string;
}

export interface CompetenceInputDto {
  competenceId: string;
  niveauPossede: NiveauCompetence;
  nom?: string; // Pour affichage
}

export enum NiveauCompetence {
  Debutant = 0,
  Intermediaire = 1,
  Avance = 2,
  Expert = 3
}

export interface CandidatureDto {
  id: string;
  statut: string;
  messageMotivation: string;
  dateSoumission: Date;
  cvFilePath: string;
  lettreMotivation: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  statutCandidate: string;
  userInfo: UserInfoDto;
  offre: OffreDto;
}

export interface UserInfoDto {
  id: string;
  fullName: string;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  adresse: string;
  ville: string;
  pays: string;
  entreprise: string;
  poste: string;
  email: string;
  phone: string;
  photoUrl: string;
  
  experiences: CandidatureExperienceDto[];
  diplomes: CandidatureDiplomeDto[];
  competences: CompetenceInputDto[];
  certificats: CandidatureCertificatDto[];
}

export interface OffreDto {
   idOffreEmploi?: string;
      TitreOffre: string;
      descriptionOffre: string;
      specialite: string;
      datePublication?: string; // ISO string
    dateExpiration: string; // ISO string
      salaireMin?: number;
      salaireMax?: number;
      niveauExperienceRequis: string;
      typeContrat: TypeContratEnum;
      statut: StatutOffre;
      modeTravail: ModeTravail;
      avantages: string;
      estActif: boolean;
      idRecruteur: string;
      idFiliale: string;
      idDepartement: string;
      postes: Poste[];

      offreMissions: OffreMission[];
      offreLangues: OffreLangue[];

      offreCompetences: OffreCompetence[];
      diplomeIds: string[];
}

export interface StatutUpdateRequest {
  statut: string;
}

interface CandidatureForm {
  messageMotivation?: string;
  cvFilePath?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  statutCandidate?: string;
  statut?: string;
  experiences?: any[];
  diplomes?: any[];
  certificats?: any[];
  competences?: any[];
}