¡Perfecto! Vamos a construir **Clean Architecture en Angular** paso a paso, usando exactamente la estructura que propones, con **login**, **register**, y **tasks (listado/crear/actualizar)**. Incluyo **explicación conceptual**, **flujo de dependencias**, **mejores prácticas**, y **código mínimo funcional por archivo** para que puedas pegarlo en tu app y ampliarlo.

> **Objetivo:** separar el **qué** (reglas de negocio) del **cómo** (Angular/HTTP/UI), para que tu dominio no dependa de Angular ni de infraestructura.
> **Regla de oro:** las dependencias **siempre apuntan hacia adentro**, al dominio (core).

---

## 0) Visión general (capas y dependencias)

- **core (Domain + Use Cases)**
  Entidades, interfaces de repositorio y casos de uso. **No** usa Angular, **no** hace HTTP, **no** toca localStorage. Sólo lógica de negocio y contratos.
  Depende de: **nada**.

- **data (Interface Adapters / Infra)**
  Implementa los repositorios **contra** servicios concretos (HTTP, storage). Hace mapeos **DTO ⇄ Entidades**.
  Depende de: **core** y Angular (HttpClient, etc.).

- **presentation (UI)**
  Componentes, páginas, servicios de presentación/fachadas, routing, guards. Orquesta casos de uso.
  Depende de: **core** (usa los casos de uso) y puede depender de **data** via inyección.

- **shared**
  DTOs, utils, constantes, tipos de error, mappers, etc., **sin lógica de dominio**.

**Dirección de dependencias (→):**
`presentation → core`
`data → core`
`presentation` **no** conoce implementaciones concretas de `data`; se enlazan por **inyección** (tokens).

---

## 1) Estructura de carpetas (tu propuesta, confirmada)

```
src/
└── app/
    ├── core/
    │   ├── entities/
    │   │   ├── user.entity.ts
    │   │   └── task.entity.ts
    │   ├── use-cases/
    │   │   ├── auth/
    │   │   │   ├── login.use-case.ts
    │   │   │   └── register.use-case.ts
    │   │   └── tasks/
    │   │       ├── create-task.use-case.ts
    │   │       ├── get-tasks.use-case.ts
    │   │       └── update-task.use-case.ts
    │   └── repositories/
    │       ├── user.repository.ts
    │       └── task.repository.ts
    ├── data/
    │   ├── repositories/
    │   │   ├── user.repository.impl.ts
    │   │   └── task.repository.impl.ts
    │   └── services/
    │       ├── api.service.ts
    │       └── storage.service.ts
    ├── presentation/
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── login/
    │   │   │   └── register/
    │   │   └── tasks/
    │   │       ├── task-list/
    │   │       └── task-detail/
    │   ├── components/
    │   └── services/        # fachadas (AuthFacade, TaskFacade)
    └── shared/
        ├── models/          # DTOs
        ├── utils/
        └── constants/
```

> **Angular 16+** con componentes standalone, `inject()` y Reactive Forms.

---

## 2) Dominio (core)

### 2.1 Entidades

**`core/entities/user.entity.ts`**

```ts
export interface UserProps {
  id: string;
  email: string;
  name: string;
  token?: string; // opcional, si tu backend devuelve JWT con el usuario
}

export class User {
  private readonly _id: string;
  private _email: string;
  private _name: string;
  private _token?: string;

  constructor(props: UserProps) {
    // Validaciones de dominio mínimas:
    if (!props.email.includes("@")) throw new Error("Email inválido");
    this._id = props.id;
    this._email = props.email;
    this._name = props.name;
    this._token = props.token;
  }

  get id() {
    return this._id;
  }
  get email() {
    return this._email;
  }
  get name() {
    return this._name;
  }
  get token() {
    return this._token;
  }

  withToken(token: string) {
    this._token = token;
    return this;
  }
}
```

**`core/entities/task.entity.ts`**

```ts
export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  ownerId: string;
}

export class Task {
  constructor(private props: TaskProps) {
    if (!props.title?.trim()) throw new Error("Título requerido");
  }
  get id() {
    return this.props.id;
  }
  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description ?? "";
  }
  get done() {
    return this.props.done;
  }
  get ownerId() {
    return this.props.ownerId;
  }

  toggle(): Task {
    return new Task({ ...this.props, done: !this.props.done });
  }
}
```

