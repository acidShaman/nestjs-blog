import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserRole } from './interface/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() user: User): Observable<User | Object> {
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({error: err.message}))
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((token: string) => {
                return {access_token: token}
            })
        )
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<User> {
        return this.userService.findOne(+id);
    }


    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
        ): Observable<Pagination<User>> {
            limit = limit > 100 ? 100 : limit;
            return this.userService.paginate({page, limit, route: 'http://localhost:3000/user'})
    }


    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User>{
        return this.userService.deleteOne(+id);
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(+id, user)
    }



    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userService.updateRoleOfUser(+id, user)
    }
}
