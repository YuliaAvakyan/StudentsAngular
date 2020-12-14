import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {Student} from '../model/student';
import {FormControl, Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../MyErrorStateMatcher';
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  student: Student;
  @Output() onAdded: EventEmitter<any>;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  nameFormControl = new FormControl('', [
    Validators.required
  ]);

  phoneFormControl = new FormControl('+7', [
    Validators.pattern('^((\\+[1-9]-?)|0)?[0-9]{10}$')
  ]);

  matcher = new MyErrorStateMatcher();

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
      console.log('event return');
      return;
    }
    console.log('event create');
    this.onAdded.emit({name: name, email: email, phone: phone});
  }


}
