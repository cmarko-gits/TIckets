import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptgroup, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports : [ FormsModule , CommonModule , ReactiveFormsModule , MatCardModule,    MatCardModule,
    MatFormFieldModule,  // Dodaj ovo
    MatInputModule,      // Dodaj ovo
    MatButtonModule ,
    MatSelectModule,
    MatOptionModule,]
})
export class RegisterComponent {
  registerForm: FormGroup;
    genreList: string[] = [
      'Fantazija',
      'Romantični',
      'Drama',
      'Mjuzikl',
      'Romantični/ljubavni',
      'Akcija',
      'Komedija ',
      'Triler',
      'Avantura' ,
      'Animirani' ,
      'Naučna fantastika' , 
      'Horor'
    ];
    
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      favoriteGenres: [[]]
    });
    
  }

  register() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;

      if (userData.password !== userData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      this.authService.register(userData).subscribe({
        next: () => {
          alert('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log('Registration failed: ' + err.message);
        }
      });
    }
  }
}
