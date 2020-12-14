import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Student} from './model/student';
import {catchError, map, tap} from 'rxjs/operators';
import {Elective} from './model/Elective';
import {Mark} from './model/Mark';
import {Subject} from './model/Subject';
import {environment} from '../environments/environment';
import {stringify} from 'querystring';
import {mark} from '@angular/compiler-cli/src/ngtsc/perf/src/clock';
import {StudentMarkSubject} from './model/StudentMarkSubject';
import {log} from 'util';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  // private studentsUrl: string = "http://127.0.0.1:8084/api/v1/students";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient){ }

  /** GET students from the server */
  getStudents() : Observable<Student[]>{
    return this.http.get<Student[]>(environment.apiUrl)
      .pipe(map(r => r.map(p => {
            return {...p, electives: [], studentMarkSubjects: []}
          })
        ),
        catchError(this.handleError<Student[]>('getStudents', []))
      );
  }
  /** GET paged students from the server */
  getPagedStudents(filter = '', sortOrder = 'asc',
                   pageNumber = 0, pageSize = 3) : Observable<Student[]>{
    return this.http.get<Student[]>(environment.apiUrl + "/paged", {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sortOrder)
        .set('page', pageNumber.toString())
        .set('size', pageSize.toString())
    });
      // .pipe( map(res => res["content"])
      // );

  }


  /** GET student by id. Will 404 if id not found */
  getStudent(id: string): Observable<Student> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.get<Student>(url).pipe(
      map((s) => {
        return {...s, studentMarkSubjects: s.studentMarkSubjects.map(m => {
            return { mark: m.mark, subject: m.subject}
        })}
        console.log(s);
      }),
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }

  /** POST: add a new Student to the server */
  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(environment.apiUrl + '/create', student, this.httpOptions).pipe(
      tap((newStudent: Student) => console.log(`created Student w/ id=${newStudent.id}`)),
      catchError(this.handleError<Student>('createStudent'))
    );
  }
  /** PUT: update the student on the server */
  updateStudent(student: Student, id: bigint): Observable<Student> {
    return this.http.put(environment.apiUrl + '/update/' + id, student, this.httpOptions).pipe(
      tap(_ => console.log(`updated student id=${student.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /** DELETE: delete Student by id */
  deleteStudent(id: bigint){
    return this.http.delete(environment.apiUrl + '/delete/' + id);
  }

  /** GET electives from the server */
  getElectives() : Observable<Elective[]>{
    return this.http.get<Elective[]>(environment.apiUrl + '/electives')
      .pipe(
        catchError(this.handleError<Elective[]>('getElectives', []))
      );
  }

  /** GET marks from the server */
  getMarks() : Observable<Mark[]>{
    return this.http.get<Mark[]>(environment.apiUrl + '/marks')
      .pipe(
        catchError(this.handleError<Mark[]>('getMark', []))
      );
  }

  /** GET subjects from the server */
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

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
