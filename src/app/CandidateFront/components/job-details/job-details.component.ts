// import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../../shared/services/filiale.service';
// import { OffreMissionService } from '../../../shared/services/offre-mission.service';
// import { LangueService } from '../../../shared/services/langue.service';
// import { OffreCompetenceSharedService } from '../../../shared/services/offre-competence.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { environment } from '../../../../environments/environment';
// import { AuthService } from '../../../shared/services/auth.service';
// import { ModeTravail, StatutOffre, TypeContratEnum, NiveauRequisType } from '../../../Models/enums.model';
// import { OffreEmploi, OffreLangue, OffreMission } from '../../../Models/offre-emploi.model';
// import { OffreCompetence } from '../../../Models/offre-competence.model';

// @Component({
//   selector: 'app-job-details',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './job-details.component.html',
//   styleUrls: [
//     './job-details.component.css',
//     '../../../../assets/User/css/bootstrap.min.css',
//     '../../../../assets/User/css/owl.carousel.min.css',
//     '../../../../assets/User/css/flaticon.css',
//     '../../../../assets/User/css/price_rangs.css',
//     '../../../../assets/User/css/slicknav.css',
//     '../../../../assets/User/css/animate.min.css',
//     '../../../../assets/User/css/magnific-popup.css',
//     '../../../../assets/User/css/fontawesome-all.min.css',
//     '../../../../assets/User/css/themify-icons.css',
//     '../../../../assets/User/css/slick.css',
//     '../../../../assets/User/css/nice-select.css',
//     '../../../../assets/User/css/style.css'
//   ]
// })
// export class JobDetailsComponent implements OnInit, AfterViewInit {
//   offre: OffreEmploi | null = null;
//   filiale: any = null;
//   idOffreEmploi: string | null = null;
//   loading: boolean = true;
//   error: string | null = null;
//   missions: OffreMission[] = [];
//   langues: OffreLangue[] = [];
//   competences: OffreCompetence[] = [];
//   similarOffers: any[] = [
//     { titrePoste: 'Développeur Frontend React', filiale: 'WebDesign Agency', typeContrat: TypeContratEnum.CDI },
//     { titrePoste: 'Développeur Backend Node.js', filiale: 'DataTech', typeContrat: TypeContratEnum.CDI },
//     { titrePoste: 'Lead Developer Full Stack', filiale: 'InnovateTech', typeContrat: TypeContratEnum.CDI }
//   ];

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private offreService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private missionService: OffreMissionService,
//     private langueService: LangueService,
//     private competenceService: OffreCompetenceSharedService,
//     private authService: AuthService,
//     private renderer: Renderer2
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       const routeId = params.get('id');
//       if (routeId) {
//         this.idOffreEmploi = routeId;
//         this.loadJobDetails(this.idOffreEmploi);
//       } else {
//         this.error = 'Aucune offre d\'emploi sélectionnée.';
//         this.loading = false;
//       }
//     });
//   }

//   ngAfterViewInit(): void {
//     if (environment.production) {
//       const script = this.renderer.createElement('script');
//       script.text = `
//         (function(){
//           function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'931e7e424d24bfae',t:'MTc0NDkxOTg2NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d);}}
//           if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c());}}}
//         })();
//       `;
//       this.renderer.appendChild(document.body, script);
//     }
//   }

//   onLogout(): void {
//     this.authService.deleteToken();
//     this.router.navigateByUrl('/signin');
//   }

//   loadJobDetails(idOffreEmploi: string): void {
//     this.loading = true;
//     this.offreService.getById(idOffreEmploi).subscribe({
//       next: (response: { success: boolean; message: string; offreEmploi: OffreEmploi }) => {
//         this.offre = response.offreEmploi;
//         if (this.offre && this.offre.idFiliale) {
//           this.loadFilialeDetails(this.offre.idFiliale);
//           this.loadMissions(idOffreEmploi);
//           this.loadLangues(idOffreEmploi);
//           this.loadCompetences(idOffreEmploi);
//         } else {
//           this.error = 'Filiale non associée à cette offre.';
//           this.loading = false;
//         }
//       },
//       error: (error: any) => {
//         this.error = `Erreur lors du chargement de l'offre: ${error.message}`;
//         this.loading = false;
//       }
//     });
//   }

