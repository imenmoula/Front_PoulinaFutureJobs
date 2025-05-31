// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { ResultatDetailResponseDto } from '../../../Models/resultats.model';
// import { QuizService } from '../../../shared/services/quiz.service';

// @Component({
//   selector: 'app-quiz-result',
//   templateUrl: './quiz-result.component.html'
// })
// export class QuizResultComponent implements OnInit {
//   result!: ResultatDetailResponseDto;

//   constructor(
//     private route: ActivatedRoute,
//     private quizService: QuizService
//   ) {}

//   ngOnInit(): void {
//     const tentativeId = this.route.snapshot.paramMap.get('tentativeId');
//     if (tentativeId) {
//       this.quizService.getResultat(tentativeId).subscribe(data => {
//         this.result = data;
//       });
//     }
//   }
// }