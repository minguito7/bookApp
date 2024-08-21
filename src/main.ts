import { bootstrapApplication } from '@angular/platform-browser';
// src/main.ts

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component'; // Importa el componente standalone

platformBrowserDynamic()
  .bootstrapModule(AppComponent) // Arranca la aplicación con el componente standalone
  .catch(err => console.error(err));
