import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { PLATFORM_ID } from "@angular/core";
import { of, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";
import { User, LoginDto, RegisterDto, AuthResponse } from "../models";

describe("AuthService", () => {
  let service: AuthService;
  let apiService: jasmine.SpyObj<ApiService>;

  // Mock data
  const mockUser: User = {
    id: "1",
    email: "test@example.com",
    username: "testuser",
    profileImage: "",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  };

  const mockAuthResponse: AuthResponse = {
    token: "mock-access-token",
    refreshToken: "mock-refresh-token",
    user: mockUser,
  };

  const mockLoginDto: LoginDto = {
    email: "test@example.com",
    password: "password123",
  };

  const mockRegisterDto: RegisterDto = {
    email: "test@example.com",
    username: "testuser",
    password: "password123",
  };

  beforeEach(() => {
    // Create spy object for ApiService
    const apiServiceSpy = jasmine.createSpyObj("ApiService", [
      "post",
      "get",
      "put",
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: PLATFORM_ID, useValue: "browser" },
      ],
    });

    service = TestBed.inject(AuthService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    // Mock localStorage
    let store: { [key: string]: string } = {};
    spyOn(localStorage, "getItem").and.callFake(
      (key: string) => store[key] || null,
    );
    spyOn(localStorage, "setItem").and.callFake(
      (key: string, value: string) => (store[key] = value),
    );
    spyOn(localStorage, "removeItem").and.callFake(
      (key: string) => delete store[key],
    );
    spyOn(localStorage, "clear").and.callFake(() => (store = {}));
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("Login", () => {
    it("should login successfully", (done) => {
      apiService.post.and.returnValue(of(mockAuthResponse));

      service.login(mockLoginDto).subscribe({
        next: (response) => {
          expect(response).toEqual(mockAuthResponse);
          expect(apiService.post).toHaveBeenCalledWith(
            "/auth/login",
            mockLoginDto,
          );
          done();
        },
      });
    });

    it("should handle login error", (done) => {
      const errorResponse = { message: "Invalid credentials" };
      apiService.post.and.returnValue(throwError(() => errorResponse));

      service.login(mockLoginDto).subscribe({
        error: (error) => {
          expect(error).toEqual(errorResponse);
          done();
        },
      });
    });
  });

  describe("Current User", () => {
    it("should get current user", (done) => {
      apiService.get.and.returnValue(of(mockUser));

      service.getCurrentUser().subscribe({
        next: (user) => {
          expect(user).toEqual(mockUser);
          expect(apiService.get).toHaveBeenCalledWith("/auth/me");
          done();
        },
      });
    });

    it("should get current user value synchronously", () => {
      const user = service.getCurrentUserValue();
      expect(user).toBeNull(); // Initially null
    });
  });

  describe("Observables", () => {
    it("should provide current user observable", (done) => {
      service.currentUser$.subscribe((user) => {
        // La primera emisión será null por defecto
        expect(user).toBeNull();
        done();
      });
    });

    it("should provide login status observable", (done) => {
      service.isLoggedIn$.subscribe((isLoggedIn) => {
        // El estado inicial debe ser false
        expect(isLoggedIn).toBeFalsy();
        done();
      });
    });
  });
});
