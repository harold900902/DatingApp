import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { error } from 'protractor';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';
import { AuthService } from '../_services/auth.service';



@Injectable()
export class MessageResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageParams = 'Unread';
    
    constructor(private messageService: MessageService, private router: Router,
                private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
            return this.messageService.getMessagesForUser(this.authService.decodeToken.nameid,
                   this.messageParams, this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }


}