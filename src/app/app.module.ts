import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { GestionDepartementsComponent } from './gestion-departements/gestion-departements.component';
import { AuthGuard } from './guards/auth.guard';
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

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    RecruteurOnlyComponent,
    CandidateOnlyComponent,
    AdminOnlyComponent,
    GestionDepartementsComponent,
    LayoutBackendComponent,
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    FooterComponent,
    FilialeFormComponent,
    FilialeListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthService, RoleGuard, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }