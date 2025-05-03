export interface ResultatQuiz {
    resultatId: string;
    tentativeId: string;
    score: number;
    questionsCorrectes: number;
    nombreQuestions: number;
    reussi: boolean;
    appUserId: string; // Ajout pour refléter le modèle C#
  }
  