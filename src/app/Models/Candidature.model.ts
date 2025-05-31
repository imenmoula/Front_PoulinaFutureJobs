// import { OffreEmploi } from "./offre-emploi.model";

import { OffreEmploi } from "./offre-emploi.model";

// export interface Candidature {
//   idCandidature: string;
//   offreId: string;
//   offreTitre: string;
//   messageMotivation: string;
//   statut: string;
//   appUserId: string;
//   appUser: AppUser;
//   experiences: Experience[];
//   competences: Competence[];
//   dateSoumission: string;
//   offre?: OffreEmploi; // Added property to hold the related OffreEmploi object

// }

// export interface AppUser {
//   fullName: string;
//   nom: string;
//   prenom: string;
//   dateNaissance: string;
//   adresse: string;
//   ville: string;
//   pays: string;
//   phone: string;
//   niveauEtude: string;
//   diplome: string;
//   universite: string;
//   specialite: string;
//   cv: string;
//   linkedIn: string;
//   github: string;
//   portfolio: string;
//   statut: string;
// }

// export interface Experience {
//   poste: string;
//   nomEntreprise: string;
//   description: string;
//   competenceAcquise: string;
//   dateDebut: string;
//   dateFin: string;
//   certificats: Certificat[];
// }

// export interface Certificat {
//   nom: string;
//   dateObtention: string;
//   organisme: string;
//   description: string;
//   urlDocument: string;
// }

// export interface Competence {
//   competenceId: string;
//   competenceNom: string;
//   niveauPossede: string;
// }
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
  email: string;
  phone: string;
  photoUrl: string;
  experiences: CandidatureExperienceDto[];
  diplomes: CandidatureDiplomeDto[];
  competences: CompetenceInputDto[];
  certificats: CandidatureCertificatDto[];
}

export interface OffreDto {
  idOffreEmploi: string;
  specialite: string;
  typeContrat: string;
  statut: string;
}

export interface StatutUpdateRequest {
  statut: string;
}