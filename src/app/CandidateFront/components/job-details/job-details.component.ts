
//   import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
//   import { ActivatedRoute, Router } from '@angular/router';
//   import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
//   import { FilialeService } from '../../../shared/services/filiale.service';
//   import { CommonModule } from '@angular/common';
//   import { FormsModule } from '@angular/forms';
//   import { environment } from '../../../../environments/environment';
//   import { AuthService } from '../../../shared/services/auth.service';

//   @Component({
//     selector: 'app-job-details',
//     standalone: true,
//     imports: [CommonModule, FormsModule],
//     templateUrl: './job-details.component.html',
//     styleUrls: [
//       './job-details.component.css',
//       '../../../../assets/User/css/bootstrap.min.css',
//       '../../../../assets/User/css/owl.carousel.min.css',
//       '../../../../assets/User/css/flaticon.css',
//       '../../../../assets/User/css/price_rangs.css',
//       '../../../../assets/User/css/slicknav.css',
//       '../../../../assets/User/css/animate.min.css',
//       '../../../../assets/User/css/magnific-popup.css',
//       '../../../../assets/User/css/fontawesome-all.min.css',
//       '../../../../assets/User/css/themify-icons.css',
//       '../../../../assets/User/css/slick.css',
//       '../../../../assets/User/css/nice-select.css',
//       '../../../../assets/User/css/style.css'
//     ]
//   })
//   export class JobDetailsComponent implements OnInit, AfterViewInit {
//     offre: any = null;
//     filiale: any = null;
//     idOffreEmploi: string | null = null;
//     shortId: string | null = null;
//     loading: boolean = true;
//     error: string | null = null;
//     currentYear: number = new Date().getFullYear();

//     typeContratLabels = {
//       'CDI': 'CDI',
//       'CDD': 'CDD',
//       'Freelance': 'Freelance',
//       'Stage': 'Stage',
//       'Alternance': 'Alternance'
//     };

//     modeTravailLabels = {
//       'Presentiel': 'Présentiel',
//       'Hybride': 'Hybride',
//       'Teletravail': 'Télétravail'
//     };

//     StatutOffreOffreLabels = {
//       'Ouvert': 'Ouvert',
//       'colture': 'Fermée',
//     };

//     constructor(
//       private route: ActivatedRoute,
//       private router: Router,
//       private offreService: OffreEmploiService,
//       private filialeService: FilialeService,
//       private authService:AuthService,
//       private renderer: Renderer2
//     ) {}

//     ngOnInit(): void {
//       console.log('Environnement actuel :', environment);
//       console.log('URL actuelle :', this.router.url);
//       console.log('Configuration de la route :', JSON.stringify(this.route.snapshot.routeConfig, null, 2));
  
//       this.route.paramMap.subscribe(params => {
//         const routeId = params.get('id');
//         console.log('Paramètres de route disponibles :', params.keys);
  
//         if (routeId) {
//           this.idOffreEmploi = routeId;
//           console.log(`Identifiant de l'offre extrait de l'URL : ${this.idOffreEmploi}`);
  
//           this.loadJobDetails(this.idOffreEmploi);
//         } else {
//           console.error('Aucun identifiant d\'offre trouvé dans l\'URL.');
//           this.error = "Aucune offre d'emploi sélectionnée.";
//           this.loading = false;
//         }
//       });
//     }
  
//     ngAfterViewInit(): void {
//       if (environment.production) {
//         console.log('Loading Cloudflare script...');
//         const script = this.renderer.createElement('script');
//         script.text = `
//           (function(){
//             function c(){
//               var b = a.contentDocument || a.contentWindow.document;
//               if(b){
//                 var d = b.createElement('script');
//                 d.innerHTML = "window.__CF$cv$params={r:'931e7e424d24bfae',t:'MTc0NDkxOTg2NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
//                 b.getElementsByTagName('head')[0].appendChild(d);
//               }
//             }
//             if(document.body){
//               var a = document.createElement('iframe');
//               a.height=1;
//               a.width=1;
//               a.style.position='absolute';
//               a.style.top=0;
//               a.style.left=0;
//               a.style.border='none';
//               a.style.visibility='hidden';
//               document.body.appendChild(a);
//               if('loading'!==document.readyState) c();
//               else if(window.addEventListener) document.addEventListener('DOMContentLoaded',c);
//               else {
//                 var e=document.onreadystatechange||function(){};
//                 document.onreadystatechange=function(b){
//                   e(b);
//                   'loading'!==document.readyState&&(document.onreadystatechange=e,c());
//                 }
//               }
//             }
//           })();
//         `;
//         this.renderer.appendChild(document.body, script);
//       }
//     }
//     onLogout(): void {
//       this.authService.deleteToken();
//       this.router.navigateByUrl('/signin');
//     }
//     loadJobDetails(idOffreEmploi: string): void {
//       this.loading = true;
//       console.log('Tentative de chargement de l\'offre avec ID:', idOffreEmploi);

