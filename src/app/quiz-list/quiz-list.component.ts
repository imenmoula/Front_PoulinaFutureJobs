import { Component, OnInit } from '@angular/core';
import { QuizResponse } from '../Models/quiz.model';
import { QuizService } from '../shared/services/quiz.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { HeaderComponent } from '../layoutBackend/header/header.component';
import { FooterComponent } from '../layoutBackend/footer/footer.component';
import { SidebarComponent } from '../layoutBackend/sidebar/sidebar.component';
import { OffreEmploiService } from '../shared/services/offre-emploi.service';
import { PosteService } from '../shared/services/poste.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PaginationComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  templateUrl: './quiz-list.component.html',
})
export class QuizListComponent implements OnInit {
  quizzes: QuizResponse[] = [];
  paginatedQuizzes: QuizResponse[] = [];
  loading = true;
  error = '';
  pageSize = 5;
  currentPage = 0;
  sidebarOpen = false;
  filteredQuizzes: QuizResponse[] = [];
  searchTerm: string = '';
  private searchTimeout: any;
  searching = false;

  constructor(
    private quizService: QuizService,
    private offreService: OffreEmploiService,
    private posteService: PosteService
  ) { }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.loading = true;
    this.quizService.getQuizzes().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.filteredQuizzes = [...this.quizzes];
        this.loadAdditionalInfo();
        this.loading = false;
      },
      error: (err) => {
        this.showError('Failed to load quizzes');
        this.loading = false;
      }
    });
  }

  loadAdditionalInfo(): void {
    const requests = this.quizzes.map(quiz => {
      if (quiz.offreEmploiId) {
        return this.offreService.getById(quiz.offreEmploiId).toPromise()
          .then(offre => {
            quiz.specialiteOffre = offre?.specialite ?? 'Non disponible';
            return this.posteService.getByOffreId(quiz.offreEmploiId!).toPromise()
              .then(postes => {
                quiz.nomPoste = (postes && postes.length > 0) ? postes[0].titrePoste : 'Non disponible';
                return quiz;
              });
          })
          .catch(() => {
            quiz.specialiteOffre = 'Non disponible';
            quiz.nomPoste = 'Non disponible';
            return quiz;
          });
      } else {
        quiz.specialiteOffre = 'Non associé';
        quiz.nomPoste = 'Non associé';
        return Promise.resolve(quiz);
      }
    });

    Promise.all(requests).then(() => {
      this.updateFilteredQuizzes();
    });
  }

  updateFilteredQuizzes(): void {
    this.filteredQuizzes = [...this.quizzes];
    this.updatePaginatedQuizzes();
  }

  updatePaginatedQuizzes(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredQuizzes.length);
    this.paginatedQuizzes = this.filteredQuizzes.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedQuizzes();
  }

  deleteQuiz(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.quizService.deleteQuiz(id).toPromise()
          .then(() => true)
          .catch(error => {
            Swal.showValidationMessage(`Erreur: ${error.message || 'Échec de la suppression'}`);
            return false;
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.quizzes = this.quizzes.filter(q => q.quizId !== id);
        this.filteredQuizzes = this.filteredQuizzes.filter(q => q.quizId !== id);
        this.updatePaginatedQuizzes();
        Swal.fire(
          'Supprimé!',
          'Le quiz a été supprimé avec succès.',
          'success'
        );
      } else if (result.isConfirmed && !result.value) {
        Swal.fire(
          'Erreur',
          'La suppression a échoué. Veuillez réessayer.',
          'error'
        );
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  searchQuizzes(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searching = true;
    this.error = '';

    this.searchTimeout = setTimeout(() => {
      if (this.searchTerm.trim()) {
        this.quizService.searchQuizzesByTitle(this.searchTerm).subscribe({
          next: (data) => {
            this.searching = false;
            this.filteredQuizzes = data;
            this.currentPage = 0;
            this.updatePaginatedQuizzes();
            
            if (data.length === 0) {
              this.showInfo('Aucun quiz trouvé avec ce critère de recherche');
            }
          },
          error: (err) => {
            this.searching = false;
            this.showError('Erreur lors de la recherche');
          }
        });
      } else {
        this.searching = false;
        this.filteredQuizzes = [...this.quizzes];
        this.currentPage = 0;
        this.updatePaginatedQuizzes();
      }
    }, 500);
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.searchQuizzes();
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      timer: 3000
    });
  }

  private showInfo(message: string): void {
    Swal.fire({
      icon: 'info',
      title: 'Information',
      text: message,
      timer: 3000
    });
  }
}