### 2.2 Contratos de repositorio

**`core/repositories/user.repository.ts`**

```ts
import { Observable } from "rxjs";
import { User } from "../entities/user.entity";

export abstract class UserRepository {
  abstract login(email: string, password: string): Observable<User>;
  abstract register(
    name: string,
    email: string,
    password: string
  ): Observable<User>;
  abstract current(): Observable<User | null>;
  abstract logout(): Observable<void>;
}
```

**`core/repositories/task.repository.ts`**

```ts
import { Observable } from "rxjs";
import { Task } from "../entities/task.entity";

export abstract class TaskRepository {
  abstract getAll(): Observable<Task[]>;
  abstract create(title: string, description?: string): Observable<Task>;
  abstract update(task: Task): Observable<Task>;
}
```

### 2.3 Casos de uso

**Auth**

```ts
// core/use-cases/auth/login.use-case.ts
import { Observable } from "rxjs";
import { User } from "../../entities/user.entity";
import { UserRepository } from "../../repositories/user.repository";

export class LoginUseCase {
  constructor(private userRepo: UserRepository) {}
  execute(email: string, password: string): Observable<User> {
    return this.userRepo.login(email, password);
  }
}

// core/use-cases/auth/register.use-case.ts
import { Observable } from "rxjs";
import { User } from "../../entities/user.entity";
import { UserRepository } from "../../repositories/user.repository";

export class RegisterUseCase {
  constructor(private userRepo: UserRepository) {}
  execute(name: string, email: string, password: string): Observable<User> {
    return this.userRepo.register(name, email, password);
  }
}
```

**Tasks**

```ts
// core/use-cases/tasks/get-tasks.use-case.ts
import { Observable } from "rxjs";
import { Task } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";

export class GetTasksUseCase {
  constructor(private taskRepo: TaskRepository) {}
  execute(): Observable<Task[]> {
    return this.taskRepo.getAll();
  }
}

// core/use-cases/tasks/create-task.use-case.ts
import { Observable } from "rxjs";
import { Task } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";

export class CreateTaskUseCase {
  constructor(private taskRepo: TaskRepository) {}
  execute(title: string, description?: string): Observable<Task> {
    return this.taskRepo.create(title, description);
  }
}

// core/use-cases/tasks/update-task.use-case.ts
import { Observable } from "rxjs";
import { Task } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";

export class UpdateTaskUseCase {
  constructor(private taskRepo: TaskRepository) {}
  execute(task: Task): Observable<Task> {
    return this.taskRepo.update(task);
  }
}
```

> Nota: los casos de uso no saben nada de HTTP, ni Angular, ni LocalStorage.

---

## 3) Shared (DTOs, mappers, constantes)

**`shared/models/auth.dto.ts`**

```ts
export interface LoginRequestDTO {
  email: string;
  password: string;
}
export interface RegisterRequestDTO {
  name: string;
  email: string;
  password: string;
}
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  token?: string;
}
```

**`shared/models/task.dto.ts`**

```ts
export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  ownerId: string;
}
```

**`shared/utils/mappers.ts`**

```ts
import { User } from "../../core/entities/user.entity";
import { Task } from "../../core/entities/task.entity";
import { UserDTO } from "../models/auth.dto";
import { TaskDTO } from "../models/task.dto";

export const toUser = (dto: UserDTO) => new User(dto);
export const toTask = (dto: TaskDTO) => new Task(dto);

export const fromTask = (task: Task): TaskDTO => ({
  id: task.id,
  title: task.title,
  description: task.description,
  done: task.done,
  ownerId: task.ownerId,
});
```

**`shared/constants/index.ts`**

```ts
export const ENV = {
  API_URL: "http://localhost:3000/api", // ajústalo a tu backend
  STORAGE_TOKEN_KEY: "app.token",
};
```

---

## 4) Data (implementaciones + servicios)

### 4.1 Servicios base

**`data/services/api.service.ts`**

```ts
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ENV } from "../../shared/constants";

@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);

  get<T>(url: string) {
    return this.http.get<T>(ENV.API_URL + url);
  }
  post<T>(url: string, body: unknown) {
    return this.http.post<T>(ENV.API_URL + url, body);
  }
  put<T>(url: string, body: unknown) {
    return this.http.put<T>(ENV.API_URL + url, body);
  }
}
```

