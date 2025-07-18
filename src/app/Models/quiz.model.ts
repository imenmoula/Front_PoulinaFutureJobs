import { StatutTentative } from "./enums.model";

export interface Quiz {
  quizId: string;
  titre: string;
  description?: string;
  dateCreation: Date;
  estActif: boolean;
  duree: number;
  scoreMinimum: number;
  offreEmploiId?: string;
}


export enum TypeQuestion {
  ChoixUnique = 0,
  ChoixMultiple = 1,
  VraiFaux = 2,
  ReponseTexte = 3
}

export interface Question {
  questionId: string;
  quizId: string;
  texte: string;
  type: TypeQuestion;
  points: number;
  ordre: number;
  tempsRecommande?: number;
}


export interface Reponse {
  reponseId: string;
  questionId: string;
  texte: string;
  estCorrecte: boolean;
  ordre: number;
  explication?: string;
}

export interface FullQuiz extends Quiz {
  questions: QuestionWithReponses[];
}

export interface QuestionWithReponses extends Question {
  reponses: Reponse[];
}
/*******************quiz dto */
export interface QuizCreateDto {
  titre: string;
  description?: string;
  duree: number;
  scoreMinimum: number;
  offreEmploiId?: string;
}

export interface FullQuizCreateDto extends QuizCreateDto {
  questions: QuestionCreateDto[];
}

export interface QuizUpdateDto {
  titre?: string;
  description?: string;
  estActif?: boolean;
  duree?: number;
  scoreMinimum?: number;
  offreEmploiId?: string;
}

/*******************question dto */
export interface QuestionCreateDto {
  Texte: string;
  Type: number; // ou enum
  Points: number;
  Ordre: number;
  TempsRecommande?: number;
  QuizId: string;
  Reponses?: ReponseCreateDto[];
}

export interface ReponseCreateDto {
  Texte: string;
  EstCorrecte: boolean;
  Ordre: number;
  Explication?: string;
  QuestionId?: string; // à remplir côté client si nécessaire
}

export interface QuestionUpdateDto {
  texte?: string;
  points?: number;
  ordre?: number;
  tempsRecommande?: number;
}

/******************************reponse dto */
export interface ReponseCreateDto {
  texte: string;
  estCorrecte: boolean;
  ordre: number;
  explication?: string;
  questionId: string;
}

export interface ReponseUpdateDto {
  texte?: string;
  estCorrecte?: boolean;
  ordre?: number;
  explication?: string;
}
/******************************reponse dto */



export interface QuizResponse {
  quizId: string;
  titre: string;
  description?: string;
  dateCreation: Date;
  estActif: boolean;
  duree: number;
  scoreMinimum: number;
  offreEmploiId?: string;
   specialiteOffre?: string; // Ajouté
  nomPoste?: string; // Ajouté
}

export interface FullQuizResponse extends QuizResponse {
  questions: QuestionResponse[];
}

export interface QuestionResponse {
  questionId: string;
  texte: string;
  type: TypeQuestion;
  points: number;
  ordre: number;
  tempsRecommande?: number;
  quizId: string;
  reponses: ReponseResponse[];
}

export interface ReponseResponse {
  reponseId: string;
  texte: string;
  estCorrecte: boolean;
  ordre: number;
  explication?: string;
  questionId: string;
}

export interface ConvocationQuizDto {
  candidatureId: string;
  quizId: string;
  baseUrl: string;
}

export interface SoumettreQuizDto {
  tentativeId: string;
  reponses: ReponseUtilisateurDto[];
}

export interface ReponseUtilisateurDto {
  questionId: string;
  reponseIds?: string[];
  texteReponse?: string;
  tempsReponse: number;
}

export interface ResultatQuizResponse {
  resultatId: string;
  tentativeId: string;
  score: number;
  questionsCorrectes: number;
  nombreQuestions: number;
  tempsTotal: number;
  reussi: boolean;
  dateResultat: Date;
}

export interface ResultatDetailResponse extends ResultatQuizResponse {
  quizId: string;
  quizTitre: string;
  reponsesDetail: ReponseDetailResponse[];
}

export interface ReponseDetailResponse {
  questionId: string;
  questionTexte: string;
  questionType: TypeQuestion;
  estCorrecte: boolean;
  tempsReponse?: number;
  texteReponse?: string;
  reponseId?: string;
  reponseTexte?: string;
  explication?: string;
}



