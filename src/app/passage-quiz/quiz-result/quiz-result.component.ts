import { QuizService } from './../../shared/services/quiz.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultatService } from '../../shared/services/resultat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { TimeConverterPipe } from '../time-converter.pipe';

interface ResultatDetailResponseDto {
  resultatId: string;          // Unique ID for the result
  tentativeId: string;         // ID for the quiz attempt
  quizId: string;             // ID for the quiz
  quizTitre: string;          // Title of the quiz
  score: number;              // User’s score (percentage)
  questionsCorrectes: number; // Number of correct answers
  nombreQuestions: number;    // Total number of questions
  tempsTotal: number;         // Total time taken (in seconds)
  reussi: boolean;            // Whether the quiz was passed
  dateResultat: string;       // Date of the result
  reponsesDetail: {           // Array of response details for each question
    questionId: string;       // Question ID
    questionTexte: string;    // Question text
    questionType: string;     // Type of question (e.g., ChoixUnique, ReponseTexte)
    estCorrecte: boolean;     // Whether the response was correct
    tempsReponse: number;     // Time taken to answer (in seconds)
    texteReponse?: string;    // User’s text response (for text-based questions)
    reponseId?: string;       // ID of the selected response (for multiple-choice)
    reponseTexte?: string;    // Text of the selected response
    explication?: string;     // Explanation for the correct/incorrect answer
  }[];
}

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeConverterPipe],
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.css']
})
export class QuizResultComponent implements OnInit {
  resultat: ResultatDetailResponseDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resultatService: ResultatService,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    const quizId = this.route.snapshot.paramMap.get('quizId');
    const token = this.route.snapshot.queryParamMap.get('token');
    if (quizId && token) {
      this.quizService.getResultatByQuizIdAndToken(quizId, token).subscribe({
        next: (result) => {
          this.resultat = result;
          Swal.fire({
            icon: 'success',
            title: 'Résultats chargés',
            text: `Votre score est de ${result.score}%`,
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error('Error fetching result:', err);
          let message = 'Une erreur est survenue.';
          if (err.status === 403) {
            message = 'Vous n\'êtes pas autorisé à voir ce résultat.';
          } else if (err.status === 404) {
            message = 'Résultat non trouvé pour ce quiz et ce token.';
          }
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: message
          });
          this.resultat = null;
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Quiz ID ou token manquant.'
      }).then(() => {
        this.router.navigate(['/']);
      });
    }
  }
}