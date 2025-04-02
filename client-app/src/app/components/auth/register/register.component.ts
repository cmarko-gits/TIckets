import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports : [ FormsModule , CommonModule , ReactiveFormsModule]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required], // Izmena: umesto fullName sada je username
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
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