//       this.offreService.getOffreEmploi(idOffreEmploi).subscribe({
//         next: (response: any) => {
//           console.log('Réponse brute de l\'API (offre):', response);
//           this.offre = response.offreEmploi || response.data || response;
//           console.log('Données de l\'offre extraites:', this.offre);

//           if (this.offre && (this.offre.IdFiliale || this.offre.idFiliale)) {
//             const filialeId = this.offre.IdFiliale || this.offre.idFiliale;
//             this.loadFilialeDetails(filialeId);
//           } else {
//             this.error = 'Filiale non associée à cette offre.';
//             this.loading = false;
//           }
//         },
//         error: (error) => {
//           this.error = `Erreur lors du chargement de l'offre: ${error.message}`;
//           this.loading = false;
//         }
//       });
//     }

//     loadFilialeDetails(idFiliale: string): void {
//       this.filialeService.getFiliale(idFiliale).subscribe({
//         next: (response: any) => {
//           console.log('Réponse brute de l\'API (filiale):', response);
//           this.filiale = response.filiale || response.data || response;
//           console.log('Données de la filiale extraites:', this.filiale);
//           this.loading = false;
//         },
//         error: (error) => {
//           this.error = `Erreur lors du chargement des informations de l'entreprise: ${error.message}`;
//           this.loading = false;
//         }
//       });
//     }

//     formatDate(date: Date | string | undefined): string {
//       if (!date) return 'Non spécifié';
//       try {
//         const parsedDate = typeof date === 'string' ? new Date(date) : date;
//         return parsedDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
//       } catch (e) {
//         console.error('Erreur de formatage de date:', e);
//         return 'Date invalide';
//       }
//     }
//  navigateToCandidature(): void {
//    if (this.idOffreEmploi) {
//      this.router.navigate(['/offre', this.idOffreEmploi, 'postuler']);
//    } else {
//      console.error('No idOffreEmploi available for navigation');
//    }
//  }

//     getTypeContratLabel(type: string | undefined): string {
//       return type ? this.typeContratLabels[type as keyof typeof this.typeContratLabels] || 'Non spécifié' : 'Non spécifié';
//     }

//     getContractColor(type: string | undefined): string {
//       if (!type) return '#6c757d';
//       switch (this.getTypeContratLabel(type)) {
//         case 'CDI': return '#28a745';
//         case 'CDD': return '#007bff';
//         case 'Freelance': return '#ffc107';
//         case 'Stage': return '#dc3545';
//         case 'Alternance': return '#17a2b8';
//         default: return '#6c757d';
//       }
//     }
//     getStatutOffreColor(StatutOffre: string | undefined): string {
//       if (!StatutOffre) return '#6c757d';  
//       const normalizedStatutOffre = StatutOffre.toLowerCase();
//       switch (normalizedStatutOffre) {
//         case 'ouverte': return '#28a745';  
//         case 'fermee': return '#dc3545'; 
//         default: return '#6c757d';  
//       }
//     }

//     getModeTravailLabel(mode: string | undefined): string {
//       return mode ? this.modeTravailLabels[mode as keyof typeof this.modeTravailLabels] || 'Non spécifié' : 'Non spécifié';
//     }

//     getStatutOffreOffreLabel(StatutOffre: string | undefined): string {
//       return StatutOffre ? this.StatutOffreOffreLabels[StatutOffre as keyof typeof this.StatutOffreOffreLabels] || 'Non spécifié' : 'Non spécifié';
//     }

