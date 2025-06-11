// import { ResultatService } from './../../shared/services/resultat.service';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { QuizService } from '../../shared/services/quiz.service';


// @Component({
//   selector: 'app-quiz-result',
//   templateUrl: './quiz-result.component.html'
// })
// export class QuizResultComponent implements OnInit {
//   resultat: any;

//   constructor(
//     private route: ActivatedRoute,
//     private quizService: QuizService,
//     private ResultatService: ResultatService
//   ) {}

//   ngOnInit() {
//     const tentativeId = this.route.snapshot.paramMap.get('tentativeId');
//     this.ResultatService.getResultatById(tentativeId).subscribe(result => {
//       this.resultat = result;
//     });
//   }
// }