import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-header">
        <h1 class="text-3xl font-bold mb-6 text-center">Crear Cuenta</h1>
        
        <form (submit)="onRegister()" class="register-form space-y-6 ">
          <div>
            <label for="fullname" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input 
              type="text" 
              id="fullname" 
              placeholder="Tu nombre completo"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Tu email aquì"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="••••••••"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="terms" 
              class="h-4 w-4 text-black focus:ring-2 focus:ring-black border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              Acepto los <a href="#" class="text-black hover:text-gray-600">términos y condiciones</a>
            </label>
          </div>

          <div>
            <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
              Crear Cuenta
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              ¿Ya tienes una cuenta?
              <a routerLink="/login" class="font-medium text-black hover:text-gray-600 transition-colors">Inicia sesión aquí</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
      width: 100%;
      padding: 3rem 1rem;
    }

    .register-header {
      max-width: 28rem;
      width: 100%;
      background-color: white;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.6);
      border-radius: 0.5rem;
    }

    .register-form {
      margin-top: 2rem;
    }

    .register-form input[type="text"],
    .register-form input[type="email"],
    .register-form input[type="password"] {
      appearance: none;
      border-radius: 0.5rem;
      position: relative;
      display: block;
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      color: #111827;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    .register-form input[type="text"]:focus,
    .register-form input[type="email"]:focus,
    .register-form input[type="password"]:focus {
      outline: none;
      border-color: #000000;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  `]
})
export class RegisterComponent {
  
  constructor(private readonly router: Router) {}

  onRegister() {
    // Basic register functionality - navigate to home for now
    console.log('Register attempted');
    this.router.navigate(['/home']);
  }
}