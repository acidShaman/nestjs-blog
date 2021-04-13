import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { map, tap } from 'rxjs/operators';
import { UserData } from '../../interfaces/user-data.interface';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  filterValue!: any;
  dataSource!: UserData;
  pageEvent!: PageEvent;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role']

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource() {
    this.userService.findAll(1, 5).pipe(
      map((userData) => this.dataSource = userData)
    ).subscribe();
  }

  onPaginateChange($event: PageEvent) {
    let page = $event.pageIndex
    let size = $event.pageSize


    if (this.filterValue) {
      this.userService.paginateByUsername(page, size, this.filterValue).pipe(
        map((userData) => this.dataSource = userData)
      ).subscribe()
    } else {
      page = page + 1;
      this.userService.findAll(page, size).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe()
    }
  }

  findByUsername(username: any) {
    console.log(username)
    this.userService.paginateByUsername(0, 5, username).pipe(
      map((userData) => {
        this.dataSource = userData
      })
    ).subscribe()
  }

}
