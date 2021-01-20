import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {AppComponent} from '../app.component';
import {StudentsComponent} from '../students/students.component';
import {Student} from '../model/student';
import {StudentsDataSource} from '../studentsDataSource';

export class WebSocketAPI {
  webSocketEndPoint: string = 'http://localhost:8084/ws';
  topic_creation: string = "/topic/creation";
  topic_delete: string = "/topic/delete";
  stompClient: any;
  dataSource: StudentsDataSource;
  // appComponent: AppComponent;
  // constructor(appComponent: AppComponent){
  //   this.appComponent = appComponent;
  // }
  constructor() {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    this._connect();
  }
  _connect() {
    console.log("Initialize WebSocket Connection");
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe(_this.topic_creation, function (sdkEvent) {
        _this.onCreation(sdkEvent);
      });
      _this.stompClient.subscribe(_this.topic_delete, function (sdkEvent) {
        _this.onDelete(sdkEvent);
      });
      // _this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }


  // _send(message) {
  //   console.log("calling logout api via web socket");
  //   this.stompClient.send("/app/hello", {}, JSON.stringify(message));
  // }
  //
  // addStudent(student: Student): void {
  //   this.stompClient.send('/app/addStudent', {}, JSON.stringify(student));
  // }
  //
  // deleteStudent(id: bigint): void {
  //   console.log("ID: " + id);
  //   this.stompClient.send('/app/deleteStudent', {}, JSON.stringify(id));
  // }

  onCreation(message) {
    console.log("Message Received from Server :: " + message);
    this.dataSource.handleCreationMessage(message.body);
  }

  onDelete(message) {
    console.log("Message Received from Server :: " + message);
    this.dataSource.handleDeleteMessage(message.body);
  }
}
