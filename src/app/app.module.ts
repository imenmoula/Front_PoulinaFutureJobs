import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecruteurOnlyComponent } from './authorizeDemo/recruteur-only/recruteur-only.component';
import { CandidateOnlyComponent } from './authorizeDemo/candidate-only/candidate-only.component';
import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { GestionDepartementsComponent } from './gestion-departements/gestion-departements.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    DashboardComponent,
    RecruteurOnlyComponent,
    CandidateOnlyComponent,
    AdminOnlyComponent,
    GestionDepartementsComponent
  ],
  imports: [
    BrowserModule, // Includes CommonModule for *ngIf, [ngClass]
    FormsModule,   // For [(ngModel)]
    AppRoutingModule
  ],
  providers: [AuthGuard, RoleGuard], // Guards as providers
  bootstrap: [AppComponent]
})
export class AppModule { }