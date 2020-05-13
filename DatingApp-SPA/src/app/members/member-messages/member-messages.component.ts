import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/_services/message.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/user';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private route: ActivatedRoute, private messageService: MessageService,
              private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.loadMessages();
  }
  loadMessages() {
    const currentUserId = +this.authService.decodeToken.nameid;
    this.messageService.getMessageThread(this.authService.decodeToken.nameid, this.recipientId)
    .pipe(tap(messages => {
      for (let i = 0; i < messages.length; i++) {
       if(messages[i].isRead === false && messages[i].recipientId ===  currentUserId) {
         this.messageService.MarkMessageAsRead(currentUserId, messages[i].id);
       }
      }
    }))
    .subscribe(
      (res: Message[]) => {
        this.messages = res;
      }, error => {
        this.alertify.error(error);
      }
    );
  }
  sendMessage(){
   this.newMessage.recipientId = this.recipientId;
   this.messageService.sendMessage(this.authService.decodeToken.nameid, this.newMessage).subscribe((message: Message) => {
     // this.messages.unshift(message);
      this.messages.push(message);
      this.newMessage.content = '';
   }, error => {
     this.alertify.error(error);
   }
   );
  }
  

}
