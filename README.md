# Streamflow Music Frontend

Este proyecto es una aplicación frontend desarrollada en Angular, diseñada bajo principios de Clean Architecture para mantener una estructura escalable, mantenible y desacoplada. Utiliza Angular Material, TailwindCSS, Supabase y SSR (Server Side Rendering) para ofrecer una experiencia moderna y eficiente.

## Tabla de Contenidos

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Comandos Útiles](#comandos-útiles)
- [Testing](#testing)
- [Linting y Formato](#linting-y-formato)
- [Documentación](#documentación)
- [Recursos adicionales](#recursos-adicionales)

---

## Características

- **Angular 20+** con SSR (Angular Universal)
- **Clean Architecture**: separación clara de capas (domain, infrastructure, presentation, etc.)
- **Angular Material** y **TailwindCSS** para UI moderna y flexible
- **Supabase** como backend as a service
- **Compodoc** para documentación automática
- **ESLint** y **Prettier** para calidad y formato de código
- **Husky** y **lint-staged** para hooks de pre-commit

## Estructura del Proyecto

```
src/app/
│
├── components/         # Componentes reutilizables
├── config/             # Configuración de la app
├── domain/             # Entidades y lógica de negocio
├── infrastructure/     # Adaptadores y servicios externos
├── models/             # Modelos de datos
├── pages/              # Vistas principales/páginas
├── presentation/       # Componentes de presentación
├── routes/             # Definición de rutas
├── services/           # Servicios de aplicación
├── shared/             # Utilidades y componentes compartidos
│
├── app.config.ts
├── app.routes.ts
├── app.ts
└── ...
```

## Arquitectura

La aplicación sigue los principios de **Clean Architecture**, asegurando una separación clara de responsabilidades:

- **domain/**: Contiene entidades, lógica de negocio y contratos. No depende de frameworks ni de detalles de infraestructura.
- **infrastructure/**: Implementa servicios externos, adaptadores y detalles tecnológicos (por ejemplo, integración con Supabase).
- **presentation/**: Componentes y vistas que gestionan la interacción con el usuario.
- **shared/**: Componentes, pipes, directivas y utilidades reutilizables en toda la app.
- **config/**: Archivos de configuración global.
- **routes/**: Definición y organización de rutas de la aplicación.
- **services/**: Servicios de aplicación que orquestan la lógica entre capas.

Esta estructura permite escalar el proyecto fácilmente, facilita el testing y promueve el desacoplamiento.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repo>
   cd streamflow_music_frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Comandos Útiles

- **Desarrollo local:**

  ```bash
  npm start
  # o
  ng serve
  ```

  Accede a [http://localhost:4200](http://localhost:4200)

- **Build producción:**

  ```bash
  npm run build
  ```

- **SSR (Server Side Rendering):**

  ```bash
  npm run build
  npm run serve:ssr:b
  ```

- **Linting:**
  ```bash
  npm run lint
  ```

## Testing

- **Unit tests:**

  ```bash
  npm test
  ```

- **End-to-end (e2e):**
  > Angular CLI no incluye framework e2e por defecto. Puedes integrar Cypress, Playwright u otro de tu preferencia.

## Linting y Formato

- **Lint y Prettier:**  
  El proyecto usa ESLint y Prettier, integrados con Husky y lint-staged para asegurar calidad y formato en cada commit.

## Documentación

- **Compodoc:**  
  Genera documentación automática del código:
  ```bash
  npm run compodoc:build-and-serve
  ```
  Accede a la documentación en [http://localhost:8080](http://localhost:8080)

## Recursos adicionales

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Documentación oficial de Angular](https://angular.dev/)
- [Compodoc](https://compodoc.app/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

> Para más detalles sobre la arquitectura y decisiones técnicas, consulta la [documentación en DeepWiki](https://deepwiki.com/SteveSant26/streamflow_music_frontend/1-overview).
