import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [CommonModule, RouterModule, MenuComponent], // Import the standalone component
  exports: [MenuComponent] // Export it for other modules to use
})
export class SharedModule {}