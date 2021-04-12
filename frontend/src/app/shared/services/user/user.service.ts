import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserData } from '../../interfaces/user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {}

  findAll(page: number, size: number): Observable<UserData> {
    let params = new HttpParams()

    params = params.append('page', String(page))
    params = params.append('limit', String(size))


    return this.http.get<UserData>('/api/user', {params}).pipe(
      map((userData: UserData) => {
        return userData;
      }),
      catchError(err => throwError(err))
    )
  }
}
