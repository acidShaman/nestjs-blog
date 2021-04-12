import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "src/user/interface/user.interface";
import { UserService } from "src/user/user.service";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userService: UserService
        ) {}
    
    canActivate(context: ExecutionContext): any | Promise<any> | Observable<any> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        } 

        const request = context.switchToHttp().getRequest();
        const user: User = request.user.user;


        return this.userService.findOne(user.id).pipe(
            map((user: User) => {
                const hasRole = () => roles.indexOf(user.role) > -1;
                let hasPermission: boolean = false;
                if (hasRole()) {
                    hasPermission = true;
                }
                return user && hasPermission;
            })
        )
    }
}