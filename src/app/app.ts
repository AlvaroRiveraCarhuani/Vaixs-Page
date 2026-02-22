import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero'; 
import { HeaderComponent } from './components/header/header';
import { ServicesComponent } from './components/services/services'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, ServicesComponent], 
  templateUrl: './app.html'
})
export class AppComponent {
  title = 'vaixs-landing';
}