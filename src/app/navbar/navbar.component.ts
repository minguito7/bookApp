import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de importar tu servicio de autenticación

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userProfileImage: string | null = null;

  constructor(private authService: AuthService) {
    this.checkLoginStatus();
   }

  ngOnInit(): void {
    this.checkLoginStatus();
    console.log(this.isLoggedIn);
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
    this.authService.logout();
  }

  isLogged() {
    return this.authService.isLoggedIn;
  }

}
