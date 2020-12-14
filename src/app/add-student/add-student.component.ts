import {Component, OnInit, Output} from '@angular/core';

import {Student} from '../model/student';
import {EventEmitter} from '@angular/core';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  student: Student;
  @Output() onAdded: EventEmitter<any>;

  constructor() {
    this.onAdded = new EventEmitter();
  }

  ngOnInit(): void {
  }


  add(name: string, email: string, phone: string) {

    name = name.trim();
    email = email.trim();
    phone = phone.trim();
    if (!name || !email || !phone) {
      console.log("event return");
      return;
    }
    console.log("event create");
    this.onAdded.emit({name: name, email: email, phone: phone});
  }


}
