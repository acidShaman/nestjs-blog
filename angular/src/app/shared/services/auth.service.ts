import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { LoginForm } from '../interfaces/login.interface';
import { RegisterForm } from '../interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  auth(credentials: LoginForm): Observable<any> {
    return this.http.post<any>('/api/user/login', credentials).pipe(
      map((token: any) => {
        localStorage.setItem('blog-token', token.access_token);
        return token;
      })
    );
  }

  create(credentials: RegisterForm): Observable<any> {
    return this.http.post<any>('/api/user/', credentials).pipe(
      map((res) => {
        console.log(res);
        return res;
      })
    )
  }
}
