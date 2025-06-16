import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../shared/services/quiz.service';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-quiz-submit',
  templateUrl: './quiz-submit.component.html',
  styleUrls: ['./quiz-submit.component.css']
})
export class QuizSubmitComponent implements OnInit {
  tentativeId: string | null = null;
  quizId: string | null = null;
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.tentativeId = this.route.snapshot.paramMap.get('tentativeId');
    this.quizId = this.localStorageService.get('quizId');
    this.token = this.localStorageService.get('quizToken');
    if (!this.tentativeId || !this.quizId || !this.token) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Informations de quiz manquantes. Veuillez recommencer.'
      }).then(() => {
        this.router.navigate(['/']);
      });
    }
  }

  confirmSubmit() {
  if (this.tentativeId && this.quizId && this.token) {
    Swal.fire({
      title: 'Soumettre le quiz ?',
      text: 'Confirmez-vous la soumission de vos réponses ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, soumettre',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.tentativeId !== null) {
  this.quizService.submitQuizAttempt(this.tentativeId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Quiz soumis',
              text: 'Votre quiz a été soumis avec succès.',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate([`/quizzes/result/${this.quizId}`], {
                queryParams: { token: this.token }
              });
              this.localStorageService.remove('quizId');
              this.localStorageService.remove('quizToken');
            });
          },
          error: (err) => {
            let message = 'Une erreur est survenue lors de la soumission.';
            if (err.status === 400) {
              message = err.error?.message || 'Requête invalide.';
            } else if (err.status === 403) {
              message = 'Vous n\'êtes pas autorisé à soumettre ce quiz.';
            } else if (err.status === 404) {
              message = 'Tentative de quiz non trouvée.';
            }
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: message
            });
          }
        });
      }
      }
    });
  }
}

  cancel() {
    if (this.tentativeId) {
      this.router.navigate([`/quizzes/${this.tentativeId}`]);
    } else {
      this.router.navigate(['/']);
    }
  }
}