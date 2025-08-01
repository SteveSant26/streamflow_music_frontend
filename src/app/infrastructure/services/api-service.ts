import { HttpClient, httpResource } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(environment.API_URL + url);
  }

  getWithSignal<T>(url: string) {
    return httpResource(() => environment.API_URL + url);
  }

  post<T>(url: string, body: unknown) {
    return this.http.post<T>(environment.API_URL + url, body);
  }

  put<T>(url: string, body: unknown) {
    return this.http.put<T>(environment.API_URL + url, body);
  }
}
