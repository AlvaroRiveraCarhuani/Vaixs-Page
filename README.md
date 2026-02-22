# Vaixs Virtual Solutions — Landing Page Oficial 🚀

[![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)](https://nodejs.org)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-purple?logo=reactivex)](https://rxjs.dev)
[![Vitest](https://img.shields.io/badge/Vitest-4-yellow?logo=vitest)](https://vitest.dev)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

Repositorio oficial del sitio web principal de **Vaixs Virtual Solutions**. Construido como una **Single Page Application (SPA)** de alto rendimiento, sin dependencias de frameworks CSS pesados — solo CSS3/SCSS nativo — para garantizar tiempos de carga mínimos y una experiencia de usuario fluida.

---

## 📋 Tabla de Contenidos

- [Tech Stack](#-tech-stack)
- [Primeros Pasos](#-primeros-pasos)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Docker — Construcción, Pruebas y Producción](#-docker--construcción-pruebas-y-producción)
- [Scripts Disponibles](#-scripts-disponibles)

---

## 🛠️ Tech Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Angular (Standalone) | 21 | Framework principal |
| TypeScript | 5.9 | Lenguaje base |
| CSS3 / SCSS | — | Estilos Mobile-First nativos |
| RxJS | 7.8 | Manejo reactivo de estado |
| Vitest | 4 | Testing unitario |
| Docker + Nginx | latest | Build multi-stage y despliegue |

> **¿Por qué sin Bootstrap/Tailwind?** Optamos por CSS nativo para eliminar kilobytes innecesarios del bundle final y tener control total sobre el rendimiento en dispositivos de gama media-baja.

---

## 🚀 Primeros Pasos

### Prerequisitos

Asegúrate de tener instalado en tu máquina (se recomienda Linux — Fedora/Ubuntu):

- [Node.js v22+](https://nodejs.org)
- [npm v10+](https://npmjs.com)
- [Docker](https://docs.docker.com/get-docker/) *(solo para producción)*

### Instalación y desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/vaixs/landing-page.git
cd landing-page

# 2. Instalar dependencias (instalación limpia basada en package-lock.json)
npm ci

# 3. Levantar el servidor de desarrollo
npx ng serve
```

La aplicación estará disponible en **`http://localhost:4200/`** con hot-reload activado.

---

## 🗂️ Arquitectura del Proyecto

El proyecto está completamente modularizado en componentes standalone de Angular. A continuación se describe la estructura principal:

```
src/
└── app/
    └── components/
        ├── hero/          → Slider principal de la página de inicio
        ├── services/      → Tarjetas de "Lo Que Hacemos"
        └── products/      → Sistemas de Ventas, Torneos, etc.
```

### Componentes Clave

**`hero/hero.ts` — Slider Principal**
Contiene los textos dinámicos del encabezado. Utiliza `IntersectionObserver` para pausar automáticamente la rotación de textos cuando el componente sale del viewport, ahorrando memoria y ciclos de CPU innecesarios al cliente.

**`services/` — Servicios**
Tarjetas que describen la oferta de valor de Vaixs. Para agregar o editar un servicio, modifica el array de datos en el componente correspondiente.

**`products/` — Productos**
Tarjetas de productos como Sistemas de Ventas, Torneos, etc. Las tarjetas alternan su dirección mediante la clase CSS `.reverse` y usan funciones dinámicas (`clamp`, `word-break`) para garantizar legibilidad en pantallas móviles pequeñas sin desbordamientos.

---

## 🐳 Docker — Construcción, Pruebas y Producción

Utilizamos Docker para empaquetar la aplicación y simular el entorno exacto de producción (Nginx). Esto permite que cualquier desarrollador pueda verificar la versión final compilada en su propia máquina **antes de subirla a la nube**, asegurando que lo que se prueba localmente es idéntico a lo que se despliega.

> **⚠️ Importante:** Docker **no reemplaza** a `ng serve` para el desarrollo activo del día a día. Úsalo exclusivamente para validar el build final o simular producción. Para escribir código y ver cambios en tiempo real, usa siempre el flujo de [desarrollo local](#-primeros-pasos).

### 🧪 Construcción y Pruebas en Local

```bash
# 1. Construir la imagen de producción (Multi-stage build)
docker build -t vaixs-landing-prod .

# 2. Levantar el contenedor en segundo plano
docker run -d -p 8080:80 --name vaixs-web vaixs-landing-prod
```

La aplicación empaquetada y optimizada estará sirviendo en **`http://localhost:8080/`**.

> **💡 Tip de mantenimiento:**
> Para detener el contenedor usa `docker stop vaixs-web`.
> Para eliminarlo y liberar el puerto usa `docker rm vaixs-web`.

### ☁️ Despliegue en Producción (Nube)

El mismo comando `docker build` genera la imagen lista para subir a cualquier registro de contenedores (Docker Hub, GitHub Container Registry, etc.) y desplegar en tu servidor o plataforma cloud. El archivo `nginx.conf` incluido ya maneja correctamente el enrutamiento interno de Angular (SPA fallback) sin configuración adicional.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm ci` | Instalación limpia de dependencias |
| `npx ng serve` | Servidor de desarrollo con hot-reload |
| `npx ng build` | Build de producción optimizado |
| `npx ng test` | Ejecutar suite de tests con Vitest |
| `docker build -t vaixs-landing-prod .` | Construir imagen Docker de producción |

---
