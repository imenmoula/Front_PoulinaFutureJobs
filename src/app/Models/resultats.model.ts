// src/app/Models/resultats.dto.ts
export interface ResultatQuizResponse {
  ResultatId: string;
  TentativeId: string;
  Score: number;
  QuestionsCorrectes: number;
  NombreQuestions: number;
  TempsTotal: number; // secondes
  Reussi: boolean;
  DateResultat: string; // ISO date string
}

export interface ReponseDetailResponseDto {
  QuestionId: string;
  QuestionTexte: string;
  QuestionType: number; // ou enum
  EstCorrecte: boolean;
  TempsReponse: number; // secondes
  TexteReponse?: string;
  ReponseId?: string;
  ReponseTexte?: string;
  Explication?: string;
}

export interface ResultatDetailResponseDto {
  ResultatId: string;
  TentativeId: string;
  QuizId: string;
  QuizTitre: string;
  Score: number;
  QuestionsCorrectes: number;
  NombreQuestions: number;
  TempsTotal: number; // secondes
  Reussi: boolean;
  DateResultat: string;
  ReponsesDetail: ReponseDetailResponseDto[];
}