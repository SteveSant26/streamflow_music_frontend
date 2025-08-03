import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';


interface TermsSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  content: string;
  highlights?: string[];
  warning?: string[];
}

@Component({
  selector: 'app-terms-and-condition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-and-condition.html',
  styleUrl: './terms-and-condition.css'
})
export class TermsAndCondition {
  lastUpdated: string;
  sections: TermsSection[] = [];

  constructor(
    private readonly router: Router,
    private readonly location: Location
  ) {
    this.lastUpdated = '1 de Agosto de 2025';
    this.initializeSections();
  }

  private initializeSections(): void {
    this.sections = [
      {
        id: 'acceptance',
        title: '1. Aceptación de Términos',
        icon: 'assignment',
        color: 'blue',
        content: 'Al acceder y utilizar StreamFlow Music, usted acepta cumplir con estos Términos y Condiciones de Servicio. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestro servicio.',
        highlights: [
          'Estos términos se aplican a todos los usuarios del servicio',
          'Los términos pueden ser actualizados periódicamente',
          'El uso continuado implica aceptación de las modificaciones'
        ]
      },
      {
        id: 'service',
        title: '2. Descripción del Servicio',
        icon: 'music_note',
        color: 'green',
        content: 'StreamFlow Music es una plataforma de streaming de música que ofrece acceso a millones de canciones, álbumes y playlists. Proporcionamos diferentes niveles de servicio según el plan de suscripción.'
      },
      {
        id: 'accounts',
        title: '3. Cuentas de Usuario',
        icon: 'account_circle',
        color: 'purple',
        content: 'Para utilizar ciertas funciones de StreamFlow Music, debe crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.',
        warning: [
          'Debe proporcionar información precisa y actualizada',
          'Es responsable de todas las actividades bajo su cuenta',
          'Debe notificar inmediatamente cualquier uso no autorizado'
        ]
      },
      {
        id: 'usage',
        title: '4. Uso Aceptable',
        icon: 'rule',
        color: 'orange',
        content: 'Usted se compromete a utilizar StreamFlow Music de manera responsable y de acuerdo con las leyes aplicables.',
        warning: [
          'Descargar o copiar contenido protegido',
          'Compartir credenciales de cuenta',
          'Usar el servicio para actividades comerciales no autorizadas',
          'Intentar hackear o comprometer el sistema'
        ]
      },
      {
        id: 'intellectual',
        title: '5. Propiedad Intelectual',
        icon: 'copyright',
        color: 'indigo',
        content: 'Todo el contenido disponible en StreamFlow Music está protegido por derechos de autor y otras leyes de propiedad intelectual. Los usuarios tienen una licencia limitada para el uso personal.'
      },
      {
        id: 'privacy',
        title: '6. Privacidad y Datos',
        icon: 'privacy_tip',
        color: 'teal',
        content: 'Su privacidad es importante para nosotros. Consulte nuestra Política de Privacidad para obtener información sobre cómo recopilamos, utilizamos y protegemos sus datos.'
      },
      {
        id: 'modifications',
        title: '7. Modificaciones del Servicio',
        icon: 'update',
        color: 'yellow',
        content: 'Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del servicio en cualquier momento, con o sin previo aviso.'
      },
      {
        id: 'contact',
        title: '8. Contacto',
        icon: 'contact_support',
        color: 'blue',
        content: 'Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de los siguientes medios.'
      }
    ];
  }

  acceptTerms(): void {
    console.log('Términos aceptados');
    this.router.navigate(['/home']);
  }

  goBack(): void {
    this.location.back();
  }

  trackBySection(index: number, section: TermsSection): string {
    return section.id;
  }

  getColorClasses(color: string): string {
    const colorMap: { [key: string]: string } = {
      'blue': 'text-blue-600',
      'green': 'text-green-600',
      'purple': 'text-purple-600',
      'orange': 'text-orange-600',
      'indigo': 'text-indigo-600',
      'teal': 'text-teal-600',
      'yellow': 'text-yellow-600'
    };
    return colorMap[color] || 'text-gray-600';
  }

  getBgColorClasses(color: string): string {
    const bgColorMap: { [key: string]: string } = {
      'blue': 'bg-blue-50 border-blue-400',
      'green': 'bg-green-50 border-green-400',
      'purple': 'bg-purple-50 border-purple-400',
      'orange': 'bg-orange-50 border-orange-400',
      'indigo': 'bg-indigo-50 border-indigo-400',
      'teal': 'bg-teal-50 border-teal-400',
      'yellow': 'bg-yellow-50 border-yellow-400'
    };
    return bgColorMap[color] || 'bg-gray-50 border-gray-400';
  }
}
