export interface QuizPourCandidat {
  quizId: string;
  titre: string;
  description: string;
  duree: number;
  questions: QuestionPourCandidat[];
}

export interface QuestionPourCandidat {
  questionId: string;
  texte: string;
  type: TypeQuestion;
  points: number;
  ordre: number;
  tempsRecommande?: number;
  reponses: ReponsePourCandidat[];
}

export interface ReponsePourCandidat {
  reponseId: string;
  texte: string;
  ordre: number;
  explication?: string;
}

export enum TypeQuestion {
  ReponseTexte = 'ReponseTexte',
  ChoixUnique = 'ChoixUnique',
  ChoixMultiple = 'ChoixMultiple',
  VraiFaux = 'VraiFaux'
}

export interface SoumettreQuizDto {
  tentativeId: string;
  reponses: ReponseCandidatDto[];
}

export interface ReponseCandidatDto {
  questionId: string;
  reponseIds?: string[];
  texteReponse?: string;
  tempsReponse: number;
}

export interface ResultatQuiz {
  resultatId: string;
  tentativeId: string;
  score: number;
  questionsCorrectes: number;
  nombreQuestions: number;
  tempsTotal: number;
  reussi: boolean;
  dateResultat: string;
}