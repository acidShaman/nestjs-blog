import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  auth(email: string, password: string): Observable<any> {
    return this.http.post<any>('/api/user/login', {email, password}).pipe(
      map((token: any) => {
        localStorage.setItem('blog-token', token.access_token);
        return token;
      })
    );
  }
}
