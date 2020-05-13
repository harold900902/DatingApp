import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

getMessagesForUser(userId, messageParams, page?, itemsPerPage?): Observable<PaginatedResult<Message[]>> {
 
  const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
  let params = new HttpParams();
  
  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }
  if (messageParams != null) {
    params = params.append('MessageContainer', messageParams);
  }
  return this.http.get<Message[]>(this.baseUrl + 'users/' + userId + '/messages', {observe: 'response', params})
  .pipe(
    map(respose => {
      paginatedResult.result = respose.body;
      if (respose.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(respose.headers.get('Pagination'));
      }
      return paginatedResult;
    })
  );
}
getMessageThread(userId: number, recipientId: number) {
  return this.http.get<Message[]>(this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId);
}

sendMessage(id: number, message: Message) {
  return this.http.post(this.baseUrl + 'users/' + id + '/messages/', message);
}
deleteMessage(id: number, userId: number){
  return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
}
MarkMessageAsRead(userId: number, id: number){
  return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id + '/read', {}).subscribe();
}

}
