import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Student} from '../model/student';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {StudentService} from '../student.service';
import {catchError, finalize} from 'rxjs/operators';

export class StudentsDataSource implements DataSource<Student> {


  private studentsSubject = new BehaviorSubject<Student[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();

  public loading$ = this.loadingSubject.asObservable();
  totalEl: any;

  constructor(private studentService: StudentService) {}

  connect(collectionViewer: CollectionViewer): Observable<Student[]> {
    return this.studentsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.studentsSubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadStudents(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {

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
}
