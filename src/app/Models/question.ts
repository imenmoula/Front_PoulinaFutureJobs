// import { Reponse } from "./reponse";
// import { TypeQuestion } from "./type-question";
// export interface Question {
//   questionId: string;
//   texte: string;
//   type: TypeQuestion;
//   points: number;
//   reponses: Reponse[];
// }

export enum TypeQuestion { ChoixUnique = 'ChoixUnique', ChoixMultiple = 'ChoixMultiple', VraiFaux = 'VraiFaux', ReponseTexte = 'ReponseTexte' }

export interface Question { questionId: string; texte: string; type: TypeQuestion; points: number; ordre: number; tempsRecommande?: number; quizId: string; }

export interface QuestionCreate { texte: string; type: TypeQuestion; points: number; ordre: number; tempsRecommande?: number; }

export interface QuestionUpdate { texte?: string; type?: TypeQuestion; points?: number; ordre?: number; tempsRecommande?: number; }