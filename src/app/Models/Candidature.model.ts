import { OffreEmploi } from "./offre-emploi.model";

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
  offre?: OffreEmploi; // Added property to hold the related OffreEmploi object

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