**`data/services/storage.service.ts`**

```ts
import { Injectable } from "@angular/core";
import { ENV } from "../../shared/constants";

@Injectable({ providedIn: "root" })
export class StorageService {
  setToken(token: string) {
    localStorage.setItem(ENV.STORAGE_TOKEN_KEY, token);
  }
  getToken(): string | null {
    return localStorage.getItem(ENV.STORAGE_TOKEN_KEY);
  }
  clearToken() {
    localStorage.removeItem(ENV.STORAGE_TOKEN_KEY);
  }
}
```

> **Interceptor (opcional pero recomendado)** para adjuntar JWT y manejar 401:

**`shared/utils/auth.interceptor.ts`**

```ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { StorageService } from "../../data/services/storage.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

### 4.2 Repositorios (implementaciones concretas)

**`data/repositories/user.repository.impl.ts`**

```ts
import { Injectable, InjectionToken } from "@angular/core";
import { Observable, map, tap, of } from "rxjs";
import { UserRepository } from "../../core/repositories/user.repository";
import { User } from "../../core/entities/user.entity";
import { ApiService } from "../services/api.service";
import { StorageService } from "../services/storage.service";
import { toUser } from "../../shared/utils/mappers";
import {
  LoginRequestDTO,
  RegisterRequestDTO,
  UserDTO,
} from "../../shared/models/auth.dto";

export const USER_REPOSITORY = new InjectionToken<UserRepository>(
  "USER_REPOSITORY"
);

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private api: ApiService,
    private storage: StorageService
  ) {}

  login(email: string, password: string): Observable<User> {
    const payload: LoginRequestDTO = { email, password };
    return this.api.post<UserDTO>("/auth/login", payload).pipe(
      map(toUser),
      tap((u) => u.token && this.storage.setToken(u.token!))
    );
  }

  register(name: string, email: string, password: string): Observable<User> {
    const payload: RegisterRequestDTO = { name, email, password };
    return this.api.post<UserDTO>("/auth/register", payload).pipe(
      map(toUser),
      tap((u) => u.token && this.storage.setToken(u.token!))
    );
  }

  current(): Observable<User | null> {
    // podría pegarle a /auth/me; aquí ejemplo simple con token presente
    const token = this.storage.getToken();
    if (!token) return of(null);
    return this.api.get<UserDTO>("/auth/me").pipe(map(toUser));
  }

  logout(): Observable<void> {
    this.storage.clearToken();
    return of(void 0);
  }
}
```

**`data/repositories/task.repository.impl.ts`**

```ts
import { Injectable, InjectionToken } from "@angular/core";
import { Observable, map } from "rxjs";
import { TaskRepository } from "../../core/repositories/task.repository";
import { Task } from "../../core/entities/task.entity";
import { ApiService } from "../services/api.service";
import { TaskDTO } from "../../shared/models/task.dto";
import { toTask, fromTask } from "../../shared/utils/mappers";

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>(
  "TASK_REPOSITORY"
);

@Injectable()
export class TaskRepositoryImpl implements TaskRepository {
  constructor(private api: ApiService) {}

  getAll(): Observable<Task[]> {
    return this.api
      .get<TaskDTO[]>("/tasks")
      .pipe(map((list) => list.map(toTask)));
  }

  create(title: string, description?: string): Observable<Task> {
    return this.api
      .post<TaskDTO>("/tasks", { title, description, done: false })
      .pipe(map(toTask));
  }

  update(task: Task): Observable<Task> {
    const dto = fromTask(task);
    return this.api.put<TaskDTO>(`/tasks/${dto.id}`, dto).pipe(map(toTask));
  }
}
```

---

## 5) Presentación (UI + fachadas + routing + guard)

### 5.1 Fachadas (servicios de presentación)

**`presentation/services/auth.facade.ts`**

```ts
import { Injectable, inject } from "@angular/core";
import { LoginUseCase } from "../../core/use-cases/auth/login.use-case";
import { RegisterUseCase } from "../../core/use-cases/auth/register.use-case";
import { UserRepository } from "../../core/repositories/user.repository";
import { USER_REPOSITORY } from "../../data/repositories/user.repository.impl";
import { BehaviorSubject, catchError, of, tap } from "rxjs";
import { User } from "../../core/entities/user.entity";

