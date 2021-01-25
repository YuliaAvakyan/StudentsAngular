import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Student} from './model/student';
import {catchError, map, tap} from 'rxjs/operators';
import {Elective} from './model/Elective';
import {Mark} from './model/Mark';
import {Subject} from './model/Subject';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient){ }


  getStudents() : Observable<Student[]>{
    return this.http.get<Student[]>(environment.apiUrl)
      .pipe(map(r => r.map(p => {
            return {...p, electives: [], studentMarkSubjects: []}
          })
        ),
        catchError(this.handleError<Student[]>('getStudents', []))
      );
  }

  getPagedStudents(filter = '', sortOrder = 'asc',
                   pageNumber = 0, pageSize = 3) : Observable<Student[]>{
    return (this.http.get<Student[]>(environment.apiUrl + "/paged", {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sortOrder)
        .set('page', pageNumber.toString())
        .set('size', pageSize.toString())
    }));

  }

  getStudent(id: string): Observable<Student> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.get<Student>(url).pipe(
      map((s) => {
        return {...s, studentMarkSubjects: s.studentMarkSubjects.map(m => {
            return { mark: m.mark, subject: m.subject}
        })}
      }),
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(environment.apiUrl + '/create', student, this.httpOptions).pipe(
      tap((newStudent: Student) => console.log(`created Student w/ id=${newStudent.id}`)),
      catchError(this.handleError<Student>('createStudent'))
    );
  }

  updateStudent(student: Student, id: bigint): Observable<Student> {
    return this.http.put(environment.apiUrl + '/update/' + id, student, this.httpOptions).pipe(
      tap(_ => console.log(`updated student id=${student.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  deleteStudent(id: bigint){
    return this.http.delete(environment.apiUrl + '/delete/' + id);
  }

  getElectives() : Observable<Elective[]>{
    return this.http.get<Elective[]>(environment.apiUrl + '/electives')
      .pipe(
        catchError(this.handleError<Elective[]>('getElectives', []))
      );
  }

  getMarks() : Observable<Mark[]>{
    return this.http.get<Mark[]>(environment.apiUrl + '/marks')
      .pipe(
        catchError(this.handleError<Mark[]>('getMark', []))
      );
  }

  getSubjects() : Observable<Subject[]>{
    return this.http.get<Subject[]>(environment.apiUrl + '/subjects')
      .pipe(
        catchError(this.handleError<Subject[]>('getSubjects', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
