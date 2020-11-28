import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import {MessageDTO } from 'src/app/DTO/MessageDTO';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public title = 'Test';
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // calls the service method to get the new messages sent
    this.chatService.retrieveMappedObject().subscribe( (receivedObj: MessageDTO) => { this.addToInbox(receivedObj); });
  }

  msgDto: MessageDTO = new MessageDTO();
  msgInboxArray: MessageDTO[] = [];

  send(): void {
    if (this.msgDto) {
      if (this.msgDto.user.length === 0 || this.msgDto.user.length === 0){
        window.alert('Both fields are required.');
        return;
      } else {
        // Send the message via a service
        console.log(this.msgDto.message);
        this.chatService.broadcastMessage(this.msgDto);
      }
    }
  }

  addToInbox(obj: MessageDTO) {
    const newObj = new MessageDTO();
    newObj.user = obj.user;
    newObj.message = obj.message;
    this.msgInboxArray.push(newObj);

  }
}


