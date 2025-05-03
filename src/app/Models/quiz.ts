


export interface Quiz { quizId: string; titre: string; description: string; dateCreation: string; estActif: boolean; duree: number; scoreMinimum: number; offreEmploiId?: string; }

export interface QuizCreate { titre: string; description: string; duree: number; scoreMinimum: number; offreEmploiId?: string; }

export interface QuizUpdate { titre?: string; description?: string; duree?: number; scoreMinimum?: number; offreEmploiId?: string; estActif?: boolean; }