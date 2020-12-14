import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Student} from './model/student';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {StudentService} from './student.service';
import {catchError, finalize, switchMap} from 'rxjs/operators';
import {EditStudentComponent} from './edit-student/edit-student.component';
import {MatDialog} from '@angular/material/dialog';
import {ParamMap} from '@angular/router';

export class StudentsDataSource implements DataSource<Student> {


  private studentsSubject = new BehaviorSubject<Student[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();

  public loading$ = this.loadingSubject.asObservable();

  constructor(private studentService: StudentService) {}

  connect(collectionViewer: CollectionViewer): Observable<Student[]> {
    return this.studentsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.studentsSubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadStudents(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 5) {

    this.loadingSubject.next(true);

    this.studentService.getPagedStudents(filter, sortDirection,
      pageIndex, pageSize).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(students =>
      {
        this.studentsSubject.next(students["content"]);
        this.countSubject.next(students["totalElements"]);
      });
  }


  add(student: Student) {
    console.log("event " + student.name);
    let name = student.name;
    let email = student.email;
    let phone = student.phone;
    this.studentService.createStudent({name, email, phone} as Student)
      .subscribe(student => {
        const students: Student[] = [...this.studentsSubject.value, student];
        this.studentsSubject.next(students);
        return student;
      });
  }

  delete(student: Student): void {
    this.studentService.deleteStudent(student.id).subscribe(() => {
      const students: Student[] = this.studentsSubject.value.filter(
        st => st.id != student.id );
      this.studentsSubject.next(students);
    });
  }

  //Не знаю куда деть диалог
  edit(student: Student, dialog: MatDialog): void {
    let dialogRef: any;
    this.studentService.getStudent(student.id.toString())
      .subscribe((student) => {
        dialogRef = dialog.open(EditStudentComponent,
          {data: {st: student}
          });

        //not sure
        dialogRef.afterClosed().subscribe(result => {
          if (result.event === "update") {
            const students: Student[] = [...this.studentsSubject.value];
            const foundIndex = students.findIndex(st => st.id === result.student.id);
            students[foundIndex] = result.student;
            this.studentsSubject.next(students);
            return result.student;
          }
        });

      });
  }
}
