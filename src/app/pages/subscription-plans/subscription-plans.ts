import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular: boolean;
  buttonText: string;
  buttonClass: string;
}

@Component({
  selector: "app-subscription-plans",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./subscription-plans.html",
  styleUrls: ["./subscription-plans.css"],
})
export class SubscriptionPlansComponent {
  plans: Plan[] = [
    {
      id: "free",
      name: "Plan Gratuito",
      price: 0,
      period: "siempre",
      features: [
        "Reprodución con anuncios",
        "Calidad estándar",
        "Acceso a la biblioteca básica",
        "Sin descargas offline",
        "Sesión en 1 dispositivo",
      ],
      popular: false,
      buttonText: "Comenzar Gratis",
      buttonClass: "btn-outline",
    },
    {
      id: "monthly",
      name: "Plan Mensual",
      price: 9.99,
      period: "mes",
      features: [
        "Sin anuncios",
        "Calidad de audio alta",
        "Biblioteca completa",
        "Descargas offline ilimitadas",
        "Sesión en hasta 5 dispositivos",
        "Playlists personalizadas",
      ],
      popular: true,
      buttonText: "Suscribirse Mensual",
      buttonClass: "btn-primary",
    },
    {
      id: "annual",
      name: "Plan Anual",
      price: 99.99,
      period: "año",
      features: [
        "Todo del plan mensual",
        "2 meses gratis (ahorra $20)",
        "Calidad de audio premium",
        "Acceso anticipado a nuevas funciones",
        "Soporte prioritario",
        "Sesión en dispositivos ilimitados",
      ],
      popular: false,
      buttonText: "Suscribirse Anual",
      buttonClass: "btn-success",
    },
  ];

  constructor(private readonly router: Router) {}

  selectPlan(planId: string): void {
    console.log(`Plan seleccionado: ${planId}`);

    switch (planId) {
      case "free":
        // Redirigir al registro gratuito
        this.router.navigate(["/register"]);
        break;
      case "monthly":
        // Redirigir al proceso de pago mensual
        this.router.navigate(["/payment"], {
          queryParams: { plan: "monthly" },
        });
        break;
      case "annual":
        // Redirigir al proceso de pago anual
        this.router.navigate(["/payment"], { queryParams: { plan: "annual" } });
        break;
      default:
        console.error("Plan no reconocido");
    }
  }

  getMonthlyPrice(plan: Plan): number {
    if (plan.id === "annual") {
      return plan.price / 12;
    }
    return plan.price;
  }

  getSavingsText(plan: Plan): string {
    if (plan.id === "annual") {
      const monthlyTotal = 9.99 * 12;
      const savings = monthlyTotal - plan.price;
      return `Ahorra $${savings.toFixed(2)} al año`;
    }
    return "";
  }
}
