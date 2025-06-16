
// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../shared/services/auth.service';
// import { UserService } from '../../shared/services/user.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { OffreEmploi } from '../../Models/offre-emploi.model';
// import { environment } from '../../../environments/environment.development';
// import { Filiale } from '../../Models/filiale.model';
// import { CandidateFooterComponent } from '../../CandidateFront/components/candidate-footer/candidate-footer.component';
// import { CandidateHeaderComponent } from '../../CandidateFront/components/candidate-header/candidate-header.component';

// interface OffresByFiliale {
//   filiale: Filiale;
//   offres: OffreEmploi[];
//   offreCount: number;
// }
// declare function initSlider(): void;
// @Component({
//   selector: 'app-candidate-only',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     FormsModule,
//     CandidateFooterComponent,
//     CandidateHeaderComponent
//   ],
//   templateUrl: './candidate-only.component.html',
//   styleUrls: [
//     '../../../assets/User/css/bootstrap.min.css',
//     '../../../assets/User/css/owl.carousel.min.css',
//     '../../../assets/User/css/flaticon.css',
//     '../../../assets/User/css/price_rangs.css',
//     '../../../assets/User/css/slicknav.css',
//     '../../../assets/User/css/animate.min.css',
//     '../../../assets/User/css/magnific-popup.css',
//     '../../../assets/User/css/fontawesome-all.min.css',
//     '../../../assets/User/css/themify-icons.css',
//     '../../../assets/User/css/slick.css',
//     '../../../assets/User/css/nice-select.css',
//     '../../../assets/User/css/style.css',
//     './candidate-only.component.css'
//   ]
// })
// export class CandidateOnlyComponent implements OnInit {
//   fullName: string = '';
//   filiales: Filiale[] = [];
//   offres: OffreEmploi[] = [];
//   offresByFiliale: OffresByFiliale[] = [];
//   searchTerm: string = '';
//     private currentSlide: number = 0; // initialize with 0
// isAuthenticated: boolean = false;

// currentYear = new Date().getFullYear();

//   constructor(
//     public authService: AuthService,
//     private userService: UserService,
//     private filialeService: FilialeService,
//     private offreEmploiService: OffreEmploiService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.isAuthenticated = this.authService.isAuthenticated();
//     if (this.isAuthenticated) {
//       this.fullName = this.authService.getUserFullName();
//     }
//     // // Vérifier l'authentification
//     // if (!this.authService.isAuthenticated()) {
//     //   this.router.navigateByUrl('/signin');
//     //   return;
//     // }
//     // this.fullName = this.authService.getUserFullName();

//     // Charger les filiales et les offres
//     this.loadFiliales();
//     this.loadOffres();
//      setTimeout(() => {
//       this.initImageSlider();
//     }, 0);
//   }



//   loadFiliales(): void {
//     this.filialeService.getFiliales().subscribe({
//       next: (filiales: Filiale[]) => {
//         console.log('Filiales fetched:', filiales);
//         this.filiales = filiales || [];
//         this.loadOffresByFiliale(); // Call after filiales are loaded
//       },
//       error: (err) => {
//         console.error('Error fetching filiales:', err);
//         this.filiales = [];
//       }
//     });
//   }

//   loadOffres(): void {
//    this.offreEmploiService.getAll().subscribe({
//   next: (offres: OffreEmploi[]) => {
//     console.log('Offres fetched:', offres);
//     this.offres = offres || [];
//     // Assurer que chaque offre a les données de la filiale
//     this.offres.forEach((offre) => {
//       if (!offre.filiale && offre.idFiliale) {
//         this.filialeService.getFiliale(offre.idFiliale).subscribe({
//           next: (filiale: Filiale) => {
//             offre.filiale = filiale;
//           },
//           error: (err) => {
//             console.error(`Error fetching filiale for offre ${offre.idOffreEmploi}:`, err);
//           }
//         });
//       }
//     });
//     this.loadOffresByFiliale(); // Call after offres are loaded
//   },
//   error: (err) => {
//     console.error('Error fetching offres:', err);
//     this.offres = [];
//   }
// });
//   }

//   loadOffresByFiliale(): void {
//     if (this.filiales.length === 0 || this.offres.length === 0) {
//       this.offresByFiliale = [];
//       return;
//     }

