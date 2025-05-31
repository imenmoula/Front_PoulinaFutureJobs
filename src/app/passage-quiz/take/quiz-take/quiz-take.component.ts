// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { QuizService } from '../services/quiz.service';
// import { QuizPourCandidatDto, SoumettreQuizDto, ReponseSoumiseDto } from '../models';

// @Component({
//   selector: 'app-quiz-take',
//   templateUrl: './quiz-take.component.html'
// })
// export class QuizTakeComponent implements OnInit {
//   quiz!: QuizPourCandidatDto;
//   submitted = false;
//   answers: Map<string, any> = new Map();

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private quizService: QuizService
//   ) {}

//   ngOnInit(): void {
//     const tentativeId = this.route.snapshot.paramMap.get('tentativeId');
//     if (tentativeId) {
//       this.quizService.getQuizForCandidate(tentativeId).subscribe(data => {
//         this.quiz = data;
//       });
//     }
//   }

//   onAnswerChange(questionId: string, value: any) {
//     this.answers.set(questionId, value);
//   }

//   submitQuiz() {
//     const reponses: ReponseSoumiseDto[] = this.quiz.Questions.map(q => {
//       const answer = this.answers.get(q.QuestionId.toString());
//       let reponseIds: string[] | null = null;
//       let texteReponse: string | null = null;

//       if (q.Type === 'ReponseTexte' && answer !== undefined) {
//         texteReponse = answer;
//       } else if (Array.isArray(answer)) {
//         reponseIds = answer.map((id: any) => id.toString());
//       } else if (answer !== undefined) {
//         reponseIds = [answer.toString()];
//       }

//       return {
//         QuestionId: q.QuestionId,
//         ReponseIds: reponseIds,
//         TexteReponse: texteReponse,
//         TempsReponse: 0 // You can track actual time spent per question
//       };
//     });

//     const dto: SoumettreQuizDto = {
//       TentativeId: this.quiz.QuizId, // Adjust according to your model
//       Reponses: reponses
//     };

//     this.quizService.submitQuiz(dto).subscribe({
//       next: result => {
//         this.submitted = true;
//         this.router.navigate(['/quiz/result', dto.TentativeId]);
//       },
//       error: err => {
//         alert('Error submitting quiz: ' + err.error.message);
//       }
//     });
//   }
// }