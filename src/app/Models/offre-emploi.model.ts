import { Langue, ModeTravail, NiveauRequisType, StatutOffre, TypeContratEnum } from './enums.model';
import { Filiale } from './filiale.model';
import { OffreCompetence } from './offre-competence.model';



export interface OffreEmploi {
  idOffreEmploi?: string;
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
  filiale?: Filiale;
  idDepartement: string;
  departement?: string;
  postes: Poste[];
  offreMissions: OffreMission[];
  offreLangues: OffreLangue[];
  offreCompetences: OffreCompetence[];
  diplomeIds: string[];
  diplomes?: Diplome[];
}

export interface Poste {
  idPoste?: string;
  titrePoste: string;
  description: string;
  nombrePostes: number;
  experienceSouhaitee?: string;
  niveauHierarchique: string;
  idOffreEmploi?: string;
}

export interface OffreMission {
  idOffreMission?: string;
  idOffreEmploi?: string;
  descriptionMission: string;
  priorite?: number;
}

export interface OffreLangue {
  idOffreLangue?: string;
  idOffreEmploi?: string;
  langue: Langue;
  niveauRequis: NiveauRequisType;
}





export interface Diplome {
  idDiplome: string;
  nomDiplome: string;
  niveau: string;
  domaine: string;
  institution?: string;
}

export interface CreateOffreEmploiRequest {
  dto: {
    specialite: string;
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
  };
}


export interface PosteCreateDto {
  idOffreEmploi: string;
  titrePoste: string;
  description: string;
  nombrePostes: number;
  experienceSouhaitee: string;
  niveauHierarchique: string;
}

export interface PosteUpdateDto extends PosteCreateDto {
  idPoste: string;
}