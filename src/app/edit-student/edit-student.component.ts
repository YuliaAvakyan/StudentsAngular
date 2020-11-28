import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {StudentService} from '../student.service';
import {FormControl, Validators} from '@angular/forms';
import {Student} from '../model/student';
import {Elective} from '../model/Elective';
import {StudentMarkSubject} from '../model/StudentMarkSubject';
import {Mark} from '../model/Mark';
import {Subject} from '../model/Subject';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit{

  electives: Elective[];
  marks: Mark[];
  subjects: Subject[];

  constructor(public dialogRef: MatDialogRef<EditStudentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public studentService: StudentService) { }

  formControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    //Set data to dialogData for update table
    // this.studentService.dialogData = this.data;
    this.studentService.updateStudent(this.data, this.data.id).subscribe();

  }

  ngOnInit(): void {
    console.log(this.data.st.name)

    this.studentService.getElectives().subscribe((data) => {
      this.electives = data;

    });
    this.studentService.getMarks().subscribe((data) => {
      this.marks = data;
    });
    this.studentService.getSubjects().subscribe((data) => {
      this.subjects = data;
    });

  }

  checkElectives(elect: string):boolean {
    return this.data.st.electives.some((e) => e.name === elect);
  }

}
