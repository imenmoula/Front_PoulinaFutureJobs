import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuizService } from '../shared/services/quiz.service';
import { OffreEmploiService } from '../shared/services/offre-emploi.service';
import { TypeQuestion } from '../Models/quiz.model';
import { OffreEmploi } from '../Models/offre-emploi.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../layoutBackend/header/header.component';
import { SidebarComponent } from '../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-quiz-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule,RouterModule,FooterComponent,HeaderComponent,SidebarComponent],
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.css']
})
export class QuizFormComponent implements OnInit {
  quizForm: FormGroup;
  isEditMode = false;
  quizId: string | null = null;
  typeQuestions = Object.values(TypeQuestion).filter(value => typeof value === 'number');
  offres: OffreEmploi[] = [];
  loadingOffres = true;
  selectedOffre: OffreEmploi | null = null;
  public reponseTexteType = TypeQuestion.ReponseTexte;
  public vraiFauxType = TypeQuestion.VraiFaux;
  sidebarOpen = false;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private offreService: OffreEmploiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      duree: [30, [Validators.required, Validators.min(5)]],
      scoreMinimum: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      offreEmploiId: [null],
      estActif: [true],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadOffres();
    this.quizId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.quizId;

    if (this.isEditMode && this.quizId) {
      this.loadQuiz(this.quizId);
    } else {
      this.addQuestion();
    }

