import { AuthService } from './shared/services/auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { GestionDepartementsComponent } from './gestion-departements/gestion-departements.component';
import { AuthGuard, authGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LayoutBackendComponent } from './layoutBackend/layout-backend/layout-backend.component';
import { HeaderComponent } from './layoutBackend/header/header.component';
import { SidebarComponent } from './layoutBackend/sidebar/sidebar.component';
import { ContentComponent } from './layoutBackend/content/content.component';
import { FooterComponent } from './layoutBackend/footer/footer.component';
import { FilialeListComponent } from './features/filiale-list/filiale-list.component';
import { RouterModule } from '@angular/router';


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
    FilialeListComponent
  ],
  imports: [
    BrowserModule, // Includes CommonModule for *ngIf, [ngClass]
    FormsModule,   // For [(ngModel)]
    AppRoutingModule
  ],
  providers: [AuthService,RoleGuard,authGuard], // Guards as providers
  bootstrap: [AppComponent]
})
export class AppModule { }