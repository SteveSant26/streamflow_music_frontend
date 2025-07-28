import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  setToken(token: string) {
    localStorage.setItem(environment.STORAGE_TOKEN_KEY, token);
  }
  getToken(): string | null {
    return localStorage.getItem(environment.STORAGE_TOKEN_KEY);
  }
  clearToken() {
    localStorage.removeItem(environment.STORAGE_TOKEN_KEY);
  }
}
