import {Subject} from './Subject';
import {Mark} from './Mark';


export class StudentMarkSubject {
  // id: bigint;
  subject: Subject;
  mark: Mark;


  constructor(subject: Subject, mark: Mark) {
    // this.id = id;
    this.subject = subject;
    this.mark = mark;
  }
}
