
// import { Component } from '@angular/core';
// import { QuizService } from '../../shared/services/quiz.service';

// @Component({
//   selector: 'app-quiz-submit',
//   imports: [],
//   template: `
//     <button (click)="submitQuiz()">Soumettre le quiz</button>
//   `
// })
// export class QuizSubmitComponent {
//   constructor(private quizService: QuizService) {}

//   submitQuiz() {
//     const responses = this.quizService.getLocalResponses();
//     const tentativeId = /* Récupérer l'ID de la tentative */;
    
//     const submission = {
//       tentativeId,
//       reponses: responses.map((res: any) => ({
//         questionId: res.questionId,
//         reponseIds: res.reponseIds,
//         texteReponse: res.texteReponse,
//         tempsReponse: this.calculateResponseTime(res.questionId)
//       }))
//     };

//     this.quizService.soumettreQuiz(submission).subscribe({
//       next: (result) => this.router.navigate(['/result', tentativeId]),
//       error: (err) => alert('Erreur lors de la soumission')
//     });
//   }
// }