//     // Map offres to filiales
//     const offresByFilialeMap: { [key: string]: OffreEmploi[] } = {};
//     this.offres.forEach(offre => {
//       if (offre.idFiliale) {
//         if (!offresByFilialeMap[offre.idFiliale]) {
//           offresByFilialeMap[offre.idFiliale] = [];
//         }
//         offresByFilialeMap[offre.idFiliale].push(offre);
//       }
//     });

//     // Create the offresByFiliale array
//     this.offresByFiliale = this.filiales
//       .map(filiale => ({
//         filiale,
//         offres: offresByFilialeMap[filiale.idFiliale] || [],
//         offreCount: (offresByFilialeMap[filiale.idFiliale] || []).length
//       }))
//       .filter(item => item.offreCount > 0); // Only include filiales with offers

//     console.log('Offres by filiale computed:', this.offresByFiliale);
//   }

//   getFeaturedJobs(offres: OffreEmploi[]): OffreEmploi[] {
//     const sortedOffres = [...offres].sort((a, b) => {
//       const dateA = a.datePublication ? new Date(a.datePublication).getTime() : 0;
//       const dateB = b.datePublication ? new Date(b.datePublication).getTime() : 0;
//       return dateB - dateA;
//     });
//     return sortedOffres.slice(0, 4);
//   }

//   get filteredOffres(): OffreEmploi[] {
//     if (!this.searchTerm) {
//       return this.getFeaturedJobs(this.offres);
//     }
//     const term = this.searchTerm.toLowerCase();
//     return this.offres.filter(offre =>
//       // (offre.titre?.toLowerCase().includes(term) || false) ||
//       // (offre.description?.toLowerCase().includes(term) || false) ||
//       (offre.filiale?.nom?.toLowerCase().includes(term) || false)
//     );
//   }

//   timeSince(date: any): string {
//     if (!date) return 'Inconnu';
//     const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
//     let interval = seconds / 31536000;

//     if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
//     interval = seconds / 2592000;
//     if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
//     interval = seconds / 86400;
//     if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
//     interval = seconds / 3600;
//     if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
//     interval = seconds / 60;
//     if (interval > 1) return `il y a ${Math.floor(interval)} minutes`;
//     return `il y a ${Math.floor(seconds)} secondes`;
//   }

//   formatDate(date: any): string {
//     if (!date) return 'Date inconnue';
//     try {
//       const parsedDate = new Date(date);
//       return parsedDate.toLocaleDateString('fr-FR');
//     } catch (error) {
//       console.error('Erreur de format de date:', error);
//       return 'Date inconnue';
//     }
//   }

//   getImageUrl(photo: string | undefined): string {
//     if (!photo) return '../../../assets/User/img/logo/poulina.jpg';
//     return photo.startsWith('http') ? photo : `${environment.apiBaseUrl}/Uploads/${photo}`;
//   }

//   onLogout(): void {
//     this.authService.deleteToken();
//     this.router.navigateByUrl('/signin');
//   }

//   navigateToFilialeOffres(filialeId: string): void {
//     this.router.navigate(['/job-list'], { queryParams: { idFiliale: filialeId } });
//   }

//   /******************************* */
//   initImageSlider() {
//     const slides = document.querySelectorAll('.slide');
//     const dotsContainer = document.querySelector('.slider-dots');
//     let currentSlide = 0;
    
//     // Créer les dots
//     slides.forEach((_, index) => {
//       const dot = document.createElement('div');
//       dot.classList.add('dot');
//       if (index === 0) dot.classList.add('active');
//       dot.addEventListener('click', () => this.goToSlide(index));
//       dotsContainer?.appendChild(dot);
//     });
    
//     // Boutons de navigation
//     document.querySelector('.next-slide')?.addEventListener('click', () => this.nextSlide());
//     document.querySelector('.prev-slide')?.addEventListener('click', () => this.prevSlide());
    
//     // Auto-play
//     setInterval(() => this.nextSlide(), 5000);
//   }
  
//   goToSlide(index: number) {
//     const slides = document.querySelectorAll('.slide');
//     const dots = document.querySelectorAll('.dot');
    
//     slides.forEach(slide => slide.classList.remove('active'));
//     dots.forEach(dot => dot.classList.remove('active'));
    
//     slides[index].classList.add('active');
//     dots[index].classList.add('active');
//   }
  
//   nextSlide() {
//     const slides = document.querySelectorAll('.slide');
//     const dots = document.querySelectorAll('.dot');
//     const totalSlides = slides.length;
    
