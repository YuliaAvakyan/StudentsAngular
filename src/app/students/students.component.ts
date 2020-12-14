import {Component, OnInit, ViewChild} from '@angular/core';
import {Student} from '../model/student';
import {StudentService} from '../student.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {StudentsDataSource} from '../studentsDataSource';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  displayedColumns = ['name', 'email', 'phone', 'actions'];
  // dataSource: MatTableDataSource<Student> = new MatTableDataSource();
  dataSource: StudentsDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private studentService: StudentService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataSource = new StudentsDataSource(this.studentService);
    this.dataSource.loadStudents('', 'asc', 0, 5);
  }

  add(student: Student) {
    this.dataSource.add(student);
  }

  delete(student: Student): void {
    this.dataSource.delete(student);
  }

  edit(student: Student): void {
    this.dataSource.edit(student, this.dialog);
  }

  ngAfterViewInit() {
    this.dataSource.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadStudentsPage())
      )
      .subscribe();
  }

  loadStudentsPage() {
    this.dataSource.loadStudents(
      '',
      'asc',
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }



}
