import { AuthService } from './../../../shared/services/auth.service';
// import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../../shared/services/filiale.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ModeTravail, StatutOffre, TypeContratEnum } from '../../../Models/enums.model';
// import { environment } from '../../../../environments/environment';

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
//   offre: any = null; // Use 'any' temporarily until the model is fixed
//   filiale: any = null;
//   idOffreEmploi: string | null = null;
//   shortId: string | null = null;
//   loading: boolean = true;
//   error: string | null = null;
//   currentYear: number = new Date().getFullYear();

//   typeContratLabels = {
//     [TypeContratEnum.CDI]: 'CDI',
//     [TypeContratEnum.CDD]: 'CDD',
//     [TypeContratEnum.Freelance]: 'Freelance',
//     [TypeContratEnum.Stage]: 'Stage',
//     [TypeContratEnum.Alternance]: 'Alternance'
//   };

//   modeTravailLabels = {
//     [ModeTravail.Presentiel]: 'Présentiel',
//     [ModeTravail.Hybride]: 'Hybride',
//     [ModeTravail.Teletravail]: 'Télétravail'
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private offreService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private renderer: Renderer2
//   ) {}

//   ngOnInit(): void {
//     console.log('Current URL:', this.router.url);
//     console.log('Route params:', this.route.snapshot.paramMap.get('id'));
//     this.route.paramMap.subscribe(params => {
//       this.idOffreEmploi = params.get('id');
//       console.log('ID de l\'offre à charger:', this.idOffreEmploi);
      
//       if (this.idOffreEmploi) {
//         this.shortId = this.idOffreEmploi.substring(0, 8);
//         console.log('Shortened ID:', this.shortId);
        
//         // Vérifier si l'ID est au format GUID (avec ou sans tirets)
//         const guidRegexWithDashes = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//         const guidRegexWithoutDashes = /^[0-9a-f]{32}$/i;
        
//         if (guidRegexWithDashes.test(this.idOffreEmploi) || guidRegexWithoutDashes.test(this.idOffreEmploi)) {
//           this.loadJobDetails(this.idOffreEmploi);
//         } else {
//           console.error('Invalid GUID format:', this.idOffreEmploi);
//           this.error = "L'ID de l'offre n'est pas valide.";
//           this.loading = false;
//           // setTimeout(() => this.router.navigate(['/job-list']), 3000);
//         }
//       } else {
//         console.error('No ID provided in the route. Redirecting to job list...');
//         this.error = "Aucune offre d'emploi sélectionnée.";
//         this.loading = false;
//         // setTimeout(() => this.router.navigate(['/job-list']), 3000);
//       }
//     });
//   }

//   ngAfterViewInit(): void {
//     {
//       console.log('Loading Cloudflare script...');
//       const script = this.renderer.createElement('script');
//       script.text = `
//         (function(){
//           function c(){
//             var b = a.contentDocument || a.contentWindow.document;
//             if(b){
//               var d = b.createElement('script');
//               d.innerHTML = "window.__CF$cv$params={r:'931e7e424d24bfae',t:'MTc0NDkxOTg2NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
//               b.getElementsByTagName('head')[0].appendChild(d);
//             }
//           }
//           if(document.body){
//             var a = document.createElement('iframe');
//             a.height=1;
//             a.width=1;
//             a.style.position='absolute';
//             a.style.top=0;
//             a.style.left=0;
//             a.style.border='none';
//             a.style.visibility='hidden';
//             document.body.appendChild(a);
//             if('loading'!==document.readyState) c();
//             else if(window.addEventListener) document.addEventListener('DOMContentLoaded',c);
//             else {
//               var e=document.onreadystatechange||function(){};
//               document.onreadystatechange=function(b){
//                 e(b);
//                 'loading'!==document.readyState&&(document.onreadystatechange=e,c());
//               }
//             }
//           }
//         })();
//       `;
//       this.renderer.appendChild(document.body, script);
//     }
//   }

//   loadJobDetails(idOffreEmploi: string): void {
//     this.loading = true;
//     console.log('Tentative de chargement de l\'offre avec ID:', idOffreEmploi);
    
//     this.offreService.getOffreEmploi(idOffreEmploi).subscribe({
//       next: (response: any) => {
//         console.log('Réponse brute de l\'API (offre):', JSON.stringify(response, null, 2));
        
//         // Vérification flexible de la structure de la réponse
//         this.offre = response.offreEmploi || response.data || response;
//         console.log('Données de l\'offre extraites:', JSON.stringify(this.offre, null, 2));
        
