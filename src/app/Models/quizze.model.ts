// src/app/models/app-user.model.ts
export interface AppUser {
    appUserId: string;
    email?: string;
    nom?: string;
    prenom?: string;
  }
  
  // src/app/models/quiz.model.ts
  export interface QuizDto {
    quizId: string;
    titre: string;
    description: string;
    dateCreation: string;
    estActif: boolean;
    duree: number;
    scoreMinimum: number;
    offreEmploiId?: string;
  }
  
  export interface QuizFullDto {
    quizId: string;
    titre: string;
    description: string;
    dateCreation: string;
    estActif: boolean;
    duree: number;
    scoreMinimum: number;
    offreEmploiId?: string;
    questions: QuestionDto[];
  }
  
  export interface CreateFullQuizDto {
    titre: string;
    description: string;
    duree: number;
    scoreMinimum: number;
    offreEmploiId?: string;
    questions: CreateFullQuestionDto[];
  }
  
  // src/app/models/question.model.ts
  export enum TypeQuestion {
    ChoixUnique = 0,
    ChoixMultiple = 1,
    VraiFaux = 2,
    ReponseTexte = 3
  }
  
  export interface QuestionDto {
    questionId: string;
    texte: string;
    type: TypeQuestion;
    points: number;
    ordre: number;
    tempsRecommande?: number;
    quizId: string;
    reponses?: ReponseDto[];
  }
  
  export interface CreateFullQuestionDto {
    texte: string;
    type: TypeQuestion;
    points: number;
    ordre: number;
    tempsRecommande?: number;
    reponses?: ReponseCreateDto[];
  }
  
  // src/app/models/reponse.model.ts
  export interface ReponseDto {
    reponseId: string;
    texte: string;
    estCorrecte: boolean;
    ordre: number;
    explication: string;
    questionId: string;
  }
  
  export interface ReponseCreateDto {
    texte: string;
    estCorrecte: boolean;
    ordre: number;
    explication: string;
  }
  
  // src/app/models/tentative-quiz.model.ts
  export enum StatutTentative {
    EnCours = 0,
    Terminee = 1,
    Abandonnee = 2,
    Expiree = 3
  }
  
  export interface TentativeQuizDto {
    tentativeId: string;
    quizId: string;
    appUserId: string;
    statut: StatutTentative;
    dateDebut: string;
    dateFin?: string;
    score?: number;
  }
  
  export interface CreateTentativeQuizDto {
    quizId: string;
  }
  
  export interface SoumettreTentativeDto {
    reponses: ReponseSoumiseDto[];
  }
  
  export interface ReponseSoumiseDto {
    questionId: string;
    reponseId?: string;
    texteReponse?: string;
    tempsReponse: number;
  }
  
  // src/app/models/resultat-quiz.model.ts
  export interface ResultatQuizDto {
    resultatId: string;
    tentativeId: string;
    appUserId: string;
    quizId: string;
    score: number;
    dateResultat: string;
    aReussi: boolean;
  }