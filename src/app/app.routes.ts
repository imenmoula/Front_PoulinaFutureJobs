import { FilialeDetailComponent } from './features/filiale-details/filiale-details.component';
import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { RoleGuard } from './guards/role.guard';
import { FilialeListComponent } from './features/filiale-list/filiale-list.component';
import { LayoutBackendComponent } from './layoutBackend/layout-backend/layout-backend.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { DepartmentListComponent } from './features/department-list/department-list.component';

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
    component:LayoutBackendComponent,
    canActivate: [RoleGuard],
    data: { role: 'Admin' },
    children: [
      { path: '', component: AdminOnlyComponent },
     
    ]
  },
  {path:'admin/departement',component:DepartmentListComponent},
  { path: 'admin/filiales', component: FilialeListComponent }, 

  // { path: 'admin/filiales/add', component: FilialeFormComponent },
  // { path: 'admin/filiales/edit/:id', component: FilialeFormComponent },
  { path: 'admin/filiales/:id', component: FilialeDetailComponent },


  { path: '**', redirectTo: '/signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }