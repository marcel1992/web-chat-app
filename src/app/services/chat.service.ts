import { Injectable, OnInit  } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { MessageDTO } from '../DTO/MessageDTO';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private  connection: any = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:5001/chat')   // mapping to the chathub as in startup.cs
  .configureLogging(signalR.LogLevel.Information)
  .build();
readonly POST_URL = 'https://localhost:5001/api/chat/send';

private receivedMessageObject: MessageDTO = new MessageDTO();
private sharedObj = new Subject<MessageDTO>();

constructor(private http: HttpClient) {
  this.connection.onclose(async () => {
    await this.start();
  });
  this.connection.on('OnReceive', (message) => { this.mapReceivedMessage(message); });
  this.connection.on('OnUpdateCountAsync', (count) => { this.updateCount(count); });
  this.start();
}

  // Start the connection
  public async start() {
    try {
      await this.connection.start();
      console.log('connected');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  private mapReceivedMessage(message: MessageDTO): void {
    this.receivedMessageObject = message;
    this.sharedObj.next(this.receivedMessageObject);
  }

  private updateCount(count: number): void {
    console.log(count);
  }
   /* ****************************** Public Mehods **************************************** */

  // Calls the controller method
  public broadcastMessage(msgDto: any) {
    console.log(this.POST_URL);
    this.http.post(this.POST_URL, msgDto).subscribe(data => console.log(data));
  }

  public retrieveMappedObject(): Observable<MessageDTO> {
    return this.sharedObj.asObservable();
  }

}
