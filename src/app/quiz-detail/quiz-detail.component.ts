// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { RouterModule, Router } from '@angular/router';
// import { FullQuizResponse } from '../Models/quiz.model';
// import { QuizService } from '../shared/services/quiz.service';


// @Component({
//   selector: 'app-quiz-detail',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './quiz-detail.component.html',
//   // styleUrls: ['./quiz-detail.component.scss']
// })
// export class QuizDetailComponent implements OnInit {
//   quiz?: FullQuizResponse;
//   loading = true;
//   error = '';

//   constructor(
//     private route: ActivatedRoute,
//     private quizService: QuizService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.loadQuiz(id);
//     } else {
//       this.error = 'Quiz ID not provided';
//       this.loading = false;
//     }
//   }

//   loadQuiz(id: string): void {
//     this.quizService.getFullQuizById(id).subscribe( // <-- use getFullQuiz, not getFullQuizById
//       data => {
//         this.quiz = data;
//         this.loading = false;
//       },
//       error => {
//         this.error = 'Failed to load quiz';
//         this.loading = false;
//       }
//     );
//   }

//   deleteQuiz(): void {
//     if (!this.quiz?.quizId) return;
//     if (confirm('Voulez-vous vraiment supprimer ce quiz ?')) {
//       this.quizService.deleteQuiz(this.quiz.quizId).subscribe({
//         next: () => this.router.navigate(['/quizzes']),
//         error: () => this.error = 'Erreur lors de la suppression du quiz'
//       });
//     }
//   }

//   goToEdit(): void {
//     if (this.quiz?.quizId) {
//       this.router.navigate(['/quizzes', this.quiz.quizId, 'edit-full']);
//     }
//   }

//   // Add this method to map question type codes to readable names
//   getQuestionTypeName(type: string | number): string {
//     switch (type) {
//       case 0:
//       case 'QCM':
//         return 'QCM';
//       case 1:
//       case 'QCU':
//         return 'QCU';
//       case 2:
//       case 'Ouverte':
//         return 'Ouverte';
//       default:
//         return 'Inconnu';
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FullQuizResponse } from '../Models/quiz.model';
import { QuizService } from '../shared/services/quiz.service';
import { HeaderComponent } from '../layoutBackend/header/header.component';
import { FooterComponent } from '../layoutBackend/footer/footer.component';
import { SidebarComponent } from '../layoutBackend/sidebar/sidebar.component';

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizDetailComponent:
 *       type: object
 *       properties:
 *         quiz:
 *           $ref: '#/components/schemas/FullQuizResponse'
 *         loading:
 *           type: boolean
 *           description: Indicates if data is being loaded
 *         error:
 *           type: string
 *           description: Error message if any
 *         sidebarOpen:
 *           type: boolean
 *           description: State of the sidebar
 */
@Component({
  selector: 'app-quiz-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.css']
})
export class QuizDetailComponent implements OnInit {
  /**
   * @swagger
   * components:
   *   schemas:
   *     FullQuizResponse:
   *       type: object
   *       properties:
   *         quizId:
   *           type: string
   *         titre:
   *           type: string
   *         description:
   *           type: string
   *         duree:
   *           type: number
   *         scoreMinimum:
   *           type: number
   *         estActif:
   *           type: boolean
   *         questions:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/QuestionResponse'
   */
  quiz?: FullQuizResponse;
  loading = true;
  error = '';
  sidebarOpen = false;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private router: Router
  ) { }

  /**
   * @swagger
   * /quizzes/{id}:
   *   get:
   *     summary: Initialize component and load quiz details
   *     tags: [Quiz]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Quiz loaded successfully
   *       404:
   *         description: Quiz not found
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuiz(id);
    } else {
      this.error = 'Quiz ID not provided';
      this.loading = false;
    }
  }

  /**
   * @swagger
   * /quizzes/{id}:
   *   get:
   *     summary: Load quiz details by ID
   *     tags: [Quiz]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Quiz details loaded
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FullQuizResponse'
   *       404:
   *         description: Quiz not found
   */
  private loadQuiz(id: string): void {
    this.quizService.getFullQuizById(id).subscribe({
      next: (data) => {
        this.quiz = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load quiz';
        this.loading = false;
        console.error('Error loading quiz:', err);
      }
    });
  }

  /**
   * @swagger
   * /quizzes/{id}:
   *   delete:
   *     summary: Delete a quiz
   *     tags: [Quiz]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Quiz deleted successfully
   *       404:
   *         description: Quiz not found
   */
  deleteQuiz(): void {
    if (!this.quiz?.quizId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
      this.quizService.deleteQuiz(this.quiz.quizId).subscribe({
        next: () => {
          this.router.navigate(['/quizzes']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du quiz';
          console.error('Error deleting quiz:', err);
        }
      });
    }
  }

  /**
   * @swagger
   * /quizzes/{id}/edit-full:
   *   get:
   *     summary: Navigate to quiz edit page
   *     tags: [Quiz]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Navigation successful
   */
  goToEdit(): void {
    if (this.quiz?.quizId) {
      this.router.navigate(['/quizzes', this.quiz.quizId, 'edit-full']);
    }
  }

  /**
   * @swagger
   * /component/methods/getQuestionTypeName:
   *   get:
   *     summary: Get human-readable question type name
   *     tags: [Component Methods]
   *     parameters:
   *       - in: query
   *         name: type
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Question type name returned
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   */
  getQuestionTypeName(type: string | number): string {
    switch (type) {
      case 0:
      case 'QCM':
        return 'QCM';
      case 1:
      case 'QCU':
        return 'QCU';
      case 2:
      case 'Ouverte':
        return 'Ouverte';
      default:
        return 'Inconnu';
    }
  }

  /**
   * @swagger
   * /component/methods/toggleSidebar:
   *   post:
   *     summary: Toggle sidebar state
   *     tags: [Component Methods]
   *     responses:
   *       200:
   *         description: Sidebar state toggled
   */
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}