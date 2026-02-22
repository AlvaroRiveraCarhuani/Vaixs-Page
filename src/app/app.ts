import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero'; 
import { HeaderComponent } from './components/header/header';
import { ServicesComponent } from './components/services/services'; 
import { ProductsComponent } from './components/products/products';
import { FooterComponent } from './components/footer/footer';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, ServicesComponent,ProductsComponent, FooterComponent], 
  templateUrl: './app.html'
})
export class AppComponent {
  title = 'vaixs-landing';
}