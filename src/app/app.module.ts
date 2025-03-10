import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';  // Import de HttpClientModule

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { GestionDepartementsComponent } from './gestion-departements/gestion-departements.component';
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
import { FilialeAddComponent } from './features/filiale-add/filiale-add.component';
import { FilialeDetailsComponent } from './features/filiale-details/filiale-details.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    RecruteurOnlyComponent,
    CandidateOnlyComponent,
    GestionDepartementsComponent,
    LayoutBackendComponent,
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    FooterComponent,

    FilialeFormComponent,
    FilialeListComponent,
    FilialeAddComponent,
    FilialeDetailsComponent
],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    
  ],
  providers: [
    AuthService,
    // RoleGuard,
    // AuthGuard, // Use camelCase for consistency
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
