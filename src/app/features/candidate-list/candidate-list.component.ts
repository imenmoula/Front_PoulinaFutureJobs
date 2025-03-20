import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../Models/user.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-list',
standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-list.component.html',
  styles: ``
})
export class CandidateListComponent implements OnInit {
  candidats: any[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getCandidats();
  }

  getCandidats(): void {
    this.userService.getUsersByRole('Candidat').subscribe(
      response => this.candidats = response.data,
      error => console.error('Erreur lors du chargement des candidats', error)
    );
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.candidats = this.candidats.filter(candidat => candidat.id !== id);
    });
  }

  search(): void {
    this.candidats = this.candidats.filter(candidat =>
      candidat.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      candidat.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

