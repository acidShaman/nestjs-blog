import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { User } from 'src/user/interface/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateJwt(user: User): Observable<any> {
        return from<any>(this.jwtService.signAsync({user}));
    }

    hashPassword(password: string): Observable<String> {
        return from<string>(bcrypt.hash(password, 10))
    }

    comparePasswords(newPassword: string, passwordHash: string): Observable<any | boolean> {
        return of<any | boolean>(bcrypt.compare(newPassword, passwordHash))
    }
}
