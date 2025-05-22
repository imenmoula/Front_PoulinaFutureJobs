import { ReponseResponseDto } from "./quiz.model";
import { ReponseCreateDto } from "./reponse.model";

// src/app/Models/question.dto.ts
export enum TypeQuestion {
  ReponseTexte = 0,
  ChoixUnique = 1,
  ChoixMultiple = 2,
  VraiFaux = 3,
}

export interface QuestionCreateDto {
  Texte: string;
  Type: number; // ou TypeQuestion
  Points: number;
  Ordre: number;
  TempsRecommande?: number; // secondes
  QuizId: string;
  Reponses?: ReponseCreateDto[];
}

export interface QuestionUpdateDto {
  Texte?: string;
  Points?: number;
  Ordre?: number;
  TempsRecommande?: number;
}

export interface QuestionResponseDto {
  QuestionId: string;
  Texte: string;
  Type: number; // ou TypeQuestion
  Points: number;
  Ordre: number;
  TempsRecommande?: number;
  QuizId: string;
  Reponses?: ReponseResponseDto[];
}