@Injectable({ providedIn: "root" })
export class AuthFacade {
  private userRepo = inject<UserRepository>(USER_REPOSITORY);
  private loginUC = new LoginUseCase(this.userRepo);
  private registerUC = new RegisterUseCase(this.userRepo);

  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  loadCurrent() {
    this.loading$.next(true);
    this.userRepo
      .current()
      .pipe(
        tap((u) => this._user$.next(u)),
        catchError((err) => {
          this.error$.next("No autenticado");
          return of(null);
        })
      )
      .subscribe({ complete: () => this.loading$.next(false) });
  }

  login(email: string, password: string) {
    this.loading$.next(true);
    this.loginUC
      .execute(email, password)
      .pipe(
        tap((u) => this._user$.next(u)),
        catchError((err) => {
          this.error$.next("Credenciales inválidas");
          return of(null);
        })
      )
      .subscribe({ complete: () => this.loading$.next(false) });
  }

  register(name: string, email: string, password: string) {
    this.loading$.next(true);
    this.registerUC
      .execute(name, email, password)
      .pipe(
        tap((u) => this._user$.next(u)),
        catchError((err) => {
          this.error$.next("No se pudo registrar");
          return of(null);
        })
      )
      .subscribe({ complete: () => this.loading$.next(false) });
  }

  logout() {
    this.userRepo.logout().subscribe(() => this._user$.next(null));
  }
}
```

**`presentation/services/task.facade.ts`**

```ts
import { Injectable, inject } from "@angular/core";
import { Task } from "../../core/entities/task.entity";
import { TaskRepository } from "../../core/repositories/task.repository";
import { TASK_REPOSITORY } from "../../data/repositories/task.repository.impl";
import { GetTasksUseCase } from "../../core/use-cases/tasks/get-tasks.use-case";
import { CreateTaskUseCase } from "../../core/use-cases/tasks/create-task.use-case";
import { UpdateTaskUseCase } from "../../core/use-cases/tasks/update-task.use-case";
import { BehaviorSubject, catchError, of, tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class TaskFacade {
  private taskRepo = inject<TaskRepository>(TASK_REPOSITORY);
  private getUC = new GetTasksUseCase(this.taskRepo);
  private createUC = new CreateTaskUseCase(this.taskRepo);
  private updateUC = new UpdateTaskUseCase(this.taskRepo);

  tasks$ = new BehaviorSubject<Task[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  load() {
    this.loading$.next(true);
    this.getUC
      .execute()
      .pipe(
        tap((list) => this.tasks$.next(list)),
        catchError((err) => {
          this.error$.next("Error cargando tareas");
          return of([]);
        })
      )
      .subscribe({ complete: () => this.loading$.next(false) });
  }

  create(title: string, description?: string) {
    this.loading$.next(true);
    this.createUC
      .execute(title, description)
      .pipe(
        tap((task) => this.tasks$.next([task, ...this.tasks$.value])),
        catchError((err) => {
          this.error$.next("No se pudo crear");
          return of(null);
        })
      )
      .subscribe({ complete: () => this.loading$.next(false) });
  }

  toggle(task: Task) {
    this.loading$.next(true);
    const updated = task.toggle();
    this.updateUC
      .execute(updated)
      .pipe(
        tap((t) =>
          this.tasks$.next(
            this.tasks$.value.map((x) => (x.id === t.id ? t : x))
          )
        ),
        catchError((err) => {
          this.error$.next("No se pudo actualizar");
          return of(null);
        })
      )
      .subscribe({ complete: () => this.loading$.next(false) });
  }
}
```

### 5.2 Páginas (login / register)

**`presentation/pages/auth/login/login.component.ts`**

```ts
import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthFacade } from "../../../services/auth.facade";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-login",
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Login</h1>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" placeholder="Email" type="email" />
      <input
        formControlName="password"
        placeholder="Password"
        type="password"
      />
      <button [disabled]="form.invalid || auth.loading$ | async">Entrar</button>
    </form>
    <p *ngIf="auth.error$ | async as err">{{ err }}</p>
  `,
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  auth = inject(AuthFacade);
  router = inject(Router);

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.auth.login(email!, password!);
    this.auth.user$.subscribe((u) => {
      if (u) this.router.navigateByUrl("/tasks");
    });
  }
}
```

**`presentation/pages/auth/register/register.component.ts`**

```ts
import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthFacade } from "../../../services/auth.facade";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-register",
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Registro</h1>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Nombre" />
      <input formControlName="email" placeholder="Email" type="email" />
      <input
        formControlName="password"
        placeholder="Password"
        type="password"
      />
      <button [disabled]="form.invalid || auth.loading$ | async">
        Crear cuenta
      </button>
    </form>
    <p *ngIf="auth.error$ | async as err">{{ err }}</p>
  `,
})
export default class RegisterComponent {
  private fb = inject(FormBuilder);
  auth = inject(AuthFacade);
  router = inject(Router);

