// models/candidature.model.ts
export interface Certificat {
    nom: string;
    dateObtention: Date;
    organisme: string;
    description: string;
    urlDocument: string;
  }
  
  export interface Experience {
    poste: string;
    nomEntreprise: string;
    description: string;
    competenceAcquise: string;
    dateDebut: Date;
    dateFin: Date;
    certificats: Certificat[];
  }
  
  export interface Competence {
    competenceNom: string;
    niveauPossede: string;
  }
  
  export interface Candidature {
    idCandidature?: string;
    offreId: string;
    messageMotivation: string;
    statut?: string;
    appUserId: string;
    
    // Informations utilisateur
    fullName?: string;
    nom?: string;
    prenom?: string;
    photo?: string;
    dateNaissance?: Date;
    adresse?: string;
    ville?: string;
    pays?: string;
    phone?: string;
    entreprise?: string;
    poste?: string;
    userStatut?: string;
    
    // Informations de candidature obligatoires
    cv: string;
    linkedIn: string;
    github: string;
    portfolio: string;
    niveauEtude: string;
    diplome: string;
    universite: string;
    specialite: string;
    
    experiences: Experience[];
    competences: Competence[];
  }