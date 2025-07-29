import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestConnectionService } from '../../services/test-connection.service';

@Component({
  selector: 'app-connection-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="connection-test">
      <h2>🔗 Prueba de Conexión con Django Backend</h2>
      
      <div class="status" [class]="statusClass">
        <h3>Estado: {{ status }}</h3>
        <p>{{ message }}</p>
      </div>

      <button (click)="testConnection()" [disabled]="testing" class="test-btn">
        {{ testing ? 'Probando...' : 'Probar Conexión' }}
      </button>

      <button (click)="showGuide()" class="guide-btn">
        📖 Mostrar Guía de Configuración
      </button>

      <div *ngIf="response" class="response">
        <h4>Respuesta del Backend:</h4>
        <pre>{{ response | json }}</pre>
      </div>

      <div class="endpoints">
        <h4>🎯 Endpoints a probar:</h4>
        <div class="endpoint-list">
          <button (click)="testEndpoint('/playlists/')" class="endpoint-btn">
            GET /api/playlists/
          </button>
          <button (click)="testEndpoint('/songs/')" class="endpoint-btn">
            GET /api/songs/
          </button>
          <button (click)="testEndpoint('/artists/')" class="endpoint-btn">
            GET /api/artists/
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .connection-test {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }

    .status {
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
    }

    .status.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .status.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .status.testing { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }

    .test-btn, .guide-btn, .endpoint-btn {
      padding: 0.75rem 1.5rem;
      margin: 0.5rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    }

    .test-btn { background: #007bff; color: white; }
    .test-btn:hover:not(:disabled) { background: #0056b3; }
    .test-btn:disabled { background: #6c757d; cursor: not-allowed; }

    .guide-btn { background: #28a745; color: white; }
    .guide-btn:hover { background: #1e7e34; }

    .endpoint-btn { background: #17a2b8; color: white; }
    .endpoint-btn:hover { background: #117a8b; }

    .response {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 5px;
      border: 1px solid #dee2e6;
    }

    .response pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .endpoint-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  `]
})
export class ConnectionTestComponent implements OnInit {
  status = 'No probado';
  message = 'Haz clic en "Probar Conexión" para verificar si Django está funcionando';
  statusClass = '';
  testing = false;
  response: any = null;

  constructor(private testService: TestConnectionService) {}

  ngOnInit() {
    // Probar conexión automáticamente al cargar
    this.testConnection();
  }

  async testConnection() {
    this.testing = true;
    this.status = 'Probando...';
    this.message = 'Conectando con Django backend...';
    this.statusClass = 'testing';
    this.response = null;

    try {
      const isConnected = await this.testService.checkDjangoServer();
      
      if (isConnected) {
        this.status = '✅ Conectado';
        this.message = 'Django backend está corriendo y respondiendo correctamente';
        this.statusClass = 'success';
      } else {
        this.status = '❌ No conectado';
        this.message = 'No se puede conectar con Django. Verifica que esté corriendo en puerto 8000';
        this.statusClass = 'error';
      }
    } catch (error) {
      this.status = '❌ Error';
      this.message = `Error: ${error}`;
      this.statusClass = 'error';
    }

    this.testing = false;
  }

  testEndpoint(endpoint: string) {
    console.log(`🔍 Probando endpoint: ${endpoint}`);
    
    this.testService.testDjangoEndpoints().playlists.subscribe({
      next: (data) => {
        console.log(`✅ Endpoint ${endpoint} funciona:`, data);
        this.response = data;
        this.status = `✅ Endpoint ${endpoint} OK`;
        this.message = 'Endpoint responde correctamente';
        this.statusClass = 'success';
      },
      error: (error) => {
        console.error(`❌ Error en endpoint ${endpoint}:`, error);
        this.response = { error: error.message };
        this.status = `❌ Endpoint ${endpoint} Error`;
        this.message = error.message;
        this.statusClass = 'error';
      }
    });
  }

  showGuide() {
    this.testService.showDjangoSetupGuide();
  }
}