//   loadFilialeDetails(idFiliale: string): void {
//     this.filialeService.getFiliale(idFiliale).subscribe({
//       next: (response: any) => {
//         this.filiale = response.filiale || response.data || response;
//         this.loading = false;
//       },
//       error: (error: any) => {
//         this.error = `Erreur lors du chargement des informations de l'entreprise: ${error.message}`;
//         this.loading = false;
//       }
//     });
//   }

//   loadMissions(idOffreEmploi: string): void {
//     this.missionService.getByOffreEmploi(idOffreEmploi).subscribe({
//       next: (missions: any[]) => {
//         const formattedMissions = missions.map(mission => ({
//           ...mission,
//           descriptionMission: mission.descriptionMission || '',
//           priorite: mission.priorite || ''
//         }));
//         this.missions = formattedMissions;
//       },
//       error: (error: any) => { console.error('Erreur missions:', error); }
//     });
//   }

//   loadLangues(idOffreEmploi: string): void {
//     this.langueService.getLanguesByOffre(idOffreEmploi).subscribe({
//       next: (langues: OffreLangue[]) => { this.langues = langues; },
//       error: (error: any) => { console.error('Erreur langues:', error); }
//     });
//   }

//   loadCompetences(idOffreEmploi: string): void {
//     this.competenceService.getCompetencesByOffre(idOffreEmploi).subscribe({
//       next: (competences: any[]) => { 
//         this.competences = competences.map((competence: any) => {
//           return {
//             ...competence,
//             niveauRequis: competence.niveauRequis as NiveauRequisType
//           };
//         });
//       },
//       error: (error: any) => { console.error('Erreur compétences:', error); }
//     });
//   }

//   formatDate(date: Date | string | undefined): string {
//     if (!date) return 'Non spécifié';
//     try {
//       return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
//     } catch (e) {
//       return 'Date invalide';
//     }
//   }

//   getTypeContratLabel(type: TypeContratEnum): string {
//     if (!type) return 'Non spécifié';
//     return type.toString();
//   }
//   getTypeContratEnum(value: string): TypeContratEnum | undefined {
//     return TypeContratEnum[value as keyof typeof TypeContratEnum];
//   }

//   getContractColor(type: TypeContratEnum | undefined): string {
//     if (!type) return '#6c757d';
//     switch (this.getTypeContratLabel(type)) {
//       case 'CDI': return '#28a745';
//       case 'CDD': return '#007bff';
//       case 'FREELANCE': return '#ffc107';
//       case 'STAGE': return '#dc3545';
//       case 'ALTERNANCE': return '#17a2b8';
//       default: return '#6c757d';
//     }
//   }

//   getStatutOffreLabel(statut: StatutOffre | undefined): string {
//     if (!statut) return 'Non spécifié';
//     const normalized = statut.toString();
//     return normalized === 'ouvert' ? 'Ouverte' : (normalized === 'cloture' ? 'Fermée' : 'Non spécifié');
//   }

//   getStatutOffreColor(statut: StatutOffre | undefined): string {
//     if (!statut) return '#6c757d';
//     const normalized = statut.toString().toLowerCase();
//     return normalized === 'ouvert' ? '#28a745' : (normalized === 'cloture' ? '#dc3545' : '#6c757d');
//   }

//   getModeTravailLabel(mode: ModeTravail | undefined): string {
//     if (!mode) return 'Non spécifié';
//     const normalized = mode.toString();
//     return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
//   }

//   getNiveauRequisLabel(niveau: string | undefined): string {
//     if (!niveau) return 'Non spécifié';
//     return NiveauRequisType[niveau as keyof typeof NiveauRequisType] || niveau;
//   }

//   navigateToCandidature(): void {
//     if (this.idOffreEmploi) {
//       this.router.navigate(['/candidature', this.idOffreEmploi, 'postuler']);
//     } else {
//       console.error('No idOffreEmploi available');
//     }
//   }
//   onlogout(): void {
//     localStorage.clear();
//     this.router.navigate(['/login']);
//   }
// }