// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { QuizService } from '../../shared/services/quiz.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TimeConverterPipe } from '../time-converter.pipe';
// import { QuizPourCandidatDto, QuestionPourCandidatDto, ReponseUtilisateurCreateDto, SoumettreQuizDto } from '../../Models/quiz.model';

// @Component({
//   selector: 'app-quiz-runner',
//   standalone: true,
//   imports: [CommonModule, FormsModule, TimeConverterPipe],
//   templateUrl: './quiz-runner.component.html',
//   styles: ``
// })
// export class QuizRunnerComponent implements OnInit, OnDestroy {
//   tentativeId: string | null = null;
//   token: string | null = null;
//   quiz: QuizPourCandidatDto | null = null;
//   questions: QuestionPourCandidatDto[] = [];
//   currentQuestionIndex = 0;
//   currentQuestion: QuestionPourCandidatDto | null = null;
//   textResponse: string = '';
//   selectedResponses = new Set<string>();
//   timer: any;
//   timeRemaining: number = 0;
//   questionStartTime: number = 0;

//   constructor(
//     private quizService: QuizService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.tentativeId = this.route.snapshot.paramMap.get('tentativeId');
//     this.token = this.route.snapshot.queryParamMap.get('token');

//     if (!this.tentativeId || !this.token) {
//       console.error('Tentative ID or token not provided.');
//       this.router.navigate(['/']);
//       return;
//     }

//     this.quizService.startQuizAttempt(this.tentativeId).subscribe({
//       next: (quizData: QuizPourCandidatDto) => {
//         this.quiz = quizData;
//         this.questions = quizData.questions || [];
//         if (this.questions.length > 0) {
//           this.currentQuestion = this.questions[this.currentQuestionIndex];
//           this.startTimer(quizData.duree * 60); // Convert minutes to seconds
//           this.questionStartTime = Date.now();
//         } else {
//           console.error('No questions found for this quiz.');
//           this.router.navigate(['/']);
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching quiz:', err);
//         this.router.navigate(['/']);
//       }
//     });
//   }

//   startTimer(seconds: number) {
//     this.timeRemaining = seconds;
//     this.timer = setInterval(() => {
//       this.timeRemaining--;
//       if (this.timeRemaining <= 0) {
//         this.submitQuiz();
//       }
//     }, 1000);
//   }

//   toggleSelection(responseId: string) {
//     if (!this.currentQuestion) return;

//     if (this.currentQuestion.type === 'ChoixUnique' || this.currentQuestion.type === 'VraiFaux') {
//       this.selectedResponses.clear();
//     }
//     if (this.selectedResponses.has(responseId)) {
//       this.selectedResponses.delete(responseId);
//     } else {
//       this.selectedResponses.add(responseId);
//     }
//   }

//   saveResponse() {
//     if (!this.tentativeId || !this.currentQuestion) {
//       console.error('Tentative ID or current question is missing.');
//       return;
//     }

//     const timeTaken = Math.round((Date.now() - this.questionStartTime) / 1000);
//     const responseData: ReponseUtilisateurCreateDto = {
//       tentativeId: this.tentativeId,
//       questionId: this.currentQuestion.questionId,
//       reponseIds: this.currentQuestion.type !== 'ReponseTexte' ? Array.from(this.selectedResponses) : [],
//       texteReponse: this.currentQuestion.type === 'ReponseTexte' ? this.textResponse : undefined,
//       tempsReponse: timeTaken
//     };

//     this.quizService.saveUserAnswer(responseData).subscribe({
//       next: () => {
//         this.loadNextQuestion();
//       },
//       error: (err) => {
//         console.error('Error saving response:', err);
//         alert('Failed to save response. Please try again.');
//       }
//     });
//   }

//   loadNextQuestion() {
//     this.currentQuestionIndex++;
//     if (this.currentQuestionIndex < this.questions.length) {
//       this.currentQuestion = this.questions[this.currentQuestionIndex];
//       this.textResponse = '';
//       this.selectedResponses.clear();
//       this.questionStartTime = Date.now();
//     } else {
//       this.submitQuiz();
//     }
//   }

//   submitQuiz() {
//     if (!this.tentativeId) {
//       console.error('Cannot submit quiz: tentativeId is null.');
//       this.router.navigate(['/']);
//       return;
//     }

//     clearInterval(this.timer);

//     this.quizService.submitQuizAttempt(this.tentativeId).subscribe({
//       next: (result: any) => {
//         this.router.navigate([`/quizzes/results/${result.resultatId}`]);
//       },
//       error: (err) => {
//         console.error('Error submitting quiz:', err);
//         alert('Failed to submit quiz. Please try again.');
//       }
//     });
//   }
// isResponseValid(): boolean {
//   if (!this.currentQuestion) return false;
//   if (this.currentQuestion.type === 'ReponseTexte') {
//     return this.textResponse.trim().length > 0;
//   }
//   return this.selectedResponses.size > 0;
// }

//   ngOnDestroy() {
//     if (this.timer) {
//       clearInterval(this.timer);
//     }
//   }
// }
