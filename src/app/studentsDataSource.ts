import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Student} from './model/student';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {StudentService} from './student.service';
import {catchError, finalize} from 'rxjs/operators';
import {EditStudentComponent} from './edit-student/edit-student.component';
import {MatDialog} from '@angular/material/dialog';
import {WebSocketAPI} from './ws-api/WebSocketAPI';
import {patchTsGetExpandoInitializer} from '@angular/compiler-cli/ngcc/src/packages/patch_ts_expando_initializer';

export class StudentsDataSource implements DataSource<Student> {

  private studentsSubject = new BehaviorSubject<Student[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();

  public loading$ = this.loadingSubject.asObservable();

  webSocketAPI: WebSocketAPI;
  private createdStudent: any;
  private deletedStudentId: any;

  constructor(private studentService: StudentService) {
    this.webSocketAPI = new WebSocketAPI();
    this.webSocketAPI.dataSource = this;
  }

  connect(collectionViewer: CollectionViewer): Observable<Student[]> {
    return this.studentsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.studentsSubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
    this.webSocketAPI._disconnect();
  }


  loadStudents(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 5) {

    this.loadingSubject.next(true);

    this.studentService.getPagedStudents(filter, sortDirection,
      pageIndex, pageSize).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false)),
    )
      .subscribe(students => {
        this.studentsSubject.next(students['content']);
        this.countSubject.next(students['totalElements']);
      });
  }

  add(student: Student) {
    let id = student.id;
    let name = student.name;
    let email = student.email;
    let phone = student.phone;

    this.studentService.createStudent({name, email, phone} as Student).subscribe()
  }

  delete(student: Student): void {
    console.log(student.id);
    this.studentService.deleteStudent(student.id).subscribe()
  }

  //Не знаю куда деть диалог
  edit(student: Student, dialog: MatDialog): void {
    let dialogRef: any;
    this.studentService.getStudent(student.id.toString())
      .subscribe((student) => {
        dialogRef = dialog.open(EditStudentComponent,
          {
            data: {st: student}
          });

        dialogRef.afterClosed().subscribe(result => {
          if (result.event === 'update') {
            const students: Student[] = [...this.studentsSubject.value];
            const foundIndex = students.findIndex(st => st.id === result.student.id);
            students[foundIndex] = result.student;
            this.studentsSubject.next(students);
            return result.student;
          }
        });

      });
  }

  handleCreationMessage(message) {
    console.log('HANDLE MES ' + message);
    this.createdStudent = JSON.parse(message);

    let name = this.createdStudent.name;
    let email = this.createdStudent.email;
    let phone = this.createdStudent.phone;
    let student = new Student(name, email, phone, [], []);
    student.id = this.createdStudent.id;
    const students: Student[] = [...this.studentsSubject.value, student];
    this.studentsSubject.next(students);
    // finalize(() => this.studentsSubject.next(students));
    return student;
  }

  handleDeleteMessage(message) {
    console.log('HANDLE MES ' + message);
    this.deletedStudentId = JSON.parse(message);

    const students: Student[] = this.studentsSubject.value.filter(
      st => st.id != this.deletedStudentId );
    this.studentsSubject.next(students);

  }

}
