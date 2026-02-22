import { Component } from '@angular/core';
import { AnimatedLogoComponent } from '../animated-logo/animated-logo';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AnimatedLogoComponent], // <-- Conectamos el logo
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'] // <-- Cambiar a .css
})
export class HeroComponent {}