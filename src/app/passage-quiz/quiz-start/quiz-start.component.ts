// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import Swal from 'sweetalert2';

// interface QuizPourCandidatDto {
//   quizId: string;
//   titre: string;
//   description: string;
//   duree: number;
//   questions: {
//     questionId: string;
//     texte: string;
//     type: string;
//     points: number;
//     ordre: number;
//     tempsRecommande?: number;
//     reponses: {
//       reponseId: string;
//       texte: string;
//       ordre: number;
//       explication?: string | null;
//     }[];
//   }[];
// }

// @Component({
//   selector: 'app-quiz-start',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './quiz-start.component.html',
//   styleUrls: ['./quiz-start.component.css']
// })
// export class QuizStartComponent {
//   tentativeId: string = '';

//   constructor(private router: Router, private http: HttpClient) {}

//   // quiz-start.component.ts
// startQuiz() {
//   if (!this.tentativeId) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Erreur',
//       text: 'Veuillez entrer un ID de tentative.'
//     });
//     return;
//   }

//   this.http.get<QuizPourCandidatDto>(`api/Quiz/Demarrer?tentativeId=${this.tentativeId}`).subscribe({
//     next: (response) => {
//       console.log('Quiz data received:', response); // Debug log
//       Swal.fire({
//         icon: 'success',
//         title: 'Quiz démarré',
//         text: `Vous commencez le quiz: ${response.titre} (${response.questions.length} questions)`,
//         timer: 2000,
//         showConfirmButton: false
//       }).then(() => {
//         this.router.navigate([`quizzes/${this.tentativeId}`], {
//           state: { quiz: response }
//         });
//       });
//     },
//     error: (err) => {
//       console.error('Error starting quiz:', err); // Debug log
//       let message = 'Une erreur est survenue.';
//       if (err.status === 404) {
//         message = 'Tentative ou quiz non trouvé.';
//       } else if (err.status === 400 && err.error) {
//         message = err.error.toString(); // Use the exact error message from backend
//       } else if (err.status === 500) {
//         message = 'Erreur serveur lors du démarrage du quiz.';
//       }
//       Swal.fire({
//         icon: 'error',
//         title: 'Erreur',
//         text: message
//       });
//     }
//   });
// }
// }
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngClass

interface QuizPourCandidatDto {
  quizId: string;
  titre: string;
  description: string;
  duree: number;
  questions: {
    questionId: string;
    texte: string;
    type: string;
    points: number;
    ordre: number;
    tempsRecommande?: number;
    reponses: {
      reponseId: string;
      texte: string;
      ordre: number;
      explication?: string | null;
    }[];
  }[];
}

@Component({
  selector: 'app-quiz-start',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './quiz-start.component.html',
  styleUrls: ['./quiz-start.component.css']
})
export class QuizStartComponent {
  tentativeId: string = '';
  isLoading: boolean = false; // Nouvelle propriété pour l'état de chargement
  showError: boolean = false; // Nouvelle propriété pour afficher l'erreur de validation d'entrée

  constructor(private router: Router, private http: HttpClient) {}

  startQuiz() {
    this.showError = false; // Réinitialiser l'état de l'erreur
    if (!this.tentativeId.trim()) { // Utiliser .trim() pour gérer les espaces blancs
      this.showError = true; // Afficher l'erreur spécifique à l'entrée
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez entrer un ID de tentative valide.'
      });
      return;
    }

    this.isLoading = true; // Définir l'état de chargement à vrai
    this.http.get<QuizPourCandidatDto>(`api/Quiz/Demarrer?tentativeId=${this.tentativeId}`).subscribe({
      next: (response) => {
        console.log('Données du quiz reçues :', response); // Journal de débogage
        this.isLoading = false; // Définir l'état de chargement à faux en cas de succès
        Swal.fire({
          icon: 'success',
          title: 'Quiz démarré',
          text: `Vous commencez le quiz : ${response.titre} (${response.questions.length} questions)`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`quizzes/${this.tentativeId}`], {
            state: { quiz: response }
          });
        });
      },
      error: (err: HttpErrorResponse) => { // Typer l'erreur
        console.error('Erreur lors du démarrage du quiz :', err); // Journal de débogage
        this.isLoading = false; // Définir l'état de chargement à faux en cas d'erreur
        let message = 'Une erreur est survenue lors du démarrage du quiz.';
        if (err.status === 404) {
          message = 'ID de tentative ou quiz non trouvé. Veuillez vérifier l\'ID.';
        } else if (err.status === 400) {
          // Mauvaise requête, peut-être un format d'ID invalide ou un quiz déjà terminé
          message = err.error || 'Requête invalide. L\'ID de tentative est peut-être incorrect ou le quiz a déjà été démarré/complété.';
        } else if (err.status === 403) { // Interdit, s'il y a un problème d'authentification
          message = 'Accès non autorisé. Veuillez vérifier vos permissions.';
        }
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: message
        });
      }
    });
  }

  // Nouvelle méthode pour effacer l'erreur d'entrée lorsque l'utilisateur tape
  clearError() {
    this.showError = false;
  }
}