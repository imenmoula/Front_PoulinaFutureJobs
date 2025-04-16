import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  

import { ReactiveFormsModule } from '@angular/forms';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';  // Import de HttpClientModule

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
 import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { RoleGuard } from './guards/role.guard';
import { LayoutBackendComponent } from './layoutBackend/layout-backend/layout-backend.component';
import { HeaderComponent } from './layoutBackend/header/header.component';
import { SidebarComponent } from './layoutBackend/sidebar/sidebar.component';
import { ContentComponent } from './layoutBackend/content/content.component';
import { FooterComponent } from './layoutBackend/footer/footer.component';
import { FilialeFormComponent } from './features/filiale-form/filiale-form.component';
import { FilialeListComponent } from './features/filiale-list/filiale-list.component';
import { AppRoutingModule } from './app.routes';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './guards/auth.guard'; // Renamed to camelCase for consistency
import { AuthInterceptor } from './shared/auth.interceptor';
import { CommonModule } from '@angular/common';
import { FilialeDetailsComponent } from './features/filiale-details/filiale-details.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DepartementDetailsComponent } from './features/departement-details/departement-details.component';
import { DepartmentListComponent } from './features/department-list/department-list.component';
import { DepartementAddComponent } from './features/departement-add/departement-add.component';
import { MatButtonModule } from '@angular/material/button';
import { DepartementFormComponent } from './features/departement-form/departement-form.component';
import { RoleDetailsComponent } from './features/role-details/role-details.component';
import { RoleFormComponent } from './features/role-form/role-form.component';
import { RoleListComponent } from './features/role-list/role-list.component';
import { RouterModule } from '@angular/router';
import { AdminListComponent } from './features/admin-list/admin-list.component';
import { CandidateListComponent } from './features/candidate-list/candidate-list.component';
import { RecruiterListComponent } from './features/recruiter-list/recruiter-list.component';
import { RecruiterDetailsComponent } from './features/recruiter-details/recruiter-details.component';
import { OffreDetailComponent } from './interfacerecruteur/offre-detail/offre-detail.component';
import { OffreListComponent } from './interfacerecruteur/offre-list/offre-list.component';
import { OffreFormComponent } from './interfacerecruteur/offre-form/offre-form.component';
import { CandidateDetailsComponent } from './features/candidate-details/candidate-details.component';
import { JobListingComponent } from './CandidateFront/components/job-listing/job-listing.component';
import { JobDetailsComponent } from './CandidateFront/components/job-details/job-details.component';
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    RecruteurOnlyComponent,
    CandidateOnlyComponent,
    LayoutBackendComponent,
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    FooterComponent,

    FilialeFormComponent,
    FilialeListComponent,
    FilialeDetailsComponent,
    DepartementDetailsComponent,
    DepartmentListComponent,
    DepartementFormComponent,
    DepartementAddComponent,
    RoleDetailsComponent,
    RoleFormComponent,
    RoleListComponent,
    AdminListComponent,
    CandidateListComponent,
    CandidateDetailsComponent,
    RecruiterListComponent,
    RecruiterDetailsComponent,
    OffreDetailComponent,
    OffreListComponent,
    OffreFormComponent,
    ContentComponent,
    HeaderComponent,
    FooterComponent,
    JobListingComponent,
    JobDetailsComponent
   
  
],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    RouterModule ,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    
    MatCardModule, // Add this
    MatButtonModule,
    MatIconModule,
   
  ],
    
  
  providers: [
    AuthService,
    // RoleGuard,
    // AuthGuard, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