//     slides[this.currentSlide].classList.remove('active');
//     dots[this.currentSlide].classList.remove('active');
    
//     this.currentSlide = (this.currentSlide + 1) % totalSlides;
    
//     slides[this.currentSlide].classList.add('active');
//     dots[this.currentSlide].classList.add('active');
//   }
  
//   prevSlide() {
//   const slides = document.querySelectorAll('.slide');
//   const dots = document.querySelectorAll('.dot');
//   const totalSlides = slides.length;
  
//   slides[this.currentSlide].classList.remove('active');
//   dots[this.currentSlide].classList.remove('active');
  
//   this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides;
  
//   slides[this.currentSlide].classList.add('active');
//   dots[this.currentSlide].classList.add('active');
// }
  
//   getFilialeLocation(filiale: any): string {
//     return filiale.adresse || 'Tunisie';
//   }
  
// navigateToProfile() {
//   this.router.navigate(['/profile']);
// }
// }
// candidate-only.component.ts
// candidate-only.component.ts
// candidate-only.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { OffreEmploi } from '../../Models/offre-emploi.model';
import { environment } from '../../../environments/environment.development';
import { Filiale } from '../../Models/filiale.model';
import { CandidateFooterComponent } from '../../CandidateFront/components/candidate-footer/candidate-footer.component';
import { CandidateHeaderComponent } from '../../CandidateFront/components/candidate-header/candidate-header.component';

interface OffresByFiliale {
  filiale: Filiale;
  offres: OffreEmploi[];
  offreCount: number;
}
declare function initSlider(): void;
@Component({
  selector: 'app-candidate-only',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CandidateFooterComponent,
    CandidateHeaderComponent
  ],
  templateUrl: './candidate-only.component.html', // Corrected template URL
  styleUrls: [
    '../../../assets/User/css/bootstrap.min.css',
    '../../../assets/User/css/owl.carousel.min.css',
    '../../../assets/User/css/flaticon.css',
    '../../../assets/User/css/price_rangs.css',
    '../../../assets/User/css/slicknav.css',
    '../../../assets/User/css/animate.min.css',
    '../../../assets/User/css/magnific-popup.css',
    '../../../assets/User/css/fontawesome-all.min.css',
    '../../../assets/User/css/themify-icons.css',
    '../../../assets/User/css/slick.css',
    '../../../assets/User/css/nice-select.css',
    '../../../assets/User/css/style.css',
    './candidate-only.component.css'
  ]
})
export class CandidateOnlyComponent implements OnInit { // Ensure the class is exported
  fullName: string = '';
  filiales: Filiale[] = [];
  offres: OffreEmploi[] = [];
  offresByFiliale: OffresByFiliale[] = [];
  searchTerm: string = '';
  private currentSlide: number = 0;
  isAuthenticated: boolean = false;

  currentYear = new Date().getFullYear();

  // New properties for statistics
  totalFiliales: number = 0;
  totalCollaborateurs: number = 0;
  totalEmployees: number = 0;

  private counterTriggered: boolean = false;

  // Add the 'sectors' property here
  sectors = [
    { name: "Agroalimentaire", icon: "flaticon-industry", jobCount: 15 },
    { name: "Bâtiment et Matériaux de Construction", icon: "flaticon-construction", jobCount: 10 },
    { name: "Services Financiers", icon: "flaticon-money", jobCount: 8 },
    { name: "Technologies de l'Information", icon: "flaticon-it", jobCount: 20 },
    { name: "Distribution et Commerce", icon: "flaticon-shop", jobCount: 12 },
    { name: "Autres Secteurs", icon: "flaticon-layers", jobCount: 5 }
  ];


  constructor(
    public authService: AuthService,
    private userService: UserService,
    private filialeService: FilialeService,
    private offreEmploiService: OffreEmploiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.fullName = this.authService.getUserFullName();
    }

