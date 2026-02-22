import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroComponent], 
  templateUrl: './app.html'
})
export class AppComponent {
  title = 'vaixs-landing';
}