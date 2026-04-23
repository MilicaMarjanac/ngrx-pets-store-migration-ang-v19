import { inject, Injectable } from "@angular/core";
import { Pet } from "../models/pet";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PetService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}pets`;

  public getPets(): Observable<Pet[]> {
    return this.http
      .get<Pet[]>(this.endpoint)
      .pipe(catchError(this.handleError));
  }

  public createPet(pet: Pet): Observable<Pet> {
    return this.http
      .post<Pet>(this.endpoint, pet)
      .pipe(catchError(this.handleError));
  }

  public editPet(pet: Pet): Observable<Pet> {
    return this.http
      .put<Pet>(`${this.endpoint}/${pet.id}`, pet)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