    // Charger les filiales et les offres
    this.loadFiliales();
    this.loadOffres();
     setTimeout(() => {
      this.initImageSlider();
    }, 0);
    this.loadStatistics();
  }

  // Slider methods
  initImageSlider() {
    this.showSlide(this.currentSlide);
    setInterval(() => this.nextSlide(), 5000);
  }

  showSlide(index: number) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0 || dots.length === 0) return;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    (slides[index] as HTMLElement).classList.add('active');
    (dots[index] as HTMLElement).classList.add('active');
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % 3;
    this.showSlide(this.currentSlide);
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + 3) % 3;
    this.showSlide(this.currentSlide);
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.showSlide(this.currentSlide);
  }


  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (filiales: Filiale[]) => {
        console.log('Filiales fetched:', filiales);
        this.filiales = filiales || [];
        this.loadOffresByFiliale();
      },
      error: (err) => {
        console.error('Error fetching filiales:', err);
        this.filiales = [];
      }
    });
  }

  loadOffres(): void {
   this.offreEmploiService.getAll().subscribe({
  next: (offres: OffreEmploi[]) => {
    console.log('Offres fetched:', offres);
    this.offres = offres || [];
    // Assurer que chaque offre a les données de la filiale
    this.offres.forEach((offre) => {
      if (!offre.filiale && offre.idFiliale) {
        this.filialeService.getFiliale(offre.idFiliale).subscribe({
          next: (filiale: Filiale) => {
            offre.filiale = filiale;
          },
          error: (err) => {
            console.error(`Error fetching filiale for offre ${offre.idOffreEmploi}:`, err);
          }
        });
      }
    });
    this.loadOffresByFiliale();
  },
  error: (err) => {
    console.error('Error fetching offres:', err);
    this.offres = [];
  }
});
  }

  loadOffresByFiliale(): void {
    if (this.filiales.length === 0 || this.offres.length === 0) {
      this.offresByFiliale = [];
      return;
    }

    // Map offres to filiales
    const offresByFilialeMap: { [key: string]: OffreEmploi[] } = {};
    this.offres.forEach(offre => {
      if (offre.idFiliale) {
        if (!offresByFilialeMap[offre.idFiliale]) {
          offresByFilialeMap[offre.idFiliale] = [];
        }
        offresByFilialeMap[offre.idFiliale].push(offre);
      }
    });

    // Create the offresByFiliale array
    this.offresByFiliale = this.filiales
      .map(filiale => ({
        filiale,
        offres: offresByFilialeMap[filiale.idFiliale] || [],
        offreCount: (offresByFilialeMap[filiale.idFiliale] || []).length
      }))
      .filter(item => item.offreCount > 0);

    console.log('Offres by filiale computed:', this.offresByFiliale);
  }

  getFeaturedJobs(offres: OffreEmploi[]): OffreEmploi[] {
    const sortedOffres = [...offres].sort((a, b) => {
      const dateA = a.datePublication ? new Date(a.datePublication).getTime() : 0;
      const dateB = b.datePublication ? new Date(b.datePublication).getTime() : 0;
      return dateB - dateA;
    });
    return sortedOffres.slice(0, 4);
  }

  get filteredOffres(): OffreEmploi[] {
    if (!this.searchTerm) {
      return this.getFeaturedJobs(this.offres);
    }
    const term = this.searchTerm.toLowerCase();
    return this.offres.filter(offre =>
      (offre.Titreoffre?.toLowerCase().includes(term) || false) ||
      (offre.descriptionoffre?.toLowerCase().includes(term) || false) ||
      (offre.filiale?.nom?.toLowerCase().includes(term) || false)
    );
  }

  timeSince(date: any): string {
    if (!date) return 'Inconnu';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
    interval = seconds / 2592000;
    if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
    interval = seconds / 86400;
    if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
    interval = seconds / 3600;
    if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
    interval = seconds / 60;
    if (interval > 1) return `il y a ${Math.floor(interval)} minutes`;
    return `il y a ${Math.floor(seconds)} secondes`;
  }

  formatDate(date: any): string {
    if (!date) return 'Date inconnue';
    try {
      const parsedDate = new Date(date);
      return parsedDate.toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de format de date:', error);
      return 'Date inconnue';
    }
  }

  getImageUrl(photo: string | undefined): string {
    if (!photo) return '../../../assets/User/img/logo/poulina.jpg';
    return photo.startsWith('http') ? photo : `${environment.apiBaseUrl}/Uploads/${photo}`;
  }

  onLogout(): void {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }

  navigateToFilialeOffres(filialeId: string): void {
    this.router.navigate(['/job-list'], { queryParams: { idFiliale: filialeId } });
  }

  // Section for company values
  companyValues = [
    {
      title: "Innovation Continue",
      description: "Nous favorisons un environnement où la créativité et l'expérimentation sont encouragées pour transformer les défis en opportunités.",
      icon: "fas fa-lightbulb"
    },
    {
      title: "Intégrité et Confiance",
      description: "Nous agissons avec honnêteté, transparence et éthique dans toutes nos interactions, bâtissant des relations durables.",
      icon: "fas fa-shield-alt"
    },
    {
      title: "Développement Humain",
      description: "Nous investissons dans le potentiel de nos collaborateurs, en offrant des opportunités de formation et de croissance professionnelle.",
      icon: "fas fa-seedling"
    },
    {
      title: "Excellence Opérationnelle",
      description: "Nous nous engageons à atteindre les plus hauts standards de qualité et d'efficacité dans toutes nos activités.",
      icon: "fas fa-cogs"
    },
    {
      title: "Esprit d'Équipe",
      description: "Nous valorisons la collaboration, le respect mutuel et la diversité des idées pour atteindre nos objectifs communs.",
      icon: "fas fa-people-carry"
    },
    {
      title: "Engagement Durable",
      description: "Nous œuvrons pour un impact positif sur l'environnement et les communautés, en intégrant le développement durable dans notre stratégie.",
      icon: "fas fa-leaf"
    }
  ];

  // Section for why join us (career advantages)
  careerAdvantages = [
    {
      title: "Opportunités de Croissance",
      description: "Des parcours de carrière clairs et des programmes de mentorat pour vous aider à atteindre votre plein potentiel.",
      icon: "fas fa-chart-line"
    },
    {
      title: "Environnement Dynamique",
      description: "Travaillez dans un environnement collaboratif, inclusif et stimulant où vos idées sont valorisées.",
      icon: "fas fa-users-cog"
    },
    {
      title: "Responsabilité Sociale",
      description: "Participez à des initiatives citoyennes et contribuez au développement durable de la société.",
      icon: "fas fa-hand-holding-heart"
    }
  ];

  // New: Testimonials data
  testimonials = [
    {
      quote: "Travailler chez Poulina, c'est l'opportunité de grandir dans un environnement stimulant et diversifié. Chaque jour est un nouveau défi!",
      author: "Ahmed Ben Salem",
      title: "Chef de Projet, Poulina Technologies",
      avatar: "https://via.placeholder.com/150/007bff/ffffff?text=AS"
    },
    {
      quote: "L'engagement de Poulina envers l'innovation et le bien-être de ses employés est remarquable. Je suis fier de faire partie de cette aventure.",
      author: "Fatma Zahra",
      title: "Ingénieure Agronome, Poulina Agroalimentaire",
      avatar: "https://via.placeholder.com/150/28a745/ffffff?text=FZ"
    },
    {
      quote: "Les opportunités de développement de carrière sont immenses. J'ai pu évoluer rapidement grâce aux programmes de formation internes.",
      author: "Mehdi Abid",
      title: "Responsable Marketing, Poulina Distribution",
      avatar: "https://via.placeholder.com/150/ffc107/ffffff?text=MA"
    }
  ];

  // Statistics loading and animation
  loadStatistics(): void {
    const statsData = {
      totalFiliales: 52,
      totalCollaborateurs: 10000,
      totalEmployees: 5000
    };

    this.animateCounter('totalFiliales', statsData.totalFiliales, 2000);
    this.animateCounter('totalCollaborateurs', statsData.totalCollaborateurs, 2000);
    this.animateCounter('totalEmployees', statsData.totalEmployees, 2000);
  }

  animateCounter(targetProperty: 'totalFiliales' | 'totalCollaborateurs' | 'totalEmployees', targetValue: number, duration: number): void {
    const startValue = 0;
    let startTime: DOMHighResTimeStamp | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;
      const currentValue = Math.min(targetValue, startValue + progress * (targetValue - startValue));

      (this as any)[targetProperty] = Math.floor(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        (this as any)[targetProperty] = targetValue;
      }
    };

    requestAnimationFrame(animate);
  }

  @HostListener('window:scroll', ['$event'])
  checkAndStartCounters() {
    if (this.counterTriggered) return;

    const statisticsSection = document.querySelector('.statistics-area');
    if (statisticsSection) {
      const rect = statisticsSection.getBoundingClientRect();
      const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);

      if (isVisible) {
        this.counterTriggered = true;
        this.loadStatistics();
      }
    }
  }
}