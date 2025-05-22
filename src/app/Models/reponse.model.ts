// src/app/Models/reponse.dto.ts
export interface ReponseCreateDto {
  Texte: string;
  EstCorrecte: boolean;
  Ordre: number;
  Explication?: string;
  QuestionId?: string;
}

export interface ReponseUpdateDto {
  Texte?: string;
  EstCorrecte?: boolean;
  Ordre?: number;
  Explication?: string;
}

export interface ReponseResponseDto {
  ReponseId: string;
  Texte: string;
  EstCorrecte: boolean;
  Ordre: number;
  Explication?: string;
  QuestionId: string;
}