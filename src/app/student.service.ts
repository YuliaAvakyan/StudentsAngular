import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Student} from './model/student';
import {catchError, tap} from 'rxjs/operators';
import {Elective} from './model/Elective';
import {Mark} from './model/Mark';
import {Subject} from './model/Subject';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentsUrl: string = "http://127.0.0.1:8084/api/v1/students";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // Temporarily stores data from dialogs
  dialogData: any;

  constructor(private http: HttpClient){ }

  /** GET students from the server */
  getStudents() : Observable<Student[]>{
    return this.http.get<Student[]>(this.studentsUrl)
      .pipe(
      catchError(this.handleError<Student[]>('getStudents', []))
    );
  }
  /** GET student by id. Will 404 if id not found */
  getStudent(id: string): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
    return this.http.get<Student>(url).pipe(

      tap(_ => console.log(`fetched Student id=${id}`)),
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }

  /** POST: add a new Student to the server */
  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentsUrl + '/create', student, this.httpOptions).pipe(
      tap((newStudent: Student) => console.log(`created Student w/ id=${newStudent.id}`)),
      catchError(this.handleError<Student>('createStudent'))
    );
  }
  /** PUT: update the student on the server */
  updateStudent(student: Student, id: bigint): Observable<Student> {
    return this.http.put(this.studentsUrl + '/update/' + id, student, this.httpOptions).pipe(
      tap(_ => console.log(`updated student id=${student.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /** DELETE: delete Student by id */
  deleteStudent(id: bigint){
    return this.http.delete(this.studentsUrl + '/delete/' + id);
  }

  /** GET electives from the server */
  getElectives() : Observable<Elective[]>{
    return this.http.get<Elective[]>(this.studentsUrl + '/electives')
      .pipe(
        catchError(this.handleError<Elective[]>('getElectives', []))
      );
  }

  /** GET marks from the server */
  getMarks() : Observable<Mark[]>{
    return this.http.get<Mark[]>(this.studentsUrl + '/marks')
      .pipe(
        catchError(this.handleError<Mark[]>('getMark', []))
      );
  }

  /** GET subjects from the server */
  getSubjects() : Observable<Subject[]>{
    return this.http.get<Subject[]>(this.studentsUrl + '/subjects')
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

  getDialogData() {
    return this.dialogData;
  }

}
