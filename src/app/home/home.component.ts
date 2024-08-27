// src/app/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { PoblacionService } from '../services/poblacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  books: any[] = [];
  baseUrl: string = 'http://localhost:3000/';
  poblacionForm: FormGroup;
  errorMessage: string | undefined;
  isLoggedIn: boolean = false;
  userProfileImage: string | undefined;
  photoUrl: any;

  getImageUrl(imageName: string): string {
    return `${this.baseUrl}${imageName}`;
  }
  
  constructor(private sanitizer: DomSanitizer,private router: Router,private fb: FormBuilder,private bookService: BookService,private authService: AuthService, private poblacionService:PoblacionService) { 
    this.poblacionForm = this.fb.group({
      nombre: ['', [Validators.required]],

    });
  }

  ngOnInit() {
   
    this.bookService.getBooksActivos().subscribe(response => {     
         
      this.books = response.resultado;
    });

    this.checkLoginStatus();
    console.log(this.isLoggedIn);

    const token = localStorage.getItem('Bearer');
    console.log("TOKEN DEL ALMACENAMIENTO LOCAL: "+ token)
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const userId = decodedToken.decodedToken;
      this.authService.validateToken(token).subscribe(response => {
        
        const objectURL = URL.createObjectURL(response.usuarioLogged.AVATAR);
        this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(`${this.baseUrl} ${objectURL}`);
        console.log("holaa aquii: "+ this.photoUrl)
      });
    }

   

  }

  
  addPoblacion(){
    if (this.poblacionForm.valid) {
      const {nombre} = this.poblacionForm.value;
      
      this.poblacionService.addPoblicacion(nombre).subscribe({
        next: (response: any) => {
          console.log('AQUIII: ', nombre);

          // Manejar la respuesta del servidor (por ejemplo, guardar el token)
          console.log('Añadido exitosamente:', response);
          this.poblacionForm.reset();
        },
        error: (error: { error: { error: string; }; }) => {
          // Manejar el error de la API
          this.errorMessage = error.error?.error || 'Error desconocido';
        }
      });
    }
  }
  checkLoginStatus() {
    const token = localStorage.getItem('Bearer');
    console.log(token);
    if (token) {
      // Aquí podrías llamar a tu servicio para verificar el token
      this.authService.validateToken(token).subscribe({
        next: (response: {
          usuarioLogged: any; valid: boolean; 
          }) => {
          console.log(response.usuarioLogged.AVATAR);
          this.isLoggedIn = response.valid;
          if (this.isLoggedIn) {
            // Obtener la imagen de perfil del usuario (esto puede variar según tu implementación)
            this.userProfileImage = response.usuarioLogged.AVATAR; // Cambia esto por la URL de la imagen del perfil
          }
        },
        error: () => {
          this.isLoggedIn = false;
        }
      });
    }
  }
  logout() {
    console.log("Logout button clicked!");
    this.isLoggedIn = false;
    // Redireccionar a la página de login
    this.authService.logout();
    this.router.navigate(['/']);
    
  }

  isLogged() {
    return this.authService.isLoggedIn;
  }

  


}
function base64UrlDecode(str: string): string {
  // Reemplazar caracteres específicos de URL
  str = str.replace(/-/g, '+').replace(/_/g, '/');

  // Decodificar base64
  const decodedStr = atob(str);

  // Decodificar URI
  return decodeURIComponent(
    decodedStr
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

export function jwt_decode(token: string): any {
  try {
    // Dividir el token en sus tres partes
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('El token JWT no tiene el formato adecuado');
    }

    // Decodificar la parte del payload
    const payload = parts[1];
    const decodedPayload = base64UrlDecode(payload);

    // Parsear el payload a un objeto JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}


