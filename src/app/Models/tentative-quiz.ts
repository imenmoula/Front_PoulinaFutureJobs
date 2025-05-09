import { ResultatQuiz } from "./resultat-quiz";

export interface TentativeQuiz {
  tentativeId: string;
  quizId: string;
  appUserId: string;
  dateDebut: string;
  dateFin?: string;
  statut: number;
  score: number;
  resultat?: ResultatQuiz;
}