export interface TentativeQuiz {
  tentativeId: string;
  quizId: string;
  appUserId: string;
  candidatureId?: string;
  dateDebut: Date;
  dateFin?: Date;
  statut: StatutTentative;
  score?: number;
}
export interface ReponseUtilisateur {
  reponseUtilisateurId: string;
  tentativeId: string;
  questionId: string;
  reponseId?: string;
  texteReponse?: string;
  tempsReponse: number;
  estCorrecte: boolean;
}
export interface ResultatQuiz {
  resultatId: string;
  tentativeId: string;
  score: number;
  questionsCorrectes: number;
  nombreQuestions: number;
  tempsTotal: number;
  reussi: boolean;
  commentaire?: string;
  dateResultat: Date;
  quizId: string;
  appUserId: string;
}
/************** tentative dto */
export interface StartTentativeDto {
  quizId: string;
  candidatureId?: string;
}

export interface SubmitTentativeDto {
  reponses: ReponseUtilisateurDto[];
}

export interface ReponseUtilisateurDto {
  questionId: string;
  reponseIds?: string[];
  texteReponse?: string;
  tempsReponse: number;
}
/*********************** resultat dto */
export interface CommentaireDto {
  commentaire: string;
}
export interface QuizResponseDto {
  quizId: string;
  titre: string;
  description?: string;
  dateCreation: Date;
  estActif: boolean;
  duree: number;
  scoreMinimum: number;
  offreEmploiId?: string;
}

export interface FullQuizResponseDto extends QuizResponseDto {
  questions: QuestionResponseDto[];
}
export interface QuestionResponseDto {
  questionId: string;
  texte: string;
  type: TypeQuestion;
  points: number;
  ordre: number;
  tempsRecommande?: number;
  quizId: string;
  reponses: ReponseResponseDto[];
}
export interface ReponseResponseDto {
  reponseId: string;
  texte: string;
  estCorrecte: boolean;
  ordre: number;
  explication?: string;
  questionId: string;
}
export interface TentativeQuizResponseDto {
  tentativeId: string;
  quizId: string;
  appUserId: string;
  candidatureId?: string;
  dateDebut: Date;
  dateFin?: Date;
  statut: StatutTentative;
  score?: number;
  quizTitre: string;
  quizDuree: number;
}

export interface TentativeQuizDetailDto extends TentativeQuizResponseDto {
  quizDescription?: string;
  quizScoreMinimum: number;
  reponsesUtilisateur: ReponseUtilisateurDetailDto[];
  resultat?: ResultatQuizDto;
}

export interface ReponseUtilisateurDetailDto {
  reponseUtilisateurId: string;
  questionId: string;
  questionTexte: string;
  questionType: TypeQuestion;
  questionPoints: number;
  reponseId?: string;
  reponseTexte?: string;
  texteReponse?: string;
  tempsReponse: number;
  estCorrecte: boolean;
}
export interface ResultatQuizDto {
  resultatId: string;
  tentativeId: string;
  score: number;
  questionsCorrectes: number;
  nombreQuestions: number;
  tempsTotal: number;
  reussi: boolean;
  commentaire?: string;
  dateResultat: Date;
  quizId?: string;
  quizTitre?: string;
  appUserId?: string;
  appUserNom?: string;
  appUserPrenom?: string;
  appUserEmail?: string;
}

export interface ResultatQuizDetailDto extends ResultatQuizDto {
  quizDescription?: string;
  quizScoreMinimum: number;
  reponsesUtilisateur: ReponseUtilisateurDetailDto[];
}

export interface ReponseUtilisateurCreateDto {
    tentativeId: string;
    questionId: string;
    reponseIds?: string[]; // Pour ChoixMultiple, ou un seul ID pour ChoixUnique/VraiFaux
    texteReponse?: string; // Pour ReponseTexte
    tempsReponse?: number; // Temps pris pour répondre (en secondes, optionnel)
}

export interface QuizFullResponseDto extends QuizResponseDto {
    questions: QuestionResponseDto[];
}


export interface TentativeStatusDto {
  statut: StatutTentative;
  tempsRestant?: number; // en secondes
}
export interface QuizPourCandidatDto {
  quizId: string;
  titre: string;
  description: string;
  duree: number;
  questions: QuestionPourCandidatDto[];
}

export interface QuestionPourCandidatDto {
  questionId: string;
  texte: string;
  type: string;
  points: number;
  ordre: number;
  tempsRecommande: number;
  reponses: ReponsePourCandidatDto[];
}

export interface ReponsePourCandidatDto {
  reponseId: string;
  texte: string;
  ordre: number;
  explication: string | null;
}

