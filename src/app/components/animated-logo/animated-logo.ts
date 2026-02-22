import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';

// --- CONFIGURACIÓN Y UTILIDADES (Fuera de la clase porque son constantes) ---
const CONFIGURACION = {
  cantidadLineas: 25,
  velocidadBase: 2,
  dispersionY: 60,
  radioActivacion: 160,
};

const PALETA = [
  [255, 255, 255], [255, 255, 255], [255, 255, 255],
  [220, 255, 225], [180, 230, 185], [76, 235, 91],
];

const aleatorio = (a: number, b: number) => a + Math.random() * (b - a);
const aleatorioInt = (a: number, b: number) => Math.floor(aleatorio(a, b + 1));

@Component({
  selector: 'app-animated-logo',
  standalone: true,
  templateUrl: './animated-logo.html', 
  styleUrls: ['./animated-logo.css']   
})

export class AnimatedLogoComponent implements AfterViewInit, OnDestroy {
  // Capturamos los elementos del HTML
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('logoRef') logoRef!: ElementRef<HTMLImageElement>;
  @ViewChild('contenedorRef') contenedorRef!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D | null;
  private pool: any[] = [];
  private bursts: any[] = [];
  private ancho = 0;
  private alto = 0;
  private logoY = 0;
  private logoH = 0;
  private logoX = 0;
  private rafId = 0;
  private enfriamiento = false;
  
  private resizeObserver!: ResizeObserver;
  private mouseMoveListener!: (e: MouseEvent) => void;

  // Inyectamos NgZone para que la animación no sature a Angular
  constructor(private ngZone: NgZone) {}

  // Se ejecuta cuando el HTML del componente ya cargó en pantalla
  ngAfterViewInit(): void {
    const logoElement = this.logoRef.nativeElement;
    if (logoElement.complete) {
      this.iniciarSistema();
    } else {
      logoElement.addEventListener('load', () => this.iniciarSistema(), { once: true });
    }
  }

