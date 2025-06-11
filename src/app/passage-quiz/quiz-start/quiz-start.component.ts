// import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { QuizService } from './quiz.service';

// @Component({
//   selector: 'app-quiz-start',
//   template: `
//     <div *ngIf="loading">Chargement du quiz...</div>
//     <div *ngIf="error" class="error">{{ error }}</div>
//   `
// })
// export class QuizStartComponent {
//   loading = true;
//   error: string | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private quizService: QuizService
//   ) {
//     this.startQuiz();
//   }

//   startQuiz() {
//     const token = this.route.snapshot.queryParamMap.get('token');
//     const tentativeId = this.route.snapshot.paramMap.get('tentativeId');

//     if (!token || !tentativeId) {
//       this.error = 'Paramètres manquants dans l\'URL';
//       this.loading = false;
//       return;
//     }

//     this.quizService.demarrerQuiz(tentativeId, token).subscribe({
//       next: (quiz) => {
//         // Redirection vers le composant de quiz
//         this.router.navigate(['/quiz/run', tentativeId], { state: { quiz } });
//       },
//       error: (err) => {
//         this.error = 'Échec du démarrage du quiz';
//         this.loading = false;
//       }
//     });
//   }
// }