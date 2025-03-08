import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { RoleGuard } from './guards/role.guard';
import { FilialeFormComponent } from './features/filiale-form/filiale-form.component';
import { FilialeListComponent } from './features/filiale-list/filiale-list.component';
import { LayoutBackendComponent } from './layoutBackend/layout-backend/layout-backend.component';
import { FilialeDetailsComponent } from './features/filiale-details/filiale-details.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

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
    data: { role: 'Admin' },
  
  },
  { path: '**', redirectTo: '/signin', pathMatch: 'full' },

  { path: 'forbidden', component: ForbiddenComponent},
  { path: '', component: AdminOnlyComponent },
  { path: 'filiales', component: FilialeListComponent },
  { path: 'filiales/add', component: FilialeFormComponent },
  { path: 'filiales/edit/:id', component: FilialeFormComponent },
  { path: 'filiales/:id', component: FilialeDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }