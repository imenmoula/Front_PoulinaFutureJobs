// export interface Reponse {
//     reponseId: string;
//     texte: string;
//     estCorrecte: boolean;
//   }
export interface Reponse { reponseId: string; texte: string; estCorrecte: boolean; ordre: number; explication: string; questionId: string; }

export interface ReponseCreate { texte: string; estCorrecte: boolean; ordre: number; explication: string; }

export interface ReponseUpdate { texte?: string; estCorrecte?: boolean; ordre?: number; explication?: string; }