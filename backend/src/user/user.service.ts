import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, Observable, pipe, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import { Like, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { User, UserRole } from './interface/user.interface';

@Injectable()
export class UserService {

    constructor (
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService
    ) {}

    
    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;


                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const { password, ...result } = user;
                        return result
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
        // return from(this.userRepository.save(user));
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(user => delete user.password)
                return users;
            })
        )
    }

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<User>) => {
                usersPageable.items.forEach(user => {
                    delete user.password;
                });

                return usersPageable;
            } )
        )
    }

    paginateFilterByUsername(options: IPaginationOptions, user: User): Observable<Pagination<User>> {
        console.log('Paginate', user.username)
        return from(this.userRepository.findAndCount({
            skip: (+options.page - 1) * +options.limit || 0,
            take: +options.limit || 10,
            order: {id: "ASC"},
            select: ['id', 'name', 'username', 'email', 'role'],
            where: [
                {username: Like(`%${user.username}%`)}
            ]
        })).pipe(
            map(([users, totalUsers]) => {
                const usersPageable: Pagination<User> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + ``,
                        next: options.route + `?limit=${options.limit}&page=${+options.page + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / +options.limit)}`
                    },
                    meta: {
                        currentPage: +options.page,
                        itemCount: users.length,
                        itemsPerPage: +options.limit,
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / +options.limit)
                    }
                };
                return usersPageable
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne(id)).pipe(
            map((user: User) => {
                const {password, ...result} = user;
                return result;
            })
        );
    }

    findOneByEmail(email: string): Observable<User> {
        return from(this.userRepository.findOne({email}));
    }

    deleteOne(id: number): Observable<any> {

        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;

        return from(this.userRepository.update(id, user));
    }

    login(user: User): Observable<any> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJwt(user).pipe(
                        map((token: string) => token)
                    )
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<any> {
        return this.findOneByEmail(email).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const { password, ...result } = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }

    updateRoleOfUser(id: number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user));
    }



}