  // Se ejecuta cuando el componente se destruye (evita fugas de memoria)
  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.mouseMoveListener && this.contenedorRef) {
      this.contenedorRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
    }
  }

  private iniciarSistema(): void {
    this.inicializarCanvas();
    this.configurarEventos();

    // Corremos el bucle de Canvas "por fuera" de Angular para máximo rendimiento
    this.ngZone.runOutsideAngular(() => {
      this.bucle();
    });
  }

  private inicializarCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const logo = this.logoRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const rect = this.contenedorRef.nativeElement.getBoundingClientRect();
    this.ancho = rect.width;
    this.alto = rect.height;

    canvas.width = Math.round(this.ancho * dpr);
    canvas.height = Math.round(this.alto * dpr);
    this.ctx?.scale(dpr, dpr);

    const rectLogo = logo.getBoundingClientRect();
    const rectCanvas = canvas.getBoundingClientRect();
    this.logoY = rectLogo.top - rectCanvas.top;
    this.logoH = rectLogo.height;
    this.logoX = rectLogo.left - rectCanvas.left + rectLogo.width / 2;

    this.pool = this.crearPool(CONFIGURACION.cantidadLineas);
    this.pool.forEach((d) => {
      this.reiniciarDestello(d);
      d.x = aleatorio(-d.longitud, this.ancho + d.longitud);
    });
  }

  private bucle = (): void => {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.ancho, this.alto);

    for (const d of this.pool) {
      if (!d.activo) continue;
      this.dibujarDestello(this.ctx, d);
      d.x += d.velocidad;
      if (d.x > d.xMax || d.x + d.longitud < d.xMin) {
        this.reiniciarDestello(d);
      }
    }

    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      this.dibujarDestello(this.ctx, b);
      b.x += b.velocidad;
      b.alpha -= 0.04;
      if (b.alpha <= 0 || b.x > b.xMax || b.x + b.longitud < b.xMin) {
        this.bursts.splice(i, 1);
      }
    }

    this.rafId = requestAnimationFrame(this.bucle);
  }

  private reiniciarDestello(d: any): void {
    d.longitud = aleatorio(40, this.ancho * 0.55);
    d.grosor = aleatorio(0.5, 8);
    d.alpha = aleatorio(0.15, 0.9);
    d.color = PALETA[aleatorioInt(0, PALETA.length - 1)];

    const yMin = this.logoY - CONFIGURACION.dispersionY;
    const yMax = this.logoY + this.logoH + CONFIGURACION.dispersionY;
    d.y = aleatorio(Math.max(0, yMin), Math.min(this.alto, yMax));

    const tipoOrigen = Math.random();
    if (tipoOrigen < 0.35) {
      d.velocidad = aleatorio(0.8, 4.5) * CONFIGURACION.velocidadBase;
      d.x = -d.longitud;
    } else if (tipoOrigen < 0.70) {
      d.velocidad = -aleatorio(0.8, 4.5) * CONFIGURACION.velocidadBase;
      d.x = this.ancho + d.longitud;
    } else {
      const dir = Math.random() > 0.5 ? 1 : -1;
      d.velocidad = aleatorio(0.8, 4.5) * CONFIGURACION.velocidadBase * dir;
      d.x = aleatorio(d.longitud * 0.2, this.ancho - d.longitud * 0.2);
    }

    d.xMax = this.ancho + d.longitud + 10;
    d.xMin = -d.longitud - 10;
    d.activo = true;
  }

  private crearPool(cantidad: number): any[] {
    return Array.from({ length: cantidad }, () => ({
      x: 0, y: 0, longitud: 100, grosor: 1, velocidad: 1, alpha: 1, color: [255, 255, 255], activo: false, xMax: 0, xMin: 0,
    }));
  }

  private dibujarDestello(ctx: CanvasRenderingContext2D, d: any): void {
    const [r, g, b] = d.color;
    const x0 = d.x;
    const x1 = d.x + d.longitud;
    if (Math.abs(x1 - x0) < 0.5) return;

    const grad = ctx.createLinearGradient(x0, 0, x1, 0);
    if (d.velocidad > 0) {
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${(d.alpha * 0.6).toFixed(3)})`);
      grad.addColorStop(0.85, `rgba(${r},${g},${b},${d.alpha.toFixed(3)})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    } else {
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.15, `rgba(${r},${g},${b},${d.alpha.toFixed(3)})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${(d.alpha * 0.6).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    }

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = d.grosor;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, d.y);
    ctx.lineTo(x1, d.y);
    ctx.stroke();

    if (d.grosor > 3) {
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = d.grosor * 3.5;
      ctx.beginPath();
      ctx.moveTo(x0, d.y);
      ctx.lineTo(x1, d.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  private configurarEventos(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.ngZone.runOutsideAngular(() => {
        cancelAnimationFrame(this.rafId);
        this.inicializarCanvas();
        this.bucle();
      });
    });
    this.resizeObserver.observe(this.contenedorRef.nativeElement);

    this.mouseMoveListener = (e: MouseEvent) => {
      if (this.enfriamiento) return;
      const rect = this.contenedorRef.nativeElement.getBoundingClientRect();
      const centroX = rect.left + rect.width / 2;
      const centroY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centroX, e.clientY - centroY);
      
      if (dist < CONFIGURACION.radioActivacion) {
        this.ngZone.run(() => this.activarImpacto());
      }
    };
    this.contenedorRef.nativeElement.addEventListener('mousemove', this.mouseMoveListener);
  }

  private activarImpacto(): void {
    if (this.enfriamiento) return;
    this.enfriamiento = true;
    const logo = this.logoRef.nativeElement;

    logo.classList.remove('alh-impacto');
    void logo.offsetWidth; 
    logo.classList.add('alh-impacto');

    logo.addEventListener('animationend', () => {
      logo.classList.remove('alh-impacto');
    }, { once: true });

    const origenY = this.logoY + this.logoH / 2;
    for (let i = 0; i < 10; i++) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      const longitud = aleatorio(60, this.ancho * 0.4);
      this.bursts.push({
        x: this.logoX - (dir === 1 ? 0 : longitud),
        y: origenY + aleatorio(-30, 30),
        longitud,
        grosor: aleatorio(1, 10),
        velocidad: aleatorio(5, 12) * dir,
        alpha: aleatorio(0.7, 1.0),
        color: [255, 255, 255],
        activo: true,
        xMax: this.ancho + longitud + 10,
        xMin: -longitud - 10,
      });
    }

    setTimeout(() => { this.enfriamiento = false; }, 1000);
  }
}