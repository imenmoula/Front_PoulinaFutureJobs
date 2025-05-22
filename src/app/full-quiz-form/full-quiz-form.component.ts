// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { FullQuizCreateDto, FullQuizResponse, QuestionCreateDto, ReponseCreateDto } from '../Models/quiz.model';
// import { TypeQuestion } from '../Models/question';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-full-quiz-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './full-quiz-form.component.html',
// })
// export class FullQuizFormComponent implements OnInit {
//   @Input() quiz?: FullQuizResponse;
//   @Output() submitForm = new EventEmitter<FullQuizCreateDto>();
  
//   quizForm: FormGroup;
//   submitted = false;
//   error = '';
//   typeQuestions = [
//     { id: TypeQuestion.ChoixUnique, name: 'ChoixUnique ' },
//     { id: TypeQuestion.ChoixMultiple, name: 'ChoixMultiple ' },
//     { id: TypeQuestion.VraiFaux, name: 'VraiFaux ' },
//     { id: TypeQuestion.ReponseTexte, name: 'ReponseTexte ' }
//   ];
//   public vraiFauxId: any;

//   constructor(private fb: FormBuilder) {
//     this.quizForm = this.fb.group({
//       titre: ['', [Validators.required, Validators.maxLength(100)]],
//       description: ['', Validators.maxLength(500)],
//       duree: [30, [Validators.required, Validators.min(1), Validators.max(180)]],
//       scoreMinimum: [60, [Validators.required, Validators.min(0), Validators.max(100)]],
//       offreEmploiId: [null],
//       questions: this.fb.array([])
//     });

//     this.vraiFauxId = this.typeQuestions.find(t => t.name === 'VraiFaux ')?.id;
//   }

//   ngOnInit(): void {
//     if (this.quiz) {
//       this.quizForm.patchValue({
//         titre: this.quiz.titre,
//         description: this.quiz.description,
//         duree: this.quiz.duree,
//         scoreMinimum: this.quiz.scoreMinimum,
//         offreEmploiId: this.quiz.offreEmploiId
//       });

//       this.quiz.questions.forEach(q => {
//         this.addQuestion(q);
//       });
//     } else {
//       this.addQuestion();
//     }
//   }

//   get questions(): FormArray {
//     return this.quizForm.get('questions') as FormArray;
//   }

//   addQuestion(question?: QuestionCreateDto): void {
//     const questionForm = this.fb.group({
//       texte: [question?.Texte || '', [Validators.required, Validators.maxLength(500)]],
//       type: [question?.Type || TypeQuestion.ChoixUnique, Validators.required],
//       points: [question?.points || 1, [Validators.required, Validators.min(1), Validators.max(100)]],
//       ordre: [question?.ordre || this.questions.length + 1, Validators.required],
//       tempsRecommande: [question?.tempsRecommande || null],
//       reponses: this.fb.array([])
//     });

//     this.questions.push(questionForm);

//     if (question?.reponses?.length) {
//       question.reponses.forEach(r => {
//         this.addResponse(this.questions.length - 1, r);
//       });
//     } else {
//       const type = question?.Type || TypeQuestion.ChoixUnique;
//       this.addDefaultResponses(this.questions.length - 1, type as TypeQuestion);
//     }
//   }

//   removeQuestion(index: number): void {
//     if (this.questions.length > 1) {
//       this.questions.removeAt(index);
//       this.updateQuestionOrders();
//     } else {
//       this.error = 'Le quiz doit contenir au moins une question';
//     }
//   }

//   getResponses(questionIndex: number): FormArray {
//     return this.questions.at(questionIndex).get('reponses') as FormArray;
//   }

//   addResponse(questionIndex: number, response?: ReponseCreateDto): void {
//     const responseForm = this.fb.group({
//       texte: [response?.texte || '', [Validators.required, Validators.maxLength(500)]],
//       estCorrecte: [response?.estCorrecte || false, Validators.required],
//       ordre: [response?.ordre || this.getResponses(questionIndex).length + 1, Validators.required],
//       explication: [response?.explication || '', Validators.maxLength(500)]
//     });

//     this.getResponses(questionIndex).push(responseForm);
//   }

//   removeResponse(questionIndex: number, responseIndex: number): void {
//     const questionType = this.questions.at(questionIndex).get('type')?.value;
//     const responses = this.getResponses(questionIndex);

