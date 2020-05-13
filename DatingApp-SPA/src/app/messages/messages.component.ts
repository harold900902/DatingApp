import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messageContainer = 'Unread';
  messages: Message[];
  pagination: Pagination;
  

  constructor(private route: ActivatedRoute, private messageService: MessageService,
              private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
 
  }
  loadMessages(){
    this.messageService.getMessagesForUser(this.authService.decodeToken.nameid, this.messageContainer, this.pagination.currentPage,
      this.pagination.itemsPerPage).subscribe(
      (res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      }
    );
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
  deleteMessage(id: number){
    this.alertify.confirm('Are you sure you want to delete this message', ()=>{
      this.messageService.deleteMessage(id, this.authService.decodeToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('Message has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the message');
      });

    })
    
  }

}
