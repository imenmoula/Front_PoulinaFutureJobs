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
// import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { RoleGuard } from './guards/role.guard';
import { FilialeListComponent } from './features/filiale-list/filiale-list.component';
import { LayoutBackendComponent } from './layoutBackend/layout-backend/layout-backend.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { DepartmentListComponent } from './features/department-list/department-list.component';
import { Filiale } from './Models/filiale.model';
import { DepartementDetailsComponent } from './features/departement-details/departement-details.component';
import { DepartementAddComponent } from './features/departement-add/departement-add.component';
import { FilialeFormComponent } from './features/filiale-form/filiale-form.component';
import { RoleListComponent } from './features/role-list/role-list.component';
import { RoleFormComponent } from './features/role-form/role-form.component';
import { RoleDetailsComponent } from './features/role-details/role-details.component';
// import { FilialeAddComponent } from './features/filiale-add/filiale-add.component';
import { AdminListComponent } from './features/admin-list/admin-list.component';
// import { DetailsAdminComponent } from './features/details-admin/details-admin.component';
// import { EditAdminComponent } from './features/edit-admin/edit-admin.component';
import { AddAdminComponent } from './features/add-admin/add-admin.component';
import { RecruiterListComponent } from './features/recruiter-list/recruiter-list.component';
import { RecruiterAddComponent } from './features/recruiter-add/recruiter-add.component';
import { RecruiterEditComponent } from './features/recruiter-edit/recruiter-edit.component';

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
  // {
  //   path: 'candidate',
  //   component:,
  //   canActivate: [RoleGuard],
  //   data: { role: 'Candidate' }
  // },
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
  { path: 'departement/add', component: DepartementAddComponent },
 { path: 'departement/edit/:id', component: DepartementFormComponent},
 /*gestion des filiales*/
  { path: 'admin/filiales', 
    component: FilialeListComponent
 }, 
  //  { path: 'admin/filiales/add', component: FilialeFormComponent },

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
   /*gestion des users*/
   { path: 'recruiters', component: RecruiterListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'candidates', component: CandidateListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'admins', component: AdminListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'admin/add', component: AddAdminComponent}, 
  // { path: 'admin/edit/:id', component: EditAdminComponent}, 
  // { path: 'admin/details/:id', component: DetailsAdminComponent},
/*gestion des recruteurs */
{ path: 'recruiter/list', component: RecruiterListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'recruiter/add', component: RecruiterAddComponent, canActivate: [AuthGuard] ,data: { roles: ['Admin'] } },
  { path: 'recruiter/edit/:id', component: RecruiterEditComponent, canActivate: [AuthGuard] ,data: { roles: ['Admin'] } },
  { path: 'recruiter/details/:id', component: RecruiterDetailsComponent, canActivate: [AuthGuard] ,data: { roles: ['Admin'] } },
{path:'',redirectTo:'signin',pathMatch:'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }