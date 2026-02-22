import { Component } from '@angular/core';
import { AnimatedLogoComponent } from '../animated-logo/animated-logo';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AnimatedLogoComponent],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent {}