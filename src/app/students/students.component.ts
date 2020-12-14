import {Component, OnInit, ViewChild} from '@angular/core';
import {Student} from '../model/student';
import {StudentService} from '../student.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {EditStudentComponent} from '../edit-student/edit-student.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {AddStudentComponent} from '../add-student/add-student.component';
import {StudentsDataSource} from './studentsDataSource';
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
    // this.studentService.getStudents()
    //   .subscribe((data) => {
    //     this.students = data;
    //     console.log(data);
    //     this.dataSource = new MatTableDataSource(data);
    //     this.dataSource.paginator = this.paginator;
    //
    //   });

    this.dataSource = new StudentsDataSource(this.studentService);
    this.dataSource.loadStudents('', 'asc', 0, 3);
  }

  add(student: any) {
    console.log("event " + student.name);
    let name = student.name;
    let email = student.email;
    let phone = student.phone;
    this.studentService.createStudent({name, email, phone} as Student)
      .subscribe(student => {
        this.students.push(student);
        this.refreshTable();
      });
  }

  delete(student: Student): void {
    // this.students = this.students.filter(h => h !== student);
    this.studentService.deleteStudent(student.id).subscribe(() => {
      // const foundIndex = this.students.findIndex(x => x.id === student.id);
      // this.students.splice(foundIndex, 1);
      this.students.pop();
      this.refreshTable();
    });
  }

  edit(student: Student): void {
    let dialogRef: any;
    this.studentService.getStudent(student.id.toString())
      .subscribe((student) => {
        dialogRef = this.dialog.open(EditStudentComponent,
          {data: {st: student}
          });

        //not sure
        dialogRef.afterClosed().subscribe(result => {
          if (result.event === "update") {
            const foundIndex = this.students.findIndex(x => x.id === student.id);
            this.students[foundIndex] = result.student;
            this.refreshTable();
          }
        });

      });


  }

  private refreshTable() {
    // this.dataSource.paginator = this.paginator;
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
