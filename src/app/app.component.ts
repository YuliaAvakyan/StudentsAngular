import { Component } from '@angular/core';
import {WebSocketAPI} from './ws-api/WebSocketAPI';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'studentsApp';

  // webSocketAPI: WebSocketAPI;
  // greeting: any;
  // name: string;

  ngOnInit() {
    // this.webSocketAPI = new WebSocketAPI(new AppComponent());
  }

  // connect(){
  //   this.webSocketAPI._connect();
  // }
  //
  // disconnect(){
  //   this.webSocketAPI._disconnect();
  // }
  //
  // sendMessage(){
  //   this.webSocketAPI._send(this.name);
  // }
  //
  // handleMessage(message){
  //   this.greeting = message;
  // }
}
