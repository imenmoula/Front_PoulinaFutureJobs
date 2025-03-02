
import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard'; // Vous devrez aussi le créer en standalone
import { GestionDepartementsComponent } from './gestion-departements/gestion-departements.component';

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
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
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
  { path: '**', redirectTo: '/signin' },
  { path: 'gestion-departements', component: GestionDepartementsComponent }
];