//         if (this.offre && (this.offre.IdFiliale || this.offre.idFiliale)) {
//           const filialeId = this.offre.IdFiliale || this.offre.idFiliale;
//           console.log('ID filiale trouvé:', filialeId);
//           this.loadFilialeDetails(filialeId);
//         } else {
//           console.warn('Pas d\'ID filiale trouvé dans l\'offre:', this.offre);
//           this.error = 'Filiale non associée à cette offre.';
//           this.loading = false;
//         }
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement de l\'offre:', error);
//         this.error = `Erreur lors du chargement de l'offre: ${error.message}`;
//         this.loading = false;
//         // setTimeout(() => this.router.navigate(['/job-list']), 3000);
//       }
//     });
//   }
//   loadFilialeDetails(idFiliale: string): void {
//     console.log('Chargement des détails de la filiale avec ID:', idFiliale);
    
//     this.filialeService.getFiliale(idFiliale).subscribe({
//       next: (response: any) => {
//         console.log('Réponse brute de l\'API (filiale):', JSON.stringify(response, null, 2));
        
//         // Vérification flexible de la structure de la réponse
//         this.filiale = response.filiale || response.data || response;
//         console.log('Données de la filiale extraites:', JSON.stringify(this.filiale, null, 2));
        
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des informations de l\'entreprise:', error);
//         this.error = `Erreur lors du chargement des informations de l'entreprise: ${error.message}`;
//         this.loading = false;
//       }
//     });
//   }

//   formatDate(date: Date | string | undefined): string {
//     if (!date) return 'Non spécifié';
//     try {
//       const parsedDate = typeof date === 'string' ? new Date(date) : date;
//       return parsedDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
//     } catch (e) {
//       console.error('Erreur de formatage de date:', e);
//       return 'Date invalide';
//     }
//   }

//   getTypeContratLabel(type: TypeContratEnum | undefined): string {
//     return type || type === 0 ? this.typeContratLabels[type] || 'Non spécifié' : 'Non spécifié';
//   }

//   getContractColor(type: TypeContratEnum | undefined): string {
//     if (!type && type !== 0) return '#6c757d';
//     switch (this.getTypeContratLabel(type)) {
//       case 'CDI': return '#28a745';
//       case 'CDD': return '#007bff';
//       case 'Freelance': return '#ffc107';
//       case 'Stage': return '#dc3545';
//       case 'Alternance': return '#17a2b8';
//       default: return '#6c757d';
//     }
//   }

//   getModeTravailLabel(mode: ModeTravail | undefined): string {
//     return mode || mode === 0 ? this.modeTravailLabels[mode] || 'Non spécifié' : 'Non spécifié';
//   }

//   applyForJob(): void {
//     alert('Redirection vers le formulaire de candidature...');
//     // Implement candidacy logic here
//   }
// }


import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
import { FilialeService } from '../../../shared/services/filiale.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-details.component.html',
  styleUrls: [
    './job-details.component.css',
    '../../../../assets/User/css/bootstrap.min.css',
    '../../../../assets/User/css/owl.carousel.min.css',
    '../../../../assets/User/css/flaticon.css',
    '../../../../assets/User/css/price_rangs.css',
    '../../../../assets/User/css/slicknav.css',
    '../../../../assets/User/css/animate.min.css',
    '../../../../assets/User/css/magnific-popup.css',
    '../../../../assets/User/css/fontawesome-all.min.css',
    '../../../../assets/User/css/themify-icons.css',
    '../../../../assets/User/css/slick.css',
    '../../../../assets/User/css/nice-select.css',
    '../../../../assets/User/css/style.css'
  ]
})
export class JobDetailsComponent implements OnInit, AfterViewInit {
  offre: any = null;
  filiale: any = null;
  idOffreEmploi: string | null = null;
  shortId: string | null = null;
  loading: boolean = true;
  error: string | null = null;
  currentYear: number = new Date().getFullYear();

  typeContratLabels = {
    'CDI': 'CDI',
    'CDD': 'CDD',
    'Freelance': 'Freelance',
    'Stage': 'Stage',
    'Alternance': 'Alternance'
  };

  modeTravailLabels = {
    'Presentiel': 'Présentiel',
    'Hybride': 'Hybride',
    'Teletravail': 'Télétravail'
  };

