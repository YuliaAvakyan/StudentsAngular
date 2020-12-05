import {Component, OnInit, ViewChild} from '@angular/core';
import {Student} from '../model/student';
import {StudentService} from '../student.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {EditStudentComponent} from '../edit-student/edit-student.component';
import {MatDialog} from '@angular/material/dialog';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  displayedColumns = ['name', 'email', 'phone', 'actions'];
  dataSource: MatTableDataSource<Student>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataToTransmit: Student;

  constructor(private studentService: StudentService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.studentService.getStudents().subscribe((data) => {
      this.students = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });


    // console.log("students: " + this.students.entries());
  }

  add(name: string, email: string, phone: string) {
    name = name.trim();
    email = email.trim();
    phone = phone.trim();
    if (!name || !email || !phone) {
      return;
    }
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

  // TODO: something wrong with passing data with subscribe. Dialogref is undefined

  edit(student: Student): void {
    let dialogRef: any;
    this.studentService.getStudent(student.id.toString())
      .subscribe((student) => {
        dialogRef = this.dialog.open(EditStudentComponent, {
          data: {st: student}
        });

      });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 1) {
    //     const foundIndex = this.students.findIndex(x => x.id === student.id);
    //     this.students[foundIndex] = this.studentService.getDialogData();
    //     this.refreshTable();
    //   }
    //
    // });
  }

  private refreshTable() {
    this.dataSource.paginator = this.paginator;
  }


}
