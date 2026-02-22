import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatedLogoComponent } from '../animated-logo/animated-logo';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, AnimatedLogoComponent],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent implements OnInit, OnDestroy {
  
  slides = [
    { title: 'Creamos <br><span class="text-green">Software</span><br> que <span class="text-green">Escala</span>', desc: 'Desarrollamos aplicaciones web, móviles y cloud robustas, seguras y listas para crecer a largo plazo.' },
    { title: 'Transformamos <br><span class="text-green">Ideas</span><br> en <span class="text-green">Soluciones Digitales</span>', desc: 'Convertimos tu visión en software funcional, innovador y alineado a los objetivos de tu negocio.' },
    { title: 'Potenciamos tu <br><span class="text-green">Negocio</span><br> con <span class="text-green">Tecnología moderna</span>', desc: 'Automatización, sistemas a medida y soluciones modernas que optimizan procesos y mejoran resultados.' }
  ];

  currentSlide = 0;
  intervalId: any;
  private observer: IntersectionObserver | null = null;

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef) {}

  ngOnInit() {
    this.setupObserver();
  }

  setupObserver() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startSlider();
          } else {
            this.stopSlider();
          }
        });
      }, { threshold: 0.2 }); 
      this.observer.observe(this.el.nativeElement);
      
    } else {
      this.startSlider();
    }
  }

  ngOnDestroy() {
    this.stopSlider();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  startSlider() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.cdr.detectChanges(); 
      }, 4000); 
    }
  }

  stopSlider() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; 
    }
  }

  setSlide(index: number) {
    this.currentSlide = index;
    this.stopSlider();
    this.startSlider();
  }
}