  statutOffreLabels = {
    'Ouverte': 'Ouverte',
    'colture': 'Fermée',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private authService:AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    console.log('Environnement actuel :', environment);
    console.log('URL actuelle :', this.router.url);
    console.log('Configuration de la route :', JSON.stringify(this.route.snapshot.routeConfig, null, 2));
  
    // Récupération de l'identifiant de l'offre depuis les paramètres de l'URL
    this.route.paramMap.subscribe(params => {
      const routeId = params.get('id');
      console.log('Paramètres de route disponibles :', params.keys);
  
      if (routeId) {
        this.idOffreEmploi = routeId;
        console.log(`Identifiant de l'offre extrait de l'URL : ${this.idOffreEmploi}`);
  
        // Appel pour charger les détails de l'offre
        this.loadJobDetails(this.idOffreEmploi);
      } else {
        console.error('Aucun identifiant d\'offre trouvé dans l\'URL.');
        this.error = "Aucune offre d'emploi sélectionnée.";
        this.loading = false;
      }
    });
  }
  
  ngAfterViewInit(): void {
    if (environment.production) {
      console.log('Loading Cloudflare script...');
      const script = this.renderer.createElement('script');
      script.text = `
        (function(){
          function c(){
            var b = a.contentDocument || a.contentWindow.document;
            if(b){
              var d = b.createElement('script');
              d.innerHTML = "window.__CF$cv$params={r:'931e7e424d24bfae',t:'MTc0NDkxOTg2NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
              b.getElementsByTagName('head')[0].appendChild(d);
            }
          }
          if(document.body){
            var a = document.createElement('iframe');
            a.height=1;
            a.width=1;
            a.style.position='absolute';
            a.style.top=0;
            a.style.left=0;
            a.style.border='none';
            a.style.visibility='hidden';
            document.body.appendChild(a);
            if('loading'!==document.readyState) c();
            else if(window.addEventListener) document.addEventListener('DOMContentLoaded',c);
            else {
              var e=document.onreadystatechange||function(){};
              document.onreadystatechange=function(b){
                e(b);
                'loading'!==document.readyState&&(document.onreadystatechange=e,c());
              }
            }
          }
        })();
      `;
      this.renderer.appendChild(document.body, script);
    }
  }
  onLogout(): void {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }
  loadJobDetails(idOffreEmploi: string): void {
    this.loading = true;
    console.log('Tentative de chargement de l\'offre avec ID:', idOffreEmploi);

    this.offreService.getOffreEmploi(idOffreEmploi).subscribe({
      next: (response: any) => {
        console.log('Réponse brute de l\'API (offre):', response);
        this.offre = response.offreEmploi || response.data || response;
        console.log('Données de l\'offre extraites:', this.offre);

        if (this.offre && (this.offre.IdFiliale || this.offre.idFiliale)) {
          const filialeId = this.offre.IdFiliale || this.offre.idFiliale;
          this.loadFilialeDetails(filialeId);
        } else {
          this.error = 'Filiale non associée à cette offre.';
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = `Erreur lors du chargement de l'offre: ${error.message}`;
        this.loading = false;
      }
    });
  }

  loadFilialeDetails(idFiliale: string): void {
    this.filialeService.getFiliale(idFiliale).subscribe({
      next: (response: any) => {
        console.log('Réponse brute de l\'API (filiale):', response);
        this.filiale = response.filiale || response.data || response;
        console.log('Données de la filiale extraites:', this.filiale);
        this.loading = false;
      },
      error: (error) => {
        this.error = `Erreur lors du chargement des informations de l'entreprise: ${error.message}`;
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Non spécifié';
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      return parsedDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      return 'Date invalide';
    }
  }

  getTypeContratLabel(type: string | undefined): string {
    return type ? this.typeContratLabels[type as keyof typeof this.typeContratLabels] || 'Non spécifié' : 'Non spécifié';
  }

  getContractColor(type: string | undefined): string {
    if (!type) return '#6c757d';
    switch (this.getTypeContratLabel(type)) {
      case 'CDI': return '#28a745';
      case 'CDD': return '#007bff';
      case 'Freelance': return '#ffc107';
      case 'Stage': return '#dc3545';
      case 'Alternance': return '#17a2b8';
      default: return '#6c757d';
    }
  }

  getModeTravailLabel(mode: string | undefined): string {
    return mode ? this.modeTravailLabels[mode as keyof typeof this.modeTravailLabels] || 'Non spécifié' : 'Non spécifié';
  }

  getStatutOffreLabel(statut: string | undefined): string {
    return statut ? this.statutOffreLabels[statut as keyof typeof this.statutOffreLabels] || 'Non spécifié' : 'Non spécifié';
  }

  applyForJob(): void {
    alert('Redirection vers le formulaire de candidature...');
    // Implement candidacy logic here
  }
}