import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../interface/user.interface";



@Entity()
export class UserEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;
}