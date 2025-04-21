export interface CandidatureForm {
  offreId: string;
  appUserId: string;
  messageMotivation: string;
  statut?: string;
  cv: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  experiences: {
    poste: string;
    nomEntreprise: string;
    description: string;
    competenceAcquise: string;
    dateDebut: string;
    dateFin?: string;
    certificats: {
      nom: string;
      dateObtention: string;
      organisme: string;
      description: string;
      urlDocument: string;
    }[];
  }[];
  competences: {
    competenceId: string;
    niveauPossede: string;
  }[];
}