  form = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;
    const { name, email, password } = this.form.value;
    this.auth.register(name!, email!, password!);
    this.auth.user$.subscribe((u) => {
      if (u) this.router.navigateByUrl("/tasks");
    });
  }
}
```

### 5.3 Páginas (tasks)

**`presentation/pages/tasks/task-list/task-list.component.ts`**

```ts
import { Component, effect, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaskFacade } from "../../../services/task.facade";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";

@Component({
  standalone: true,
  selector: "app-task-list",
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Tareas</h1>

    <form [formGroup]="form" (ngSubmit)="add()">
      <input formControlName="title" placeholder="Nueva tarea..." />
      <input
        formControlName="description"
        placeholder="Descripción (opcional)"
      />
      <button [disabled]="form.invalid || (task.loading$ | async)">
        Agregar
      </button>
    </form>

    <div *ngIf="task.error$ | async as err">{{ err }}</div>

    <ul>
      <li *ngFor="let t of task.tasks$ | async">
        <label>
          <input type="checkbox" [checked]="t.done" (change)="toggle(t)" />
          <strong [style.textDecoration]="t.done ? 'line-through' : ''">{{
            t.title
          }}</strong>
        </label>
        <small> — {{ t.description }}</small>
      </li>
    </ul>
  `,
})
export default class TaskListComponent {
  task = inject(TaskFacade);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    title: ["", Validators.required],
    description: [""],
  });

  constructor() {
    this.task.load();
  }

  add() {
    const { title, description } = this.form.value;
    this.task.create(title!, description || undefined);
    this.form.reset();
  }
  toggle(t: any) {
    this.task.toggle(t);
  }
}
```

_(El `task-detail` puede mostrar/editar una sola tarea; para el ejemplo, con toggle es suficiente.)_

### 5.4 Routing, Providers y Guard

**`app.routes.ts`**

```ts
import { Routes } from "@angular/router";
import LoginComponent from "./presentation/pages/auth/login/login.component";
import RegisterComponent from "./presentation/pages/auth/register/register.component";
import TaskListComponent from "./presentation/pages/tasks/task-list/task-list.component";
import { authGuard } from "./presentation/services/auth.guard";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "tasks", component: TaskListComponent, canActivate: [authGuard] },
  { path: "**", redirectTo: "login" },
];
```

**`presentation/services/auth.guard.ts`**

```ts
import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { StorageService } from "../../data/services/storage.service";

export const authGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const token = storage.getToken();
  if (!token) {
    router.navigateByUrl("/login");
    return false;
  }
  return true;
};
```

**`main.ts` (bootstrap con providers)**
Registra **interceptor** y enlaza **interfaces → implementaciones** con **InjectionToken**.

```ts
import {
  bootstrapApplication,
  provideClientHydration,
} from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";
import { Component } from "@angular/core";
import { authInterceptor } from "./app/shared/utils/auth.interceptor";
import {
  USER_REPOSITORY,
  UserRepositoryImpl,
} from "./app/data/repositories/user.repository.impl";
import {
  TASK_REPOSITORY,
  TaskRepositoryImpl,
} from "./app/data/repositories/task.repository.impl";
import { UserRepository } from "./app/core/repositories/user.repository";
import { TaskRepository } from "./app/core/repositories/task.repository";

@Component({
  standalone: true,
  selector: "app-root",
  template: `<router-outlet />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideClientHydration(),

    // Enlaces: interfaz -> implementación
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: TASK_REPOSITORY, useClass: TaskRepositoryImpl },

    // Opcional: si quieres inyectar por la clase abstracta
    { provide: UserRepository, useExisting: USER_REPOSITORY },
    { provide: TaskRepository, useExisting: TASK_REPOSITORY },
  ],
}).catch((err) => console.error(err));
```

---

## 6) Flujo de una acción (ej. Login)

1. **UI (LoginComponent)** valida formulario y llama `authFacade.login(email, pass)`.
2. **AuthFacade** invoca `LoginUseCase` (dominio).
3. **LoginUseCase** llama a `UserRepository.login()` (contrato).
4. **UserRepositoryImpl (data)** hace `api.post('/auth/login')`, mapea `UserDTO → User`, guarda token en `StorageService`.
5. Se emite `User` hacia la fachada, que actualiza el `user$`.
6. La UI reacciona y navega a `/tasks`.

> Si cambias el backend (REST → GraphQL), sólo cambias la **implementación** del repositorio en `data/`, el resto del sistema **no se entera**.

---

## 7) Mejores prácticas (y anti-patrones)

**Buenas:**

- Mantén **core** libre de Angular/infraestructura. Sólo TS puro.
- Usa **interfaces/abstract classes** + **InjectionToken** para ligar implementación.
- Centraliza mapeos DTO↔Entidad en **shared/utils/mappers**.
- Usa **fachadas** en presentación para no contaminar componentes con flujos RxJS complejos.
- Interceptor para **JWT** y manejo de **401**.
- **Guards** para rutas protegidas.
- **Errores tipados** (puedes crear `DomainError`, `InfraError` si necesitas granularidad).
- Tests **unitarios** en core (casos de uso) sin Angular TestBed.

**Evita:**

- Que `core` haga `HttpClient` o toque `localStorage`.
- Inyectar implementaciones concretas en componentes (depende de **interfaces**).
- Mezclar DTOs en la UI (usa Entidades).

---

## 8) Tests (ejemplo unit test simple de caso de uso)

**`core/use-cases/auth/login.use-case.spec.ts`**

```ts
import { of } from "rxjs";
import { LoginUseCase } from "./login.use-case";
import { UserRepository } from "../../repositories/user.repository";
import { User } from "../../entities/user.entity";

