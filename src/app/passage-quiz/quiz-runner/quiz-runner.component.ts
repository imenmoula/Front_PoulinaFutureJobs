// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { QuizService } from '../../shared/services/quiz.service';

// @Component({
//   selector: 'app-quiz-runner',
//   imports: [],
//   templateUrl: './quiz-runner.component.html',
//   styles: ``
// })
// export class QuizRunnerComponent implements OnInit, OnDestroy {
//   currentQuestion: any;
//   textResponse = '';
//   selectedResponses = new Set<string>();
//   timer: any;
//   timeRemaining = 0;

//   constructor(private quizService: QuizService) {}

//   ngOnInit() {
//     // Initialisation du quiz
//     const quizData = history.state.quiz;
//     if (quizData) {
//       this.currentQuestion = quizData.questions[0];
//       this.startTimer(quizData.duree * 60);
//     }
//   }

//   startTimer(seconds: number) {
//     this.timeRemaining = seconds;
//     this.timer = setInterval(() => {
//       this.timeRemaining--;
//       if (this.timeRemaining <= 0) this.submitQuiz();
//     }, 1000);
//   }

//   toggleSelection(responseId: string) {
//     if (this.selectedResponses.has(responseId)) {
//       this.selectedResponses.delete(responseId);
//     } else {
//       this.selectedResponses.add(responseId);
//     }
//   }

//   saveResponse() {
//     const responseData = {
//       questionId: this.currentQuestion.questionId,
//       reponseIds: Array.from(this.selectedResponses),
//       texteReponse: this.textResponse
//     };
//     this.quizService.saveLocalResponse(responseData);
//     this.loadNextQuestion();
//   }

//   ngOnDestroy() {
//     clearInterval(this.timer);
//   }
// }