//     if (questionType === TypeQuestion.VraiFaux && responses.length <= 2) {
//       this.error = 'Les questions Vrai/Faux doivent avoir exactement deux réponses';
//       return;
//     }

//     if (responses.length > 1) {
//       responses.removeAt(responseIndex);
//       this.updateResponseOrders(questionIndex);
//     } else {
//       this.error = 'Chaque question doit avoir au moins une réponse';
//     }
//   }

//   onQuestionTypeChange(index: number, event: Event): void {
//     const type = Number((event.target as HTMLSelectElement).value) as unknown as TypeQuestion;
//     const questionIndex = index;
//     const responses = this.getResponses(questionIndex);

//     // Clear existing responses
//     while (responses.length > 0) {
//       responses.removeAt(0);
//     }

//     // Add default responses based on type
//     this.addDefaultResponses(questionIndex, type);
//   }

//   addDefaultResponses(questionIndex: number, type: TypeQuestion): void {
//     if (type === TypeQuestion.ReponseTexte) {
//       return; // No responses for text answer questions
//     }

//     switch (type) {
//       case TypeQuestion.ChoixUnique:
//         this.addResponse(questionIndex, { Texte: 'Option 1', EstCorrecte: true, Ordre: 1, explication: '', questionId: '' });
//         this.addResponse(questionIndex, { Texte: 'Option 2', EstCorrecte: false, Ordre: 2, explication: '', questionId: '' });
//         this.addResponse(questionIndex, { Texte: 'Option 3', EstCorrecte: false, Ordre: 3, explication: '', questionId: '' });
//         break;
//       case TypeQuestion.ChoixMultiple:
//         this.addResponse(questionIndex, { Texte: 'Option 1', EstCorrecte: true, Ordre: 1, explication: '', questionId: '' });
//         this.addResponse(questionIndex, { Texte: 'Option 2', EstCorrecte: true, Ordre: 2, explication: '', questionId: '' });
//         this.addResponse(questionIndex, { Texte: 'Option 3', EstCorrecte: false, Ordre: 3, explication: '', questionId: '' });
//         this.addResponse(questionIndex, { Texte: 'Option 4', EstCorrecte: false, Ordre: 4, explication: '', questionId: '' });
//         break;
//       case TypeQuestion.VraiFaux:
//         this.addResponse(questionIndex, { Texte: 'Vrai', EstCorrecte: true, Ordre: 1, explication: '', questionId: '' });
//         this.addResponse(questionIndex, { Texte: 'Faux', EstCorrecte: false, Ordre: 2, explication: '', questionId: '' });
//         break;
//     }
//   }

//   updateQuestionOrders(): void {
//     this.questions.controls.forEach((question, index) => {
//       question.get('ordre')?.setValue(index + 1);
//     });
//   }

//   updateResponseOrders(questionIndex: number): void {
//     this.getResponses(questionIndex).controls.forEach((response, index) => {
//       response.get('ordre')?.setValue(index + 1);
//     });
//   }

//   onSubmit(): void {
//     this.submitted = true;
//     this.error = '';

//     if (this.quizForm.invalid) {
//       this.error = 'Veuillez remplir tous les champs obligatoires';
//       return;
//     }

//     // Validate each question
//     for (let i = 0; i < this.questions.length; i++) {
//       const question = this.questions.at(i);
//       const type = question.get('type')?.value;
//       const responses = this.getResponses(i);

//       if (type === TypeQuestion.ReponseTexte) {
//         // Clear any responses for text answer questions
//         while (responses.length > 0) {
//           responses.removeAt(0);
//         }
//       } else {
//         // Validate non-text questions
//         if (responses.length === 0) {
//           this.error = `La question ${i + 1} doit avoir au moins une réponse`;
//           return;
//         }

//         const correctAnswers = responses.controls.filter(
//           control => control.get('estCorrecte')?.value === true
//         ).length;

//         if (correctAnswers === 0) {
//           this.error = `La question ${i + 1} doit avoir au moins une réponse correcte`;
//           return;
//         }

//         if (type === TypeQuestion.VraiFaux && responses.length !== 2) {
//           this.error = `La question ${i + 1} (Vrai/Faux) doit avoir exactement deux réponses`;
//           return;
//         }
//       }
//     }

//     this.submitForm.emit(this.quizForm.value);
//   }
// }