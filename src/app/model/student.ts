import {Elective} from './Elective';
import {StudentMarkSubject} from './StudentMarkSubject';

export class Student {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  electives: Elective[];
  studentMarkSubjects: StudentMarkSubject[];


  constructor(name: string, email: string, phone: string, electives: Elective[], studentMarkSubjects: StudentMarkSubject[]) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.electives = electives;
    this.studentMarkSubjects = studentMarkSubjects;
  }
}
