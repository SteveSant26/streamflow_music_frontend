import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ApiService } from "./api.service";
import { environment } from "../../environments/environment";

describe("ApiService", () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should generate correct full URL", () => {
    const endpoint = "/songs";
    const expectedUrl = `${environment.apiUrl}/songs`;

    expect(service.getFullUrl(endpoint)).toBe(expectedUrl);
  });

  describe("HTTP Methods", () => {
    it("should make GET request with correct URL", () => {
      const testData = { id: 1, name: "Test Song" };
      const endpoint = "/songs/1";

      service.get(endpoint).subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe("GET");
      expect(req.request.headers.get("Content-Type")).toBe("application/json");

      req.flush(testData);
    });

    it("should make POST request with correct data", () => {
      const testData = { name: "New Song", artist: "Test Artist" };
      const responseData = { id: 1, ...testData };
      const endpoint = "/songs";

      service.post(endpoint, testData).subscribe((data) => {
        expect(data).toEqual(responseData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(testData);
      expect(req.request.headers.get("Content-Type")).toBe("application/json");

      req.flush(responseData);
    });

    it("should handle error responses", () => {
      const endpoint = "/songs/999";
      const errorMessage = "Song not found";

      service.get(endpoint).subscribe({
        next: () => fail("Should have failed with 404 error"),
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.flush(
        { message: errorMessage },
        { status: 404, statusText: "Not Found" },
      );
    });
  });

  describe("Pagination", () => {
    it("should handle paginated responses", () => {
      const paginatedResponse = {
        count: 100,
        next: "http://api.example.com/songs/?page=2",
        previous: null,
        results: [
          { id: 1, name: "Song 1" },
          { id: 2, name: "Song 2" },
        ],
      };
      const endpoint = "/songs/";

      service.get(endpoint).subscribe((data: any) => {
        expect(data.count).toBe(100);
        expect(data.results.length).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.flush(paginatedResponse);
    });
  });
});
