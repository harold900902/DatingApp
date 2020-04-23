import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { error } from 'protractor';



@Injectable()
export class ListsResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;
    likeParams = 'likers';
    userParams: any = {};

    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        this.userParams.gender = 'all';
        this.userParams.minAge = 18;
        this.userParams.maxAge = 100;
        this.userParams.orderBy = 'lastActive';
        return this.userService.getUsers(this.pageNumber, this.pageSize, this.userParams, this.likeParams).pipe(
            catchError( error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }


}