//     applyForJob(): void {
//       alert('Redirection vers le formulaire de candidature...');
//     }
//   }

 import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
 import { ActivatedRoute, Router } from '@angular/router';
 import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
 import { FilialeService } from '../../../shared/services/filiale.service';
 import { CommonModule } from '@angular/common';
 import { FormsModule } from '@angular/forms';
 import { environment } from '../../../../environments/environment';
 import { AuthService } from '../../../shared/services/auth.service';
 import { ModeTravail, StatutOffre, TypeContratEnum } from '../../../Models/enums.model';

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

   private StatutOffreMapping: { [key: string]: StatutOffre } = {
     'ouvert': StatutOffre.Ouvert,
     'Colture': StatutOffre.cloturer,
   
   };

   private typeContratMapping: { [key: string]: TypeContratEnum } = {
     'CDI': TypeContratEnum.CDI,
     'CDD': TypeContratEnum.CDD,
     'FREELANCE': TypeContratEnum.Freelance,
     'STAGE': TypeContratEnum.Stage,
     'ALTERNANCE': TypeContratEnum.Alternance,
 
   };

   private modeTravailMapping: { [key: string]: ModeTravail } = {
     'Presentiel': ModeTravail.Presentiel,
     'Hybride': ModeTravail.Hybride,
     'Teletravail': ModeTravail.Teletravail
   };

   constructor(
     private route: ActivatedRoute,
     private router: Router,
     private offreService: OffreEmploiService,
     private filialeService: FilialeService,
     private authService: AuthService,
     private renderer: Renderer2
   ) {}

   ngOnInit(): void {
     console.log('Environnement actuel :', environment);
     console.log('URL actuelle :', this.router.url);
     console.log('Configuration de la route :', JSON.stringify(this.route.snapshot.routeConfig, null, 2));

     this.route.paramMap.subscribe(params => {
       const routeId = params.get('id');
       console.log('Paramètres de route disponibles :', params.keys);

       if (routeId) {
         this.idOffreEmploi = routeId;
         console.log(`Identifiant de l'offre extrait de l'URL : ${this.idOffreEmploi}`);
         this.loadJobDetails(this.idOffreEmploi);
       } else {
         console.error("Aucun identifiant d'offre trouvé dans l'URL.");
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
         this.offre.typeContrat = this.offre?.typeContrat || 
         console.log('Valeur de typeContrat:', this.offre?.typeContrat);
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
         console.log('Valeur de siteWeb:', this.filiale?.siteWeb);
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
     if (!type) return 'Non spécifié';
     const normalizedType = type.toUpperCase();
     const enumType = this.typeContratMapping[normalizedType] || 
                     this.typeContratMapping[type] || 
                     TypeContratEnum[normalizedType as keyof typeof TypeContratEnum];
     return enumType ? String(enumType) : 'Non spécifié';
   }

   getContractColor(type: string | undefined): string {
     if (!type) return '#6c757d';
     const normalizedType = type.toUpperCase();
     const enumType = this.typeContratMapping[normalizedType] || 
                     this.typeContratMapping[type] || 
                     TypeContratEnum[normalizedType as keyof typeof TypeContratEnum];
     switch (enumType) {
       case TypeContratEnum.CDI:
       case TypeContratEnum.CDD:
       case TypeContratEnum.Freelance: return '#ffc107';
       case TypeContratEnum.Stage: return '#dc3545';
       case TypeContratEnum.Alternance: return '#17a2b8';
       default: return '#6c757d';
     }
   }

   getStatutOffreLabel(StatutOffre: string | undefined): string {
     if (!StatutOffre) return 'Non spécifié';
     const normalizedStatutOffre = StatutOffre.toUpperCase();
     const enumStatutOffre = this.StatutOffreMapping[normalizedStatutOffre] || StatutOffre[normalizedStatutOffre as keyof typeof StatutOffre];
     return enumStatutOffre === 'ouvert' || enumStatutOffre === 'Colture' ? (enumStatutOffre === 'ouvert' ? 'Ouverte' : 'Fermée') : 'Non spécifié';
   }

   getStatutOffreColor(StatutOffre: string | undefined): string {
     if (!StatutOffre) return '#6c757d';
     const normalizedStatutOffre = StatutOffre.toUpperCase();
     const enumStatutOffre = this.StatutOffreMapping[normalizedStatutOffre] || StatutOffre[normalizedStatutOffre as keyof typeof StatutOffre];
     switch (enumStatutOffre) {
       case 'Ouvert': return '#28a745';
       case 'cloturer': return '#28a745'; 
       default: return '#6c757d';
     }
   }
 navigateToCandidature(): void {
   if (this.idOffreEmploi) {
     this.router.navigate(['/candidature', this.idOffreEmploi, 'postuler']);
   } else {
     console.error('No idOffreEmploi available for navigation');
   }
 }
 

 
   getModeTravailLabel(mode: string | undefined): string {
     if (!mode) return 'Non spécifié';
     const normalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
     const enumMode = this.modeTravailMapping[normalizedMode] || ModeTravail[normalizedMode as keyof typeof ModeTravail];
     return enumMode ? String(this.modeTravailMapping[enumMode]) || String(enumMode) : 'Non spécifié';
   }
 }