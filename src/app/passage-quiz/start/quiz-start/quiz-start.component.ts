// import { Component } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { QuizService } from '../../../shared/services/quiz.service';

// @Component({
//   selector: 'app-quiz-start',
//   templateUrl: './quiz-start.component.html'
// })
// export class QuizStartComponent {
//   tentativeId!: string;
//   token!: string;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private quizService: QuizService
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       this.tentativeId = params.get('tentativeId')!;
//       this.token = params.get('token')!;
//     });
//   }

//   startQuiz() {
//     this.quizService.startQuizAttempt(this.tentativeId, this.token).subscribe({
//       next: () => {
//         this.router.navigate(['/quiz/take', this.tentativeId]);
//       },
//       error: err => {
//         alert('Failed to start quiz: ' + err.error.message);
//       }
//     });
//   }
// }