    this.quizForm.get('offreEmploiId')?.valueChanges.subscribe(offreId => {
      this.updateSelectedOffre(offreId);
    });
  }

  loadOffres(): void {
    this.loadingOffres = true;
    this.offreService.getAll().subscribe({
      next: (offres) => {
        this.offres = offres;
        this.loadingOffres = false;
      },
      error: (err) => {
        console.error('Failed to load offres', err);
        this.loadingOffres = false;
        Swal.fire('Erreur', 'Impossible de charger les offres', 'error');
      }
    });
  }

  updateSelectedOffre(offreId: string | null): void {
    if (!offreId) {
      this.selectedOffre = null;
      return;
    }
    this.offreService.getById(offreId).subscribe(offre => {
      this.selectedOffre = offre;
    });
  }

  loadQuiz(id: string): void {
    this.quizService.getFullQuizById(id).subscribe({
      next: (quiz) => {
        if (!quiz) {
          Swal.fire('Erreur', 'Quiz non trouvé', 'error');
          this.router.navigate(['/quizzes']);
          return;
        }

        this.quizForm.patchValue({
          titre: quiz.titre,
          description: quiz.description,
          duree: quiz.duree,
          scoreMinimum: quiz.scoreMinimum,
          offreEmploiId: quiz.offreEmploiId,
          estActif: quiz.estActif
        });

        while (this.questions.length) {
          this.questions.removeAt(0);
        }

        quiz.questions.forEach(question => {
          const questionGroup = this.fb.group({
            texte: [question.texte, Validators.required],
            type: [question.type, Validators.required],
            points: [question.points, [Validators.required, Validators.min(1)]],
            ordre: [question.ordre, Validators.required],
            tempsRecommande: [question.tempsRecommande],
            reponses: this.fb.array([])
          });

          const reponses = questionGroup.get('reponses') as FormArray;
          question.reponses.forEach(reponse => {
            reponses.push(this.fb.group({
              texte: [reponse.texte, Validators.required],
              estCorrecte: [reponse.estCorrecte],
              ordre: [reponse.ordre, Validators.required],
              explication: [reponse.explication]
            }));
          });

          this.questions.push(questionGroup);
        });
      },
      error: (err) => {
        Swal.fire('Erreur', 'Impossible de charger le quiz', 'error');
        this.router.navigate(['/quizzes']);
      }
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getReponses(question: AbstractControl): FormArray {
    return question.get('reponses') as FormArray;
  }

  addQuestion(): void {
    const questionGroup = this.fb.group({
      texte: ['', Validators.required],
      type: [TypeQuestion.ChoixUnique, Validators.required],
      points: [1, [Validators.required, Validators.min(1)]],
      ordre: [this.questions.length + 1, Validators.required],
      tempsRecommande: [30],
      reponses: this.fb.array([])
    });

    this.questions.push(questionGroup);
    this.addReponse(this.questions.length - 1);
  }

  removeQuestion(index: number): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Voulez-vous vraiment supprimer cette question ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.questions.removeAt(index);
        this.updateQuestionOrders();
      }
    });
  }

  addReponse(questionIndex: number): void {
    const question = this.questions.at(questionIndex) as FormGroup;
    const reponses = question.get('reponses') as FormArray;
    const type = question.get('type')?.value;

    if (type === TypeQuestion.VraiFaux && reponses.length >= 2) {
      Swal.fire('Info', 'Une question Vrai/Faux ne peut avoir que deux réponses', 'info');
      return;
    }

    reponses.push(this.fb.group({
      texte: ['', Validators.required],
      estCorrecte: [false],
      ordre: [reponses.length + 1, Validators.required],
      explication: ['']
    }));
  }

  removeReponse(questionIndex: number, reponseIndex: number): void {
    const question = this.questions.at(questionIndex) as FormGroup;
    const type = question.get('type')?.value;
    const reponses = question.get('reponses') as FormArray;

    if (type === TypeQuestion.VraiFaux && reponses.length <= 2) {
      Swal.fire('Info', 'Une question Vrai/Faux doit avoir exactement deux réponses', 'info');
      return;
    }

    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Voulez-vous vraiment supprimer cette réponse ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        reponses.removeAt(reponseIndex);
        this.updateReponseOrders(questionIndex);
      }
    });
  }

  updateQuestionOrders(): void {
    this.questions.controls.forEach((question, index) => {
      question.patchValue({ ordre: index + 1 });
    });
  }

  updateReponseOrders(questionIndex: number): void {
    const question = this.questions.at(questionIndex) as FormGroup;
    const reponses = question.get('reponses') as FormArray;
    reponses.controls.forEach((reponse, index) => {
      reponse.patchValue({ ordre: index + 1 });
    });
  }

  onQuestionTypeChange(questionIndex: number): void {
    const question = this.questions.at(questionIndex) as FormGroup;
    const type = question.get('type')?.value;
    const reponses = question.get('reponses') as FormArray;

    while (reponses.length) {
      reponses.removeAt(0);
    }

    if (type === TypeQuestion.VraiFaux) {
      reponses.push(this.fb.group({
        texte: ['Vrai', Validators.required],
        estCorrecte: [false],
        ordre: [1, Validators.required],
        explication: ['']
      }));
      reponses.push(this.fb.group({
        texte: ['Faux', Validators.required],
        estCorrecte: [false],
        ordre: [2, Validators.required],
        explication: ['']
      }));
    } else if (type !== TypeQuestion.ReponseTexte) {
      this.addReponse(questionIndex);
    }
  }

  getTypeQuestionLabel(type: TypeQuestion): string {
    switch (type) {
      case TypeQuestion.ChoixUnique: return 'Choix unique';
      case TypeQuestion.ChoixMultiple: return 'Choix multiple';
      case TypeQuestion.VraiFaux: return 'Vrai/Faux';
      case TypeQuestion.ReponseTexte: return 'Réponse texte';
      default: return 'Inconnu';
    }
  }

  validateForm(): boolean {
    if (this.quizForm.invalid) {
      this.markFormGroupTouched(this.quizForm);
      return false;
    }

    // Validation supplémentaire pour les questions
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions.at(i) as FormGroup;
      const type = question.get('type')?.value;
      const reponses = question.get('reponses') as FormArray;

      if (type !== TypeQuestion.ReponseTexte && reponses.length === 0) {
        Swal.fire('Erreur', `La question ${i + 1} doit avoir au moins une réponse`, 'error');
        return false;
      }

      if (type === TypeQuestion.VraiFaux && reponses.length !== 2) {
        Swal.fire('Erreur', `La question ${i + 1} (Vrai/Faux) doit avoir exactement deux réponses`, 'error');
        return false;
      }

      if ((type === TypeQuestion.ChoixUnique || type === TypeQuestion.ChoixMultiple || type === TypeQuestion.VraiFaux) &&
          !reponses.controls.some(ctrl => ctrl.get('estCorrecte')?.value)) {
        Swal.fire('Erreur', `La question ${i + 1} doit avoir au moins une réponse correcte`, 'error');
        return false;
      }
    }

    return true;
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const quizData = this.quizForm.value;
    const operation = (this.isEditMode && this.quizId)
      ? this.quizService.updateFullQuiz(this.quizId, quizData)
      : this.quizService.createFullQuiz(quizData);

    (operation as import('rxjs').Observable<any>).subscribe({
      next: (success) => {
        if (success) {
          Swal.fire({
            title: 'Succès',
            text: `Quiz ${this.isEditMode ? 'mis à jour' : 'créé'} avec succès`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/quizzes']);
          });
        } else {
          Swal.fire('Erreur', `Une erreur est survenue lors de ${this.isEditMode ? 'la mise à jour' : 'la création'} du quiz`, 'error');
        }
      },
      error: (err) => {
        console.error('Error saving quiz', err);
        Swal.fire('Erreur', `Une erreur est survenue lors de ${this.isEditMode ? 'la mise à jour' : 'la création'} du quiz`, 'error');
      }
    });
  }
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}