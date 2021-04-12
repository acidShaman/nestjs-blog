import { User } from "./user.interface";

export interface UserData {
    items: User[]
    meta: {
        totalItems: number,
        itemCount: number,
        itemsPerPage: number,
        totalPages: number,
        currentPage: number
    },
    links: {
        first: string,
        previous: string,
        next: string,
        last: string
    }
}