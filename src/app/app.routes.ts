// import { Component } from '@angular/core';
// import { Routes } from '@angular/router';
// import { UserComponent } from './user/user.component';
// import { RegistrationComponent } from './user/registration/registration.component';
// import { LoginComponent } from './user/login/login.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
// import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
// import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
// import { RoleGuard } from './guards/role.guard';

// export const routes: Routes = [
//     {path:'',redirectTo:'/signin',pathMatch:'full'},
//     {path:'',component:UserComponent,
//     children:[
//         {path:'signup',component:RegistrationComponent},
//         {path:'signin',component:LoginComponent},
//     ]

//  } ,
// {path:'dashboard',component:DashboardComponent,
//     canActivate:[authGuard]}

//     { 
//       path: 'candidate', 
//       component: CandidateOnlyComponent, 
//       canActivate: [RoleGuard], 
//       data: { role: 'Candidate' } 
//     },
//     { 
//       path: 'recruiter', 
//       component: RecruteurOnlyComponent, 
//       canActivate: [RoleGuard], 
//       data: { role: 'Recruteur' } 
//     },
//     { 
//       path: 'admin', 
//       component: AdminOnlyComponent, 
//       canActivate: [RoleGuard], 
//       data: { role: 'Admin' } 
//     },

// ];
import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  // Redirection par défaut vers /signin
  { path: '', redirectTo: '/signin', pathMatch: 'full' },

  // Routes pour les utilisateurs (signup et signin)
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'signup', component: RegistrationComponent },
      { path: 'signin', component: LoginComponent }
    ]
  },

  // Route pour le tableau de bord (protégée par RoleGuard, rôle non spécifié ici)
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Routes protégées par rôle
  {
    path: 'candidate',
    component: CandidateOnlyComponent,
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
    component: AdminOnlyComponent,
    canActivate: [RoleGuard],
    data: { role: 'Admin' }
  },

  // Route pour les chemins non trouvés
  { path: '**', redirectTo: '/signin' }
];
