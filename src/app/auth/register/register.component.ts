// src/app/auth/register/register.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      DNI: ['', [Validators.required]],
      NOMBRE: ['', [Validators.required]],
      NAMEAPP: ['', [Validators.required]],
      APELLIDOS: ['', [Validators.required]],
      EMAIL: ['', [Validators.required, Validators.email]],
      PASSWORD: ['', [Validators.required]],
      FECHANAC: ['', [Validators.required]],
      DIRECCION: [''],
      ID_POBLACION: [''],
      COD_POSTAL: [''],
      SEXO: [''],
      AVATAR: [''],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  register() {
    if (this.registerForm.valid) {
      const formData = new FormData();

      Object.keys(this.registerForm.controls).forEach(key => {
        formData.append(key, this.registerForm.get(key)?.value);
      });

      if (this.selectedFile) {
        formData.append('myFile', this.selectedFile, this.selectedFile.name);
      }

      this.authService.register(formData).subscribe(response => {
        this.router.navigate(['/login']);
      }, error => {
        console.error('Error during registration:', error);
      });
    }
  }
}
