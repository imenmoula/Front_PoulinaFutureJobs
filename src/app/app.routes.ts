// import { JobDetailsComponent } from './CandidateFront/components/job-details/job-details.component';
import { DetailsAdminComponent } from './features/details-admin/details-admin.component';
import { RecruiterDetailsComponent } from './features/recruiter-details/recruiter-details.component';
import { CandidateListComponent } from './features/candidate-list/candidate-list.component';
import { DepartementFormComponent } from './features/departement-form/departement-form.component';
import { AuthGuard } from './guards/auth.guard';
import { FilialeDetailsComponent } from './features/filiale-details/filiale-details.component';
import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
import { RoleGuard } from './guards/role.guard';
import { FilialeListComponent } from './features/filiale-list/filiale-list.component';
import { LayoutBackendComponent } from './layoutBackend/layout-backend/layout-backend.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { DepartmentListComponent } from './features/department-list/department-list.component';
import { DepartementDetailsComponent } from './features/departement-details/departement-details.component';
import { DepartementAddComponent } from './features/departement-add/departement-add.component';
import { FilialeFormComponent } from './features/filiale-form/filiale-form.component';
import { RoleListComponent } from './features/role-list/role-list.component';
import { RoleFormComponent } from './features/role-form/role-form.component';
import { RoleDetailsComponent } from './features/role-details/role-details.component';
import { AdminListComponent } from './features/admin-list/admin-list.component';
import { RecruiterListComponent } from './features/recruiter-list/recruiter-list.component';

import { UserFormComponent } from './features/user-form/user-form.component';
import { FilialeAddComponent } from './features/filiale-add/filiale-add.component';
import { OffreListComponent } from './interfacerecruteur/offre-list/offre-list.component';
import { CandidateDetailsComponent } from './features/candidate-details/candidate-details.component';
import { ContentComponent } from './layoutBackend/content/content.component';
import { CandidatureListComponent } from './interfacerecruteur/candidature-list/candidature-list.component';
import { ApropsComponent } from './CandidateFront/components/aprops/aprops.component';
import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { OffreDetailComponent } from './interfacerecruteur/offre-detail/offre-detail.component';
// import { OffreFormComponent } from './interfacerecruteur/offre-form/offre-form.component';
import { JobListingComponent } from './CandidateFront/components/job-listing/job-listing.component';
import { OffreFormComponent } from './interfacerecruteur/offre-form/offre-form.component';
import { JobDetailsComponent } from './CandidateFront/components/job-details/job-details.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizFormComponent } from './quiz-form/quiz-form.component';
// import { FullQuizFormComponent } from './full-quiz-form/full-quiz-form.component';
import { QuizDetailComponent } from './quiz-detail/quiz-detail.component';
import { CandidateurDetailsComponent } from './interfacerecruteur/candidateur-details/candidateur-details.component';


export const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'signup', component: RegistrationComponent },
      { path: 'signin', component: LoginComponent }
    ]
  },
  { path: 'forbidden', component: ForbiddenComponent },
  {
    path: 'candidate',
    component : CandidateOnlyComponent,
    canActivate: [RoleGuard],
    data: { role: 'Candidate' }
  },
  {
    path: 'recruiter',
    component: RecruteurOnlyComponent,
    canActivate: [RoleGuard],
    data: { role: 'Recruteur' }
  },
  {
    path: 'admin',
    component:LayoutBackendComponent,
    canActivate: [RoleGuard],
    data: { role: 'Admin' },
    children: [
      { path: '', component: AdminOnlyComponent },
     
    ]
  },
  /*gestion des departements*/
  {path:'Departements',component:DepartmentListComponent},
  {path:'Departements/details/:id',component:DepartementDetailsComponent},
  { path: 'departement/add', component: DepartementAddComponent},
 { path: 'departement/edit/:id', component: DepartementFormComponent},
 /*gestion des filiales*/
  { path: 'admin/filiales', 
    component: FilialeListComponent
 }, 
   { path: 'admin/filiales/add', component: FilialeAddComponent },

  {
    path: 'admin/filiales/:id', 
    component: FilialeDetailsComponent
  
   },
   {
    path: 'admin/filiales/edit/:id', 
    component: FilialeFormComponent,
  
   },
  /*gestion des roles*/
   { path: 'roles', component: RoleListComponent },
   { path: 'roles/add', component: RoleFormComponent },
   { path: 'roles/edit/:id', component: RoleFormComponent },
   { path: 'roles/:id', component: RoleDetailsComponent },
   /*gestion des candidats*/
   { path: 'recruiters', component: RecruiterListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'candidates', component: CandidateListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'candidate', component: CandidateListComponent },
  { path: 'candidate/form', component: UserFormComponent}, // Ajout
  { path: 'candidate/form/:id', component: UserFormComponent},
  { path: 'candidate/details/:id', component: CandidateDetailsComponent}, // Nouvelle route
  /*gestion des admins*/
  { path: 'admins', component: AdminListComponent},
  { path: 'admins/form', component: UserFormComponent},
  { path: 'admins/form/:id', component: UserFormComponent},
  { path: 'admins/details/:id', component: DetailsAdminComponent},
/*gestion des recruteurs */
{ path: 'recruiter/list', component: RecruiterListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
{ path: 'recruiter', component: RecruiterListComponent },
  { path: 'recruiter/form', component:UserFormComponent}, // Utilisation de UserFormComponent
  { path: 'recruiter/form/:id', component: UserFormComponent }, // Utilisation de UserFormComponent
  { path: 'recruiter/details/:id', component: RecruiterDetailsComponent, canActivate: [AuthGuard] ,data: { roles: ['Admin'] } },
  /*getion offre emploi*/

  
  { path: 'offres', component: OffreListComponent, canActivate: [AuthGuard] ,data: { roles: ['Recruteur'] } },
  { path: 'offres/details/:id', component: OffreDetailComponent , canActivate: [AuthGuard] ,data: { roles: ['Recruteur'] } },
  {
    path: 'offres/create',
    component: OffreFormComponent,canActivate: [AuthGuard] ,data: { roles: ['Recruteur'] }
  },
  {
    path: 'offres/update/:id',
    component: OffreFormComponent,
    canActivate: [AuthGuard] ,data: { roles: ['Recruteur'] }

  },
  /**********inerface Candidate */
  // { path: 'job-details/:id', component: JobDetailsComponent },
  { path: 'job-list', component: JobListingComponent },
  { path: 'job-details/:id', component: JobDetailsComponent },
  // {path:'/about',component:ApropsComponent ,canActivate: [AuthGuard] ,data: { roles: ['Candidate'] } }, 

  // { path: 'candidature/:offreId', component: CandidatureComponent }, // Ensure :offreId is part of the path  { path: 'candidature/:id', component: CandidateDetailsComponent },
  // { path: 'candidature/edit/:id', component: CandidatureComponent },
  { path: 'candidatures', component: CandidatureListComponent , canActivate: [AuthGuard] ,data: { roles: ['Recruteur'] } },
  { path: 'candidature/:id', component: CandidateurDetailsComponent, canActivate: [AuthGuard] ,data: { roles: ['Recruteur'] } },
  { path: 'quizzes', component: QuizListComponent },
  { path: 'quizzes/create', component: QuizFormComponent },
  // { path: 'quizzes/create-full', component: FullQuizFormComponent },
  { path: 'quizzes/:id', component: QuizDetailComponent },
  { path: 'quizzes/:id/edit', component: QuizFormComponent },
  // { path: 'quizzes/:id/edit-full', component: FullQuizFormComponent },
  // Fixed: Removed space  /**************************** */
{path:'',redirectTo:'/signin',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }