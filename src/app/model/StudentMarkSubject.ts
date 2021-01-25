import {Subject} from './Subject';
import {Mark} from './Mark';


export class StudentMarkSubject {
  subject: Subject;
  mark: Mark;


  constructor(subject: Subject, mark: Mark) {
    this.subject = subject;
    this.mark = mark;
  }
}