class UserRepoStub implements UserRepository {
  login(email: string, password: string) {
    return of(new User({ id: "1", email, name: "Test", token: "t" }));
  }
  register() {
    throw new Error("not used");
  }
  current() {
    return of(null);
  }
  logout() {
    return of(void 0);
  }
}

describe("LoginUseCase", () => {
  it("devuelve un usuario", (done) => {
    const uc = new LoginUseCase(new UserRepoStub());
    uc.execute("a@a.com", "123").subscribe((u) => {
      expect(u.email).toBe("a@a.com");
      done();
    });
  });
});
```

---

## 9) ¿Dónde usar Clean Architecture? (“mejores aplicaciones”)

- **Apps con dominio importante**: autenticación, permisos, workflows, facturación, e-commerce, educación, salud, banca.
- **Equipos grandes**: desacopla roles (UI vs Backend vs Dominios).
- **Proyectos longevos**: facilita refactors, cambios de API, migraciones a microfrontends o a GraphQL/sockets.

---

## 10) Siguientes pasos y extensiones

- **NgRx o Signals Store**: si tu estado crece, reemplaza `BehaviorSubject` por un store.
- **Manejo avanzado de errores**: tipificar y mapear a mensajes de UX.
- **Cache/estrategias** en `data` (RxJS shareReplay, IndexedDB).
- **CI/CD + Lint rules** para evitar importaciones cruzadas (e.g. eslint bounderies).
- **Feature modules** si prefieres modularizar `presentation/pages/tasks` como módulo.

---

## 11) Resumen rápido

- Define **Entidades** y **Casos de uso** en `core/` (sin Angular).
- Define **Repositorios (interfaces)** en `core/repositories`.
- Implementa repos en `data/` (HTTP, storage, mappers).
- Orquesta desde **fachadas** en `presentation/services`.
- Conecta todo en `main.ts` con **InjectionToken** y un **interceptor**.
- UI sencilla en `presentation/pages` usando Reactive Forms y Observables.

---

Si quieres, te preparo un **repo base** o convierto esto en un **Nx workspace** con pruebas, ESLint con _boundaries_, y plantillas de generación (`schematics`) para crear **nuevos casos de uso**/**repos** con un comando. ¿Lo armamos? 💪

Además, si me dices qué endpoints reales tienes en tu backend (URLs y payloads), adapto los DTOs